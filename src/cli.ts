#!/usr/bin/env node
import { jsonToZod } from "./jsonToZod";
import { readFileSync, writeFileSync, existsSync } from "fs";
let sourceArgumentIndex = process.argv.indexOf("--source");
if (sourceArgumentIndex === -1) {
  sourceArgumentIndex = process.argv.indexOf("-s");
}
if (sourceArgumentIndex === -1) {
  console.error(
    "Must supply source file with --source [filename] or -s [filename}"
  );
  process.exit(1);
}
const sourceFilePath = process.argv[sourceArgumentIndex + 1];
if (!sourceFilePath) {
  console.error(
    `No source path was provided after ${process.argv[sourceArgumentIndex]}`
  );
  process.exit(1);
}
const sourceFileExists = existsSync(sourceFilePath);
if (!sourceFileExists) {
  console.error(`${sourceFilePath} doesn't exist`);
  process.exit(1);
}
let sourceFileContent: string;
try {
  sourceFileContent = readFileSync(sourceFilePath, "utf-8");
} catch (e) {
  console.error("Failed to read sourcefile");
  console.error(e);
  process.exit(1);
}
let sourceFileData: any;
try {
  sourceFileData = JSON.parse(sourceFileContent);
} catch (e) {
  console.error("Failed to parse sourcefile contents");
  console.error(e);
  process.exit(1);
}
let targetArgumentIndex = process.argv.indexOf("--target");
if (targetArgumentIndex === -1) {
  targetArgumentIndex = process.argv.indexOf("-t");
}
let targetFilePath: string = "";
if (targetArgumentIndex !== -1) {
  targetFilePath = process.argv[targetArgumentIndex + 1];
  if (!targetFilePath) {
    console.error(
      `No target path was provided after ${process.argv[targetArgumentIndex]}`
    );
    process.exit(1);
  }
}
let nameArgumentIndex = process.argv.indexOf("--name");
if (nameArgumentIndex === -1) {
  nameArgumentIndex = process.argv.indexOf("-n");
}
let name: string = "schema";
if (nameArgumentIndex !== -1) {
  name = process.argv[nameArgumentIndex + 1];
  if (!name) {
    console.error(
      `No schema name was provided after ${process.argv[nameArgumentIndex]}`
    );
    process.exit(1);
  }
}
let convertTuplesArgumentIndex = process.argv.indexOf("--convertTuples");
if (convertTuplesArgumentIndex === -1) {
  convertTuplesArgumentIndex = process.argv.indexOf("-c");
}
let convertTuples: boolean = false;
if (convertTuplesArgumentIndex !== -1) {
  convertTuples = true;
}
if (targetFilePath) {
  let result: string;
  try {
    result = jsonToZod(sourceFileData, name, true, convertTuples);
  } catch (e) {
    console.error("Failed to parse sourcefile content to Zod schema");
    console.error(e);
    process.exit(1);
  }

  try {
    writeFileSync(targetFilePath, result);
  } catch (e) {
    console.error(`Failed to result to ${targetFilePath}`);
    console.error(e);
    process.exit(1);
  }
} else {
  let result: string;
  try {
    result = jsonToZod(sourceFileData, name, false, convertTuples);
  } catch (e) {
    console.error("Failed to parse sourcefile content to Zod schema");
    console.error(e);
    process.exit(1);
  }
  console.log(result);
}
