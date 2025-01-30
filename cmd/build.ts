import archiver from "archiver";
import { execSync } from "child_process";
import { cpSync, createWriteStream, writeFileSync } from "fs";

const copyFolders = ["public"];
const version = process.env["npm_package_version"]!
const browsers = process.env["npm_package_config_browsers"]?.split(",")!;
for (let browser of browsers) {
  console.log(`building ${browser}...`)
  const browserDir = `dist/${browser}`;

  // compile folders with ts
  execSync(`tsc --outDir ${browserDir}`);

  // copy files that doesn't contain js
  for (let copyFolder of copyFolders) {
    cpSync(copyFolder, `${browserDir}/${copyFolder}`, { recursive: true });
  }

  // create manifest file
  writeFileSync(`${browserDir}/manifest.json`, getManifestContent(browser));

  compressDist(browser);
  console.log(`${browser} is done.`)
}

function compressDist(browser: string) {
  let output = createWriteStream(`dist/${browser}.zip`);
  let archive = archiver("zip");
  archive.pipe(output);
  archive.directory(`dist/${browser}`, false);
  archive.finalize();
}

function getManifestContent(browser: string) {
  let manifestVersion = 3;
  if (browser == "firefox") {
    manifestVersion = 2;
  }
  return JSON.stringify({
    manifest_version: manifestVersion,
    name: "no Notion AI",
    version: version,
    description: "",
    permissions: [],
    content_scripts: [
      {
        matches: ["*://www.notion.so/*"],
        js: ["content/notion_ai_remover.js"],
      },
    ],
    icons: {
      "48": "public/no-notion-ai-48x48.png",
      "96": "public/no-notion-ai-96x96.png",
    },
  });
}
