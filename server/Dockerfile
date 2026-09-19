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

# aws-cli is used by entrypoint.sh to pull config from SSM Parameter
# Store at container start — not needed by the app itself.
RUN apk add --no-cache aws-cli

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

EXPOSE 8088
ENTRYPOINT ["./entrypoint.sh"]
CMD ["node", "dist/index.js"]
