"use strict";

const fs = require("fs").promises;
const path = require("path");
const { exit } = require("process");
const { pascalCase, kebabCase, safeWriteFile } = require("./helpers");
const { updateContainer, updateCollections, updateIndexRoutes } = require("./updater");

const TEMPLATES_DIR = path.join(__dirname, "templates");
const MODULES_DIR = path.join(process.cwd(), "src", "modules");

async function readTemplate(name) {
  const p = path.join(TEMPLATES_DIR, name);
  return fs.readFile(p, "utf8");
}

function render(template, vars) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    return vars[key] ?? "";
  });
}

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

async function createModule(moduleName) {
  const moduleFolder = path.join(MODULES_DIR, moduleName);
  await ensureDir(moduleFolder);

  const Module = pascalCase(moduleName); // Article
  const module = moduleName.toLowerCase(); // article
  const ModuleUpper = Module.toUpperCase();

  const templates = [
    { tpl: "type.ts.tpl", out: `${module}.type.ts` },
    { tpl: "schema.ts.tpl", out: `${module}.schema.ts` },
    { tpl: "service.ts.tpl", out: `${module}.service.ts` },
    { tpl: "controller.ts.tpl", out: `${module}.controller.ts` },
    { tpl: "route.ts.tpl", out: `${module}.route.ts` },
  ];

  for (const t of templates) {
    const template = await readTemplate(t.tpl);
    const content = render(template, { Module, module, ModuleUpper });
    const outPath = path.join(moduleFolder, t.out);
    await safeWriteFile(outPath, content);
    console.log("📝 Created:", path.relative(process.cwd(), outPath));
  }

  // Update shared files (container, collections, index)
  await updateContainer({ Module, module });
  await updateCollections({ Module, module, ModuleUpper });
  await updateIndexRoutes({ Module, module });

  console.log("\n✅ Module generation completed.");
}

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error("Usage: generate-module <module-name>");
    exit(1);
  }
  const moduleName = arg.trim().toLowerCase();
  await createModule(moduleName);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
