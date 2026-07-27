#!/bin/zsh
set -euo pipefail

readonly script_dir="${0:A:h}"
readonly project_dir="${script_dir:h}"
readonly service_domain="gui/$(id -u)"
readonly service_id="${service_domain}/com.codex.feishu-finance-assistant"
readonly runner_path="${project_dir}/scripts/run-feishu-bot.sh"
readonly stdout_log="/private/tmp/feishu-finance-assistant.log"
readonly stderr_log="/private/tmp/feishu-finance-assistant.err.log"
readonly pid_file="/private/tmp/feishu-finance-assistant.pid"

launchctl bootout "${service_id}" 2>/dev/null || true
launchctl remove com.codex.feishu-finance-assistant 2>/dev/null || true
pkill -TERM -f "${project_dir}/bot/feishu-long-connection\\.ts" 2>/dev/null || true
sleep 1

if launchctl submit \
  -l com.codex.feishu-finance-assistant \
  -o "${stdout_log}" \
  -e "${stderr_log}" \
  -- /bin/zsh "${runner_path}"; then
  echo "Feishu finance assistant restarted with launchd submit."
  exit 0
fi

cd "${project_dir}"
nohup /bin/zsh "${runner_path}" >>"${stdout_log}" 2>>"${stderr_log}" </dev/null &
bot_pid=$!
echo "${bot_pid}" >"${pid_file}"
sleep 2

if kill -0 "${bot_pid}" 2>/dev/null; then
  echo "Feishu finance assistant restarted in background (PID ${bot_pid})."
  exit 0
fi

echo "Feishu finance assistant failed to start; check ${stderr_log}." >&2
exit 1
