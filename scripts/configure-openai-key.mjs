import {
  chmodSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";

const envPath = fileURLToPath(
  new URL("../.env.feishu.local", import.meta.url),
);
const temporaryPath = `${envPath}.${process.pid}.tmp`;

let apiKey = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) {
  apiKey += chunk;
}
apiKey = apiKey.trim();

if (!/^sk-[A-Za-z0-9_-]{20,}$/.test(apiKey)) {
  throw new Error("The supplied API key does not have the expected format.");
}

const existingLines = readFileSync(envPath, "utf8")
  .split(/\r?\n/)
  .filter(
    (line) =>
      !/^OPENAI_(API_KEY|MODEL|WEB_SEARCH)\s*=/.test(line.trim()),
  );

while (existingLines.at(-1) === "") existingLines.pop();
existingLines.push(
  `OPENAI_API_KEY="${apiKey}"`,
  'OPENAI_MODEL="gpt-5.6-terra"',
  'OPENAI_WEB_SEARCH="true"',
  "",
);

writeFileSync(temporaryPath, existingLines.join("\n"), {
  encoding: "utf8",
  mode: 0o600,
});
renameSync(temporaryPath, envPath);
chmodSync(envPath, 0o600);

console.info("OpenAI settings updated in .env.feishu.local.");
