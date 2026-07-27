"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Source = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
};

type Answer = {
  badge: "公开规则" | "需内部制度" | "公开规则＋内部制度";
  title: string;
  summary: string;
  steps?: string[];
  internalNote?: string;
  sourceIds: string[];
};

type Message = {
  id: number;
  role: "user" | "assistant";
  text?: string;
  answer?: Answer;
};

const sources: Source[] = [
  {
    id: "digital-invoice",
    title: "关于推广应用全面数字化电子发票的公告",
    issuer: "国家税务总局公告 2024 年第 11 号",
    date: "全文有效",
    url: "https://fgk.chinatax.gov.cn/zcfgk/c100012/c5236067/content.html",
  },
  {
    id: "no-stamp",
    title: "“数电发票”12 月起全国推行！一文了解它有哪些优点",
    issuer: "国家税务总局",
    date: "2024-11-27",
    url: "https://www.chinatax.gov.cn/chinatax/n810356/n3010387/c5236173/content.html",
  },
  {
    id: "deduction-voucher",
    title: "企业所得税税前扣除凭证管理办法",
    issuer: "国家税务总局公告 2018 年第 28 号",
    date: "全文有效",
    url: "https://fgk.chinatax.gov.cn/zcfgk/c100012/c5194804/content.html",
  },
  {
    id: "invoice-rules",
    title: "中华人民共和国发票管理办法实施细则",
    issuer: "国家税务总局令第 25 号（2024 年修正）",
    date: "现行版本",
    url: "https://app.www.gov.cn/govdata/gov/202402/27/512396/article.html",
  },
  {
    id: "invoice-check",
    title: "关于启用全国增值税发票查验平台的公告",
    issuer: "国家税务总局公告 2016 年第 87 号",
    date: "官方查验入口",
    url: "https://www.chinatax.gov.cn/chinatax/n810341/n810765/n1990035/201612/c2506072/content.html",
  },
  {
    id: "annual-filing",
    title: "关于 2025 年度个人所得税综合所得汇算清缴预约办理时间的通告",
    issuer: "国家税务总局通告 2026 年第 1 号",
    date: "2026-02-03",
    url: "https://zhejiang.chinatax.gov.cn/art/2026/2/9/art_8409_84423.html",
  },
  {
    id: "special-deduction",
    title: "如何通过个人所得税 APP 确认 2026 年度专项附加扣除信息",
    issuer: "国家税务总局天津市税务局",
    date: "2025-12-29",
    url: "https://tianjin.chinatax.gov.cn/11200000000/0300/030005/20251229090027514.shtml",
  },
  {
    id: "special-deduction-late",
    title: "个人所得税专项附加扣除可以补充申报吗",
    issuer: "国家税务总局天津市税务局",
    date: "2026-07-20",
    url: "https://tianjin.chinatax.gov.cn/11200000000/0500/050008/20260720143409167.shtml",
  },
];

