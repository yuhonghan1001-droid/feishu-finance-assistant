import assert from "node:assert/strict";
import test from "node:test";
import { createFinanceAssistantReply } from "../lib/finance-knowledge";

test("gives a practical common workflow for travel reimbursement", () => {
  const reply = createFinanceAssistantReply("我的出差费用怎么报销？");

  assert.match(reply, /通用差旅报销流程/);
  assert.match(reply, /事前审批/);
  assert.match(reply, /业务负责人确认/);
  assert.match(reply, /具体额度.*以本公司制度为准/);
  assert.doesNotMatch(reply, /https:\/\//);
});

test("uses common controls for other internal-policy questions", () => {
  const questions = [
    "我帮公司垫付了费用，怎么报销？",
    "采购付款流程怎么走？",
    "业务招待费应该怎么申请？",
    "备用金借款怎么办理？",
    "如果我申请员工代垫费用报销，需要走哪些审批？",
    "怎么查询我可以申请的预算？",
  ];

  for (const question of questions) {
    const reply = createFinanceAssistantReply(question);
    assert.match(reply, /事前审批—凭证—分级审核—例外留痕/);
    assert.match(reply, /业务负责人/);
    assert.match(reply, /财务复核/);
    assert.match(reply, /以本公司正式制度为准/);
  }
});

test("keeps the uncertainty fallback for unsupported public-policy questions", () => {
  const reply = createFinanceAssistantReply("某个没有说明年份的税率是多少？");

  assert.match(reply, /暂时没有找到足够明确的公开依据/);
  assert.doesNotMatch(reply, /事前审批—凭证—分级审核—例外留痕/);
});

test("answers contract tax review with a practical checklist", () => {
  const reply = createFinanceAssistantReply("从税务角度怎么看合同？");

  assert.match(reply, /交易、价税、发票、付款和纳税时点/);
  assert.match(reply, /含税还是不含税/);
  assert.match(reply, /印花税/);
  assert.doesNotMatch(reply, /https:\/\//);
});

test("covers the first batch of high-frequency tax questions", () => {
  const cases: Array<[string, RegExp, RegExp]> = [
    ["专票取得后进项税一定能抵扣吗？", /不代表一定可以抵扣/, /交际应酬/],
    ["小规模纳税人月销售额10万元怎么交税？", /起征点/, /减按 1%/],
    ["小型微利企业所得税是不是5%？", /实际税负为 5%/, /300 万元/],
    ["招待费税前能扣多少？", /实际发生额的 60%/, /5‰/],
    ["职工福利费能税前扣除多少？", /工资、薪金总额的 14%/, /个人所得税/],
    ["广告费企业所得税可以扣多少？", /销售（营业）收入的 15%/, /结转/],
    ["年终奖怎么计税更划算？", /单独计税/, /并入综合所得/],
    ["子女教育专项附加扣除每月多少？", /每名子女每月 2,000 元/, /3,000 元/],
    ["合同印花税按含税还是不含税金额？", /价款与增值税税额分别列明/, /不是所有合同/],
    ["只有收据没有发票，能税前扣除吗？", /不等于一律不能税前扣除/, /小额零星/],
  ];

  for (const [question, conclusion, detail] of cases) {
    const reply = createFinanceAssistantReply(question);
    assert.match(reply, conclusion, question);
    assert.match(reply, detail, question);
    assert.doesNotMatch(reply, /https:\/\//, question);
  }
});

test("distinguishes tax deductibility from an internal approval question", () => {
  const taxReply = createFinanceAssistantReply("业务招待费税前扣除比例是多少？");
  const approvalReply = createFinanceAssistantReply("业务招待费应该怎么申请？");

  assert.match(taxReply, /两限孰低/);
  assert.match(approvalReply, /事前审批—凭证—分级审核—例外留痕/);
});

test("answers contract tax risks directly before supplemental references", () => {
  const reply = createFinanceAssistantReply("合同在税务上存在的风险有？");

  assert.match(reply, /^合同常见税务风险主要有 6 类/);
  assert.match(reply, /具体看这 6 项/);
  assert.match(reply, /交易实质不一致/);
  assert.match(reply, /主体不一致/);
  assert.match(reply, /价税约定不清/);
  assert.match(reply, /付款与纳税时点错位/);
  assert.doesNotMatch(reply, /参考依据（需要时再看）：/);
  assert.doesNotMatch(reply, /https:\/\//);
  assert.doesNotMatch(reply, /^【公开规则/);
  assert.doesNotMatch(reply, /仅供内部办事参考/);
});

test("shows official references when the user asks for the basis", () => {
  const reply = createFinanceAssistantReply(
    "合同在税务上有哪些风险？请给我政策依据",
  );

  assert.match(reply, /^合同常见税务风险主要有 6 类/);
  assert.match(reply, /参考依据（需要时再看）：/);
  assert.match(reply, /https:\/\//);
});
