import { chmod, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const mode = process.argv[2]?.trim().toLowerCase();
if (!["knowledge", "ai"].includes(mode)) {
  console.error("Usage: node scripts/configure-assistant-mode.mjs knowledge|ai");
  process.exit(1);
}

const envPath = fileURLToPath(
  new URL("../.env.feishu.local", import.meta.url),
);
const existing = await readFile(envPath, "utf8");
const lines = existing
  .split(/\r?\n/)
  .filter((line) => !/^FINANCE_ASSISTANT_MODE\s*=/.test(line.trim()));

while (lines.at(-1) === "") lines.pop();
lines.push(`FINANCE_ASSISTANT_MODE="${mode}"`, "");

await writeFile(envPath, lines.join("\n"), { mode: 0o600 });
await chmod(envPath, 0o600);
console.info(`Finance assistant mode updated to "${mode}".`);