const answers = {
  digitalInvoice: {
    badge: "公开规则",
    title: "数电发票不需要发票专用章，也具有法律效力。",
    summary:
      "国家税务总局明确，数电发票与纸质发票具有同等法律效力。通过税务数字账户下载的数电发票含有数字签名，无需加盖发票专用章即可入账归档。",
    steps: [
      "核对购买方、销售方、项目名称、金额等票面信息是否与实际业务一致。",
      "如对真伪有疑问，可通过全国增值税发票查验平台核验。",
      "能否报销还需同时满足企业内部的费用标准、审批和附件要求。",
    ],
    internalNote:
      "公开规则能确认发票效力，但不能代替企业内部的报销制度和审批结果。",
    sourceIds: ["digital-invoice", "no-stamp"],
  },
  personalTitle: {
    badge: "公开规则＋内部制度",
    title: "仅凭“个人抬头”无法直接判断能否报销。",
    summary:
      "企业所得税税前扣除凭证需满足真实性、合法性和关联性。境内应税支出向已办理税务登记的纳税人采购时，通常以发票作为税前扣除凭证；发票购买方等信息还应与实际业务相符。",
    steps: [
      "先确认这笔支出是否确为公司业务、由谁提供服务，以及正确的购买方应是谁。",
      "若应由公司作为购买方，优先联系开票方按规定红冲并重新开具正确信息的发票。",
      "如属于实名票据或其他特殊场景，再按企业内部制度和财务口径判断。",
    ],
    internalNote:
      "是否给员工报销属于企业内部管理规则。接入内部制度后，助手才能给出最终办理路径。",
    sourceIds: ["deduction-voucher", "invoice-rules"],
  },
  verifyInvoice: {
    badge: "公开规则",
    title: "可以通过全国增值税发票查验平台核验。",
    summary:
      "国家税务总局提供官方查验入口，可查验增值税专用发票、增值税普通发票、机动车销售统一发票和增值税电子普通发票等信息。",
    steps: [
      "打开官方平台：inv-veri.chinatax.gov.cn。",
      "按页面要求填写发票代码、号码、开票日期、金额或校验码等信息。",
      "查验结果只能证明票面信息，仍需核对交易是否真实、内容是否与业务一致。",
    ],
    sourceIds: ["invoice-check", "invoice-rules"],
  },
  specialDeduction: {
    badge: "公开规则",
    title: "可以补充填报，不必等到下一年度。",
    summary:
      "税务机关 2026 年 7 月的公开答复明确：年度内发现未填报专项附加扣除的，可以通过个人所得税 APP 补充填报，由任职受雇单位在后续发放工资时补扣。",
    steps: [
      "登录个人所得税 APP，进入“专项附加扣除填报”。",
      "选择相应项目，扣除年度选择 2026，并按提示补充信息。",
      "如果年度内仍未处理，可在次年 3 月 1 日至 6 月 30 日汇算期间补充申报。",
    ],
    internalNote:
      "实际在工资中体现的月份与公司发薪、扣缴申报节奏有关，可再向薪酬或个税服务团队确认。",
    sourceIds: ["special-deduction", "special-deduction-late"],
  },
  annualFiling: {
    badge: "公开规则",
    title: "2025 年度个税综合所得汇算办理期已结束。",
    summary:
      "国家税务总局公布的办理时间为 2026 年 3 月 1 日至 6 月 30 日。当前日期为 2026 年 7 月 25 日，已超过常规办理期。",
    steps: [
      "如已办理，可在个人所得税 APP 中查看申报记录和办理状态。",
      "如应办但尚未办理，建议尽快通过个人所得税 APP 或 12366 确认后续处理方式。",
      "涉及单位预扣数据时，可再联系公司薪酬或个税服务团队核对。",
    ],
    sourceIds: ["annual-filing"],
  },
  travelLimit: {
    badge: "需内部制度",
    title: "公开财税规则不能确定公司的酒店报销额度。",
    summary:
      "酒店标准、超标审批、可报销范围和附件要求属于企业内部管理制度。公开税收规则只能说明凭证和税务要求，不能替公司批准超标费用。",
    steps: [
      "需要接入企业现行差旅制度，确认城市、职级或人员类别对应标准。",
      "再根据入住日期、实际金额、超标原因和事前审批情况判断。",
      "若制度未覆盖该例外，应提交财务或审批人确认。",
    ],
    internalNote:
      "这是助手必须守住的边界：没有内部制度依据时，不生成具体额度，也不承诺可以报销。",
    sourceIds: ["deduction-voucher"],
  },
  correction: {
    badge: "公开规则",
    title: "开票信息错误，应按规定开具红字发票后更正。",
    summary:
      "现行发票管理实施细则要求发票项目齐全、内容真实。电子发票出现开票有误、销售退回、服务中止或销售折让等情形，应按规定开具红字发票。",
    steps: [
      "暂停使用信息有误的发票提交报销或税务处理。",
      "联系开票方确认红字发票处理，并重新取得正确信息的发票。",
      "如原票已经入账或做用途确认，按电子发票服务平台的对应流程处理。",
    ],
    sourceIds: ["invoice-rules", "digital-invoice"],
  },
  fallback: {
    badge: "需内部制度",
    title: "暂时没有找到足够明确的公开依据。",
    summary:
      "这个问题可能依赖企业内部制度、具体交易背景，或尚未接入的政策资料。为了避免给出错误口径，我不会直接生成确定性结论。",
    steps: [
      "补充费用类型、发生时间、交易主体、票据类型和你想办理的事项。",
      "如果属于公司流程，请提供对应制度名称或转给财务人工确认。",
      "人工确认后的标准答案，可以审核后加入知识库供后续复用。",
    ],
    internalNote:
      "真实部署时，这里可自动生成问题摘要，并携带已收集信息转给对应财务团队。",
    sourceIds: [],
  },
} satisfies Record<string, Answer>;

const quickQuestions = [
  "数电发票没有章，可以报销吗？",
  "发票抬头开成个人，怎么处理？",
  "怎么查验增值税发票真伪？",
  "2026 年专项附加扣除漏填了怎么办？",
  "出差酒店超标能报销吗？",
  "去年的个税汇算什么时候办？",
];

