import archiver from "archiver";
import { exec } from "node:child_process";
import { createWriteStream } from "fs";
import { cp, writeFile } from "fs/promises";
import util from "util";
import { mkdirSync } from "node:fs";

const copyFolders = ["public"];
const version = process.env["npm_package_version"]!;
const browsers = process.env["npm_package_config_browsers"]!.split(",");
const asyncExec = util.promisify(exec);

async function buildForBrowser(browser: string) {
  console.log(`building ${browser}...`);
  const browserDir = `dist/${browser}`;

  mkdirSync(browserDir, { recursive: true });

  // compile folders with ts
  const jobs: Promise<unknown>[] = [];

  jobs.push(asyncExec(`tsc --outDir ${browserDir}`));

  // copy files that doesn't contain js
  for (const copyFolder of copyFolders) {
    jobs.push(
      cp(copyFolder, `${browserDir}/${copyFolder}`, { recursive: true }),
    );
  }

  // create manifest file
  jobs.push(
    writeFile(`${browserDir}/manifest.json`, getManifestContent(browser)),
  );

  await Promise.all(jobs);

  await compressDist(browser);
  console.log(`${browser} is done.`);
}

async function main() {
  const jobs: Promise<unknown>[] = [];
  for (const browser of browsers) {
    jobs.push(buildForBrowser(browser));
  }
  await Promise.all(jobs);
}

async function compressDist(browser: string) {
  const output = createWriteStream(`dist/${browser}.zip`);
  const archive = archiver("zip");
  archive.pipe(output);
  archive.directory(`dist/${browser}`, false);
  await archive.finalize();
}

function getManifestContent(browser: string) {
  let manifestVersion = 3;
  let browserSettings = {};
  if (browser == "firefox") {
    manifestVersion = 2;
    browserSettings = {
      gecko: {
        data_collection_permissions: {
          required: ["none"],
        },
      },
    };
  }
  return JSON.stringify({
    manifest_version: manifestVersion,
    name: "no Notion AI",
    version: version,
    browser_specific_settings: browserSettings,
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

main();
