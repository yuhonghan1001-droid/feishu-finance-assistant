# 财税小助手

这是一个面向企业同事的财税问答原型，提供网页咨询和飞书应用机器人两种入口。回答会区分公开政策与企业内部制度，并在没有明确依据时提示转人工确认。

项目问题、10 次改动过程、实施方式、验证结果和遗留事项见 [飞书财税小助手迭代记录](docs/finance-assistant-iteration-log.md)。

## 本地运行

要求 Node.js `>=22.13.0` 与 pnpm。

```bash
pnpm install
pnpm dev
pnpm test
```

## 飞书机器人

当前生产接入使用飞书官方 Node SDK 的长连接模式。这个模式不要求公网回调地址，适合当前部署环境。

本地创建 `.env.feishu.local`（文件已被 Git 忽略）：

```dotenv
FEISHU_APP_ID="cli_xxx"
FEISHU_APP_SECRET="xxx"
FINANCE_ASSISTANT_MODE="knowledge"
OPENAI_API_KEY="sk-xxx"
OPENAI_MODEL="gpt-5.6-terra"
OPENAI_WEB_SEARCH="true"
```

`FINANCE_ASSISTANT_MODE` 设为 `knowledge` 时，机器人直接使用已审核知识库回答，不会调用外部模型；适合 API 尚未配置或不可用时稳定运行。设为 `ai` 时，机器人优先把知识库作为回答依据，再由大模型针对具体问题组织答案。涉及现行税率、申报期限和最新公开政策时可使用联网检索；公司制度未接入时会提供通用企业做法，并明确标出需要本公司确认的部分。`OPENAI_WEB_SEARCH` 设为 `false` 可关闭联网检索。

可用下面的命令安全切换模式，脚本只修改模式配置，不会打印或覆盖现有密钥：

```bash
pnpm bot:mode knowledge
pnpm bot:mode ai
```

修改知识库或模式后，可用以下脚本重启当前 Mac 上的飞书机器人。脚本优先通过 `launchd` 启动，受系统限制时自动退回后台运行：

```bash
./scripts/restart-feishu-bot.sh
```

启动机器人：

```bash
pnpm bot:feishu
```

飞书开放平台配置：

1. 创建企业自建应用并启用“机器人”能力。
2. 开通 `im:message.p2p_msg:readonly`、`im:message.group_at_msg:readonly` 和 `im:message:send_as_bot`。
3. 在“事件与回调”中选择“使用长连接接收事件”，启动本地机器人后完成连接验证并保存。
4. 添加 `im.message.receive_v1`（接收消息 v2.0）事件。
5. 创建并发布应用版本，把可用范围设置为需要使用机器人的员工。
6. 私聊直接提问；群聊先把机器人加入群，再通过 `@财税小助手` 提问。

仓库里的 `ops/com.codex.feishu-finance-assistant.plist` 是通用登录常驻配置模板。使用前请把其中的 `/absolute/path/to/finance-assistant` 替换为项目实际绝对路径，再复制到 `~/Library/LaunchAgents/` 后加载。机器人使用长连接，因此承载进程所在电脑必须保持开机联网；如需真正 7×24 小时可用，应把同一进程部署到支持持续出站 WebSocket 的服务器或容器。

项目仍保留 `/api/feishu/events` webhook 实现，可用于允许飞书服务器访问且不会拦截机器流量的托管环境。webhook 模式需要配置：

- `FEISHU_APP_ID`
- `FEISHU_APP_SECRET`
- `FEISHU_VERIFICATION_TOKEN`
- `FEISHU_ENCRYPT_KEY`

## 当前知识范围

当前知识库覆盖合同税务审核、增值税进项抵扣、小规模纳税人优惠、小型微利企业所得税、业务招待费、职工福利费、广告宣传费、全年一次性奖金、专项附加扣除标准、印花税、税前扣除凭证、数电发票、发票抬头与查验、个税汇算、差旅报销、费用垫付、采购付款、借款备用金、预算审批和发票更正等场景。回答默认先给结论和办理方法；用户询问依据、法规或原文时再附官方链接。公司制度类问题会先给出“事前审批—凭证—分级审核—例外留痕”的通用企业做法，再明确提示具体额度、审批权限和时限以本公司制度为准。

大模型负责开放问答和自然语言组织，不能代替企业正式制度、财务审批或专业税务判断。未经审核的内部资料不应直接写入系统提示词。

## 开源许可

本项目采用 [MIT License](LICENSE)。