function findAnswer(question: string): Answer {
  const normalized = question.replace(/\s+/g, "");
  if (
    normalized.includes("抬头") ||
    normalized.includes("个人名") ||
    normalized.includes("个人开")
  ) {
    return answers.personalTitle;
  }
  if (
    normalized.includes("开错") ||
    normalized.includes("红字") ||
    normalized.includes("红冲") ||
    normalized.includes("信息错误")
  ) {
    return answers.correction;
  }
  if (
    normalized.includes("查验") ||
    normalized.includes("真伪") ||
    normalized.includes("真假")
  ) {
    return answers.verifyInvoice;
  }
  if (
    normalized.includes("专项附加") ||
    normalized.includes("专项扣除") ||
    normalized.includes("附加扣除")
  ) {
    return answers.specialDeduction;
  }
  if (normalized.includes("汇算") || normalized.includes("退税")) {
    return answers.annualFiling;
  }
  if (
    normalized.includes("酒店") ||
    normalized.includes("差旅") ||
    normalized.includes("超标")
  ) {
    return answers.travelLimit;
  }
  if (
    normalized.includes("数电") ||
    normalized.includes("电子发票") ||
    normalized.includes("没有章") ||
    normalized.includes("盖章")
  ) {
    return answers.digitalInvoice;
  }
  return answers.fallback;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "assistant",
    answer: {
      badge: "公开规则",
      title: "你好，我是财税小助手。",
      summary:
        "我会先查已核验的公开财税规则，再告诉你这个问题是否还需要企业内部制度。每个结论都会附来源；没有明确依据时，我会直接说明。",
      sourceIds: [],
    },
  },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, "yes" | "no">>({});
  const [handoffOpen, setHandoffOpen] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const nextMessageIdRef = useRef(2);

  const citedSourceIds = useMemo(
    () =>
      Array.from(
        new Set(
          messages.flatMap((message) =>
            message.answer ? message.answer.sourceIds : [],
          ),
        ),
      ),
    [messages],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, thinking]);

  function ask(question: string) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || thinking) return;
    const userId = nextMessageIdRef.current;
    nextMessageIdRef.current += 2;
    setMessages((current) => [
      ...current,
      { id: userId, role: "user", text: cleanQuestion },
    ]);
    setInput("");
    setThinking(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: userId + 1,
          role: "assistant",
          answer: findAnswer(cleanQuestion),
        },
      ]);
      setThinking(false);
    }, 520);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    ask(input);
  }

  function startNewChat() {
    setMessages(initialMessages);
    setFeedback({});
    setHandoffOpen(false);
    setInput("");
    nextMessageIdRef.current = 2;
  }

  return (
    <main className="app-shell">
      <aside className="nav-panel" aria-label="助手导航">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            财
          </span>
          <div>
            <strong>财税小助手</strong>
            <span>企业内部原型</span>
          </div>
        </div>

        <button className="new-chat" type="button" onClick={startNewChat}>
          <span aria-hidden="true">＋</span>
          新建咨询
        </button>

        <nav className="nav-section">
          <p>当前会话</p>
          <button className="history-item active" type="button">
            <span className="history-dot" />
            发票与个税咨询
          </button>
        </nav>

        <div className="nav-spacer" />

        <div className="scope-card">
          <span className="scope-icon">✓</span>
          <div>
            <strong>回答有边界</strong>
            <p>公开政策直接回答，内部标准明确标注待接入。</p>
          </div>
        </div>

        <p className="prototype-note">原型不包含企业内部数据</p>
      </aside>

      <section className="chat-panel">
        <header className="chat-header">
          <div>
            <div className="assistant-title">
              <span className="online-dot" />
              财税小助手
              <span className="status-pill">公开资料已核验</span>
            </div>
            <p>政策库更新至 2026-07-25</p>
          </div>
          <button
            className="handoff-button"
            type="button"
            onClick={() => setHandoffOpen((value) => !value)}
          >
            转人工
          </button>
        </header>

        {handoffOpen && (
          <div className="handoff-banner" role="status">
            <div>
              <strong>准备转给财务人工</strong>
              <p>
                真实部署时会自动整理问题、已确认信息和引用依据，并按问题类型路由。
              </p>
            </div>
            <button type="button" onClick={() => setHandoffOpen(false)}>
              收起
            </button>
          </div>
        )}

        <div className="messages" aria-live="polite">
          <div className="date-divider">
            <span>今天</span>
          </div>

          {messages.map((message) =>
            message.role === "user" ? (
              <div className="message-row user-row" key={message.id}>
                <div className="user-bubble">{message.text}</div>
                <div className="user-avatar" aria-hidden="true">
                  我
                </div>
              </div>
            ) : (
              <div className="message-row assistant-row" key={message.id}>
                <div className="bot-avatar" aria-hidden="true">
                  财
                </div>
                <article className="answer-card">
                  <span
                    className={`answer-badge badge-${message.answer?.badge.replaceAll("＋", "-").replaceAll(" ", "")}`}
                  >
                    {message.answer?.badge}
                  </span>
                  <h2>{message.answer?.title}</h2>
                  <p className="answer-summary">{message.answer?.summary}</p>

                  {message.answer?.steps &&
                    message.answer.steps.length > 0 && (
                      <ol className="answer-steps">
                        {message.answer.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    )}

                  {message.answer?.internalNote && (
                    <div className="boundary-note">
                      <span aria-hidden="true">i</span>
                      <p>{message.answer.internalNote}</p>
                    </div>
                  )}

                  {message.answer && message.answer.sourceIds.length > 0 && (
                    <div className="inline-sources">
                      <span>依据</span>
                      {message.answer.sourceIds.map((sourceId, index) => {
                        const source = sources.find(
                          (item) => item.id === sourceId,
                        );
                        return source ? (
                          <a
                            key={source.id}
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {index + 1}. {source.title}
                          </a>
                        ) : null;
                      })}
                    </div>
                  )}

                  {message.id !== 1 && (
                    <div className="answer-actions">
                      <span>是否解决了你的问题？</span>
                      <button
                        className={
                          feedback[message.id] === "yes" ? "selected" : ""
                        }
                        type="button"
                        onClick={() =>
                          setFeedback((current) => ({
                            ...current,
                            [message.id]: "yes",
                          }))
                        }
                      >
                        有帮助
                      </button>
                      <button
                        className={
                          feedback[message.id] === "no" ? "selected" : ""
                        }
                        type="button"
                        onClick={() => {
                          setFeedback((current) => ({
                            ...current,
                            [message.id]: "no",
                          }));
                          setHandoffOpen(true);
                        }}
                      >
                        未解决
                      </button>
                    </div>
                  )}
                </article>
              </div>
            ),
          )}

          {thinking && (
            <div className="message-row assistant-row">
              <div className="bot-avatar" aria-hidden="true">
                财
              </div>
              <div className="typing" aria-label="正在查找政策依据">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="composer-area">
          {messages.length === 1 && (
            <div className="quick-questions" aria-label="常见问题">
              {quickQuestions.map((question) => (
                <button
                  type="button"
                  key={question}
                  onClick={() => ask(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}
          <form className="composer" onSubmit={submit}>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  ask(input);
                }
              }}
              rows={1}
              placeholder="描述你的具体情况，例如：数电发票没有章能报销吗？"
              aria-label="输入财税问题"
            />
            <button
              type="submit"
              aria-label="发送问题"
              disabled={!input.trim() || thinking}
            >
              ↑
            </button>
          </form>
          <p className="composer-hint">
            回答仅供内部办事参考；税务申报、例外审批等事项请以专业团队确认为准。
          </p>
        </div>
      </section>

      <aside className="source-panel" aria-label="知识来源">
        <div className="source-header">
          <div>
            <span className="eyebrow">知识来源</span>
            <h2>权威政策库</h2>
          </div>
          <span className="source-count">{sources.length}</span>
        </div>

        <div className="source-summary">
          <div>
            <strong>100%</strong>
            <span>政府及税务机关</span>
          </div>
          <div>
            <strong>{citedSourceIds.length}</strong>
            <span>本轮已引用</span>
          </div>
        </div>

        <div className="source-list">
          {sources.map((source) => (
            <a
              className={
                citedSourceIds.includes(source.id)
                  ? "source-item cited"
                  : "source-item"
              }
              href={source.url}
              target="_blank"
              rel="noreferrer"
              key={source.id}
            >
              <div className="source-topline">
                <span>{citedSourceIds.includes(source.id) ? "已引用" : "可检索"}</span>
                <span className="external-arrow">↗</span>
              </div>
              <h3>{source.title}</h3>
              <p>{source.issuer}</p>
              <small>{source.date}</small>
            </a>
          ))}
        </div>

        <div className="internal-slot">
          <span className="lock-mark" aria-hidden="true">
            内
          </span>
          <div>
            <strong>内部制度待接入</strong>
            <p>差旅额度、报销流程、审批权限等只能从企业授权文档获取。</p>
          </div>
        </div>
      </aside>
    </main>
  );
}
