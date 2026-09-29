import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * TanStack Start SPA builds emit `dist/client/_shell.html`.
 * Static hosts (Vercel) expect `index.html` in the publish directory.
 */
const clientDir = join(process.cwd(), "dist", "client");
const shell = join(clientDir, "_shell.html");
const index = join(clientDir, "index.html");

if (!existsSync(shell)) {
  console.error("prepare-static: missing dist/client/_shell.html — build may have failed.");
  process.exit(1);
}

copyFileSync(shell, index);
console.log("prepare-static: wrote dist/client/index.html");

// Optional flat publish dir for hosts that want `dist/` not `dist/client/`
const publishDir = join(process.cwd(), "dist", "publish");
if (existsSync(publishDir)) rmSync(publishDir, { recursive: true, force: true });
mkdirSync(publishDir, { recursive: true });

function copyRecursive(src, dest) {
  const st = statSync(src);
  if (st.isDirectory()) {
    mkdirSync(dest, { recursive: true });
    for (const name of readdirSync(src)) {
      copyRecursive(join(src, name), join(dest, name));
    }
  } else {
    copyFileSync(src, dest);
  }
}

copyRecursive(clientDir, publishDir);
console.log("prepare-static: mirrored client → dist/publish");
