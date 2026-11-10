import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const outputDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "pi-school-events-report-"));
const compiler = path.join(root, "node_modules", "typescript", "bin", "tsc");

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
    "--outDir",
    outputDirectory,
    "--rootDir",
    path.join(root, "src"),
    path.join(root, "src", "lib", "events", "data.ts"),
    path.join(root, "src", "lib", "events", "service.ts"),
  ]);
  if (compileStatus !== 0) {
    process.exitCode = compileStatus;
  } else {
    const dataModule = path.join(outputDirectory, "lib", "events", "data.js");
    const serviceModule = path.join(outputDirectory, "lib", "events", "service.js");
    const reportCode = `
      const { eventRecords } = require(process.argv[1]);
      const { getEventEditorialReport } = require(process.argv[2]);
      const findings = getEventEditorialReport(eventRecords, new Date());
      if (findings.length === 0) {
        console.log("No missing or stale editorial fields.");
      } else {
        for (const finding of findings) {
          console.log(\`[\${finding.severity.toUpperCase()}] \${finding.eventId}: \${finding.message}\`);
        }
      }
    `;
    process.exitCode = runNode(["-e", reportCode, dataModule, serviceModule], outputDirectory);
  }
} finally {
  fs.rmSync(outputDirectory, { recursive: true, force: true });
}
