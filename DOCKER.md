# Docker, from scratch

This doc explains what Docker actually does, then walks through exactly how it's used in Writify.

## The concept

**The problem Docker solves**: "it works on my machine" — your laptop has Node 20, a specific set of installed packages, maybe a locally running Mongo. A server somewhere else has different versions of all of that, or is missing pieces entirely. Docker packages an application together with everything it needs to run, so it behaves identically everywhere.

**Image vs. container** — the one distinction that unlocks the rest:
- An **image** is a read-only, frozen bundle: an OS filesystem layer, a language runtime, your code, and your dependencies, all baked together. You build it once.
- A **container** is a running process started from an image. You can start many containers from the same image; each one is isolated from the others and from the host machine (its own filesystem view, its own process list), but they all run the exact same bytes.

Think of the image as a class and the container as an instance of it.

**Dockerfile** — the recipe for building an image. Each line is an instruction that adds a layer on top of the previous one (start from a base image, copy in files, run a command, set what runs on startup). Docker caches layers, so re-running a build after only changing your source code skips re-doing the slow steps (like reinstalling dependencies) as long as the earlier layers didn't change.

**docker-compose** — for running *multiple* containers together as one unit (e.g., your API server + a database + a cache), each defined as a "service" in a single YAML file, sharing a private network so they can reach each other by service name instead of `localhost`.

**Volumes** — a way to persist data outside a container's own filesystem. Containers are meant to be disposable (stop one, start a fresh one from the same image, nothing is lost) — but a database needs its data to survive that. A volume is a folder on the host machine that a container mounts, so data written to it outlives the container.

**Networks** — compose automatically creates a private network for all services defined in one `docker-compose.yml`. Inside that network, a service reaches another one by its service name as if it were a hostname (e.g., the `server` service connects to Mongo at `mongo:27017`, not `localhost:27017`).

## How it's used in this project

Only the **backend** (`server/`) is containerized. The frontend (`client/`) is a Vite build that produces static HTML/JS/CSS — there's no server-side process to containerize, so it's deployed as static files (S3/CloudFront, or later Vercel/Netlify) instead.

### `server/Dockerfile` — multi-stage build

```dockerfile
# ---- Build stage: compile TypeScript ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---- Runtime stage: only production deps + compiled output ----
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 8088
CMD ["node", "dist/index.js"]
```

Why two stages: the **build** stage needs TypeScript, `ts-node`, and all the `devDependencies` to compile `src/` into `dist/`. None of that is needed to actually *run* the app — only the compiled JS and the production dependencies are. The **runtime** stage starts fresh from a clean `node:20-alpine` base and copies over only `dist/` (via `COPY --from=build`) plus a production-only `npm ci --omit=dev` install. The result is a much smaller final image, and the build tools never ship to production.

`node:20-alpine` specifically: `alpine` is a minimal Linux distribution (~5MB base vs. ~100MB+ for the default Debian-based Node image), which keeps image size and pull time down.

### `server/.dockerignore`

Same idea as `.gitignore`, but for what gets sent to the Docker build ("build context") — excludes `node_modules`, `dist`, `logs`, `.env`, tests, etc., so the build doesn't waste time copying/ invalidating cache on files it doesn't need.

### `docker-compose.yml` (repo root) — local dev

```yaml
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes: [mongo_data:/data/db]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  server:
    build: { context: ./server }
    ports: ["8088:8088"]
    env_file: [./server/.env]
    environment:
      - DB_CONNECTION_URL=mongodb://mongo:27017/writify
      - REDIS_URL=redis://redis:6379
    depends_on: [mongo, redis]

volumes:
  mongo_data:
```

This spins up three containers together: MongoDB, Redis, and the server (built from the Dockerfile above). The `server` service loads all its other secrets from `server/.env` (email credentials, JWT secrets, AWS keys, Google client id), but overrides just the DB and Redis URLs to point at the other containers by service name (`mongo`, `redis`) instead of `localhost` — because inside the compose network, `localhost` would mean "this container," not "the other one."

`mongo_data` is a named volume — MongoDB's data directory is mounted there, so stopping and removing the containers (`docker compose down`) doesn't wipe your local database; only `docker compose down -v` (removes volumes too) would.

### Step-by-step: running it locally

```bash
# from the repo root
cp server/.env.example server/.env   # fill in real values (JWT secrets, email creds, AWS keys, etc.)

docker compose up --build            # builds the server image, then starts all three containers
```

- `--build` forces a rebuild of the server image (needed the first time, and after changing source code or dependencies).
- Server is now reachable at `http://localhost:8088`, Mongo at `localhost:27017`, Redis at `localhost:6379` — same as running them un-containerized.
- `docker compose logs -f server` tails just the server's logs.
- `docker compose down` stops and removes the containers (data in `mongo_data` survives).
- `docker compose up -d` runs it in the background instead of attaching to your terminal.

### Step-by-step: building and running just the server image manually

Useful for understanding what compose is doing under the hood, or for deploying to a single EC2 instance without compose:

```bash
cd server

# Build the image, tag it "writify-server"
docker build -t writify-server .

# Run a container from it, mapping container port 8088 to host port 8088,
# passing env vars via a file
docker run -p 8088:8088 --env-file .env writify-server

# See it running
docker ps

# Tail its logs
docker logs -f <container-id>

# Stop it
docker stop <container-id>
```

If Mongo/Redis aren't also running in Docker on the same machine, `DB_CONNECTION_URL`/`REDIS_URL` in `.env` need to point at wherever they actually are (e.g., a MongoDB Atlas connection string, or `host.docker.internal` if they're running directly on your Mac outside Docker).

### Deploying this image (AWS EC2, and portable beyond it)

The same image built above is what runs in production — build it on the EC2 instance (or build it elsewhere and push it to a registry like Docker Hub or Amazon ECR, then pull it on the instance), run it with the real production `.env` values, and put Nginx in front of it for TLS. Because the image only depends on Docker being installed — not on any AWS-specific service — moving this same container to Render, Railway, or Fly later is just "build and run this image there instead," with no code changes.
