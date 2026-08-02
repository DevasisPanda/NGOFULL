// Cross-platform dev launcher that forces NODE_ENV=development.
// Fixes: "next dev" fails when a system-level NODE_ENV=production exists.
process.env.NODE_ENV = "development";

const { spawn } = require("child_process");
const path = require("path");

const nextBin = path.join(
  path.dirname(require.resolve("next/package.json")),
  "dist",
  "bin",
  "next"
);

const child = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

child.on("error", (err) => {
  console.error("[dev.js] Failed to start next dev:", err);
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
