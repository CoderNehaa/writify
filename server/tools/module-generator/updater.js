"use strict";

const fs = require("fs").promises;
const path = require("path");

const PROJECT_ROOT = process.cwd();
const CONTAINER_PATH = path.join(PROJECT_ROOT, "src", "modules", "container.ts");
const COLLECTIONS_PATH = path.join(PROJECT_ROOT, "src", "constants", "collections.ts");
const INDEX_PATH = path.join(PROJECT_ROOT, "src", "index.ts");

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch (e) {
    return false;
  }
}

function makeContainerSnippet({ Module, module }) {
  return `import { ${Module}Controller } from "./${module}/${module}.controller";
import { ${Module}Service } from "./${module}/${module}.service";

const ${module}Service = new ${Module}Service();
export const ${module}Controller = new ${Module}Controller(${module}Service);
`;
}

async function updateContainer(vars) {
  const { Module, module } = vars;
  const snippet = makeContainerSnippet(vars);

  const exists = await fileExists(CONTAINER_PATH);
  if (!exists) {
    const header = `// Auto-generated modules container\n\n`;
    await fs.mkdir(path.dirname(CONTAINER_PATH), { recursive: true });
    await fs.writeFile(CONTAINER_PATH, header + snippet, "utf8");
    console.log("🔧 Created container.ts and registered module.");
    return;
  }

  const content = await fs.readFile(CONTAINER_PATH, "utf8");
  if (content.includes(`export const ${module}Controller`)) {
    console.log(`ℹ️  container.ts already contains registration for '${module}', skipping.`);
    return;
  }

  await fs.appendFile(CONTAINER_PATH, `\n${snippet}`, "utf8");
  console.log(`🔧 Updated container.ts — registered ${module} controller.`);
}

async function updateCollections({ Module, module, ModuleUpper }) {
  const exists = await fileExists(COLLECTIONS_PATH);
  if (!exists) {
    console.warn(`⚠️  collections.ts not found at ${COLLECTIONS_PATH}. Skipping update. Please add ${ModuleUpper}: "${module}s" manually.`);
    return;
  }

  let content = await fs.readFile(COLLECTIONS_PATH, "utf8");
  if (content.includes(`${ModuleUpper}:`)) {
    console.log(`ℹ️  collections.ts already contains ${ModuleUpper}, skipping.`);
    return;
  }

  // Try to find `export const COLLECTION_NAMES = { ... };`
  const pattern = /export\s+const\s+COLLECTION_NAMES\s*=\s*{([\s\S]*?)}\s*;/m;
  const m = content.match(pattern);
  if (!m) {
    console.warn("⚠️  Couldn't find COLLECTION_NAMES object in collections.ts. Please add the entry manually:");
    console.warn(`  ${ModuleUpper}: "${module}s",`);
    return;
  }

  const inner = m[1];
  // Keep formatting consistent: add a trailing comma and newline
  const insertion = `  ${ModuleUpper}: "${module}s",\n`;
  const newInner = inner + insertion;
  const newContent = content.replace(pattern, `export const COLLECTION_NAMES = {${newInner}};`);
  await fs.writeFile(COLLECTIONS_PATH, newContent, "utf8");
  console.log(`🔧 Updated collections.ts — added ${ModuleUpper}.`);
}

async function updateIndexRoutes({ Module, module }) {
  const exists = await fileExists(INDEX_PATH);
  if (!exists) {
    console.warn(`⚠️  index.ts not found at ${INDEX_PATH}. Skipping routes update. Please add the router entry manually.`);
    return;
  }

  let content = await fs.readFile(INDEX_PATH, "utf8");
  // basic checks
  if (content.includes(`{ path: "${module}"`) || content.includes(`${module}Router`)) {
    console.log(`ℹ️  index.ts already registers router for '${module}', skipping.`);
    return;
  }

  // Attempt to add import at the top (naive but practical)
  const importLine = `import ${module}Router from "./modules/${module}/${module}.route";\n`;
  if (!content.includes(importLine)) {
    // insert after last import if possible
    const importBlockMatch = content.match(/(^[\s\S]*?)(\n\s*const\s+routers\s*=)/m);
    if (importBlockMatch) {
      // put the import before routers declaration
      const pos = content.indexOf(importBlockMatch[2]);
      content = content.slice(0, pos) + importLine + content.slice(pos);
    } else {
      // fallback: append at top
      content = importLine + content;
    }
  }

  // Find routers array and append entry
  const routersPattern = /(const\s+routers\s*=\s*\[)([\s\S]*?)(\];)/m;
  const m = content.match(routersPattern);
  if (!m) {
    console.warn("⚠️  Couldn't find 'routers' array in index.ts. Please add the following entry manually:");
    console.warn(`  { path: "${module}", router: ${module}Router },`);
    // write back content with the import we may have added
    await fs.writeFile(INDEX_PATH, content, "utf8");
    return;
  }

  const before = m[1];
  const inner = m[2];
  const after = m[3];

  const entry = `  { path: "${module}", router: ${module}Router },\n`;
  const newInner = inner + entry;
  const newRoutersSection = before + newInner + after;
  const newContent = content.replace(routersPattern, newRoutersSection);
  await fs.writeFile(INDEX_PATH, newContent, "utf8");
  console.log(`🔧 Updated index.ts — registered ${module} router.`);
}

module.exports = { updateContainer, updateCollections, updateIndexRoutes };
