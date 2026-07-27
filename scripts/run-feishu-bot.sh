#!/bin/zsh
set -euo pipefail

readonly script_dir="${0:A:h}"
readonly project_dir="${script_dir:h}"
readonly node_bin="${NODE_BIN:-$(command -v node || true)}"

if [[ -z "${node_bin}" ]]; then
  echo "Node.js is required. Install Node.js >=22.13.0 or set NODE_BIN." >&2
  exit 1
fi

cd "${project_dir}"
exec "${node_bin}" \
  --env-file=.env.feishu.local \
  --import tsx \
  bot/feishu-long-connection.ts
