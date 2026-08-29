"use strict";
const fs = require("fs").promises;
const path = require("path");

function pascalCase(input) {
  return input
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (m) => m.toUpperCase());
}

function kebabCase(input) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

async function safeWriteFile(filePath, content) {
  const folder = path.dirname(filePath);
  await fs.mkdir(folder, { recursive: true });
  try {
    let exists = false;
    try {
      await fs.access(filePath);
      exists = true;
    } catch (e) {
      exists = false;
    }

    if (!exists) {
      await fs.writeFile(filePath, content, "utf8");
      return;
    } else {
      const old = await fs.readFile(filePath, "utf8");
      if (old !== content) {
        // create a suggested new file to avoid overwriting
        const newPath = filePath + ".new";
        await fs.writeFile(newPath, content, "utf8");
        console.warn(
          `⚠️  ${path.relative(process.cwd(), filePath)} already exists — a suggested new file was written to ${path.relative(
            process.cwd(),
            newPath
          )}`
        );
        return;
      } else {
        // identical contents — do nothing
        return;
      }
    }
  } catch (e) {
    throw e;
  }
}

module.exports = { pascalCase, kebabCase, safeWriteFile };
