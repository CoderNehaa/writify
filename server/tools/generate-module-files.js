#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Take module name from CLI args
const moduleName = process.argv[2];

if (!moduleName) {
  console.error("❌ Please provide a module name. Example: node generate-module-files.js order");
  process.exit(1);
}

const basePath = path.join(__dirname, "src", "modules", moduleName);
if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
  console.log(`📁 Created folder: ${basePath}`);
}

const files = [
  "container.ts",
  "controller.ts",
  "route.ts",
  "schema.ts",
  "type.ts",
  "model.ts",
  "service.ts",
  "validator.ts",
];

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let index = 0;

const askQuestion = () => {
  if (index >= files.length) {
    rl.close();
    console.log("✅ Done creating selected files.");
    return;
  }

  const fileName = `${moduleName}.${files[index]}`;
  rl.question(`Do you want to create "${fileName}"? (y/n): `, (answer) => {
    if (answer.toLowerCase() === "y") {
      const filePath = path.join(basePath, fileName);
      fs.writeFileSync(filePath, `// ${fileName} for ${moduleName} module\n`);
      console.log(`📝 Created: ${filePath}`);
    } else {
      console.log(`⏩ Skipped: ${fileName}`);
    }
    index++;
    askQuestion();
  });
};

askQuestion();
