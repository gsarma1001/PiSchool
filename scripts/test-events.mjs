import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const testDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "pi-school-events-"));
const compiler = path.join(root, "node_modules", "typescript", "bin", "tsc");
const testSource = path.join(root, "src", "lib", "events", "events.test.ts");

function runNode(args, cwd = root) {
  const result = spawnSync(process.execPath, args, { cwd, stdio: "inherit" });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

try {
  const compileStatus = runNode([
    compiler,
    "--target",
    "ES2022",
    "--module",
    "commonjs",
    "--moduleResolution",
    "node",
    "--esModuleInterop",
    "--skipLibCheck",
    "--strict",
    "--noEmit",
    "false",
    "--rootDir",
    path.join(root, "src"),
    "--outDir",
    testDirectory,
    testSource,
  ]);
  if (compileStatus !== 0) {
    process.exitCode = compileStatus;
  } else {
    process.exitCode = runNode(
      ["--test", "./lib/events/events.test.js"],
      testDirectory,
    );
  }
} finally {
  fs.rmSync(testDirectory, { recursive: true, force: true });
}
