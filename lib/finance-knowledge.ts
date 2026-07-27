export type Source = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  url: string;
};

export type Answer = {
  badge: "公开规则" | "需内部制度" | "公开规则＋内部制度";
  title: string;
  summary: string;
  stepHeading?: string;
  steps?: string[];
  internalNote?: string;
  sourceIds: string[];
};

export const sources: Source[] = [
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
    id: "vat-law",
    title: "中华人民共和国增值税法",
    issuer: "中华人民共和国主席令第四十一号",
    date: "2026-01-01 施行",
    url: "https://www.npc.gov.cn/npc/c2/c30834/202412/t20241225_442015.html",
  },
  {
    id: "vat-regulation",
    title: "中华人民共和国增值税法实施条例",
    issuer: "中华人民共和国国务院令第 826 号",
    date: "2026-01-01 施行",
    url: "https://fgk.chinatax.gov.cn/zcfgk/c100010/c5246349/content.html",
  },
  {
    id: "vat-input-credit",
    title: "关于增值税进项税额抵扣等有关事项的公告",
    issuer: "财政部 税务总局公告 2026 年第 13 号",
    date: "2026-01-01 施行",
    url: "https://fgk.chinatax.gov.cn/zcfgk/c102416/c5247494/content.html",
  },
  {
    id: "small-scale-vat-transition",
    title: "关于增值税法施行后增值税优惠政策衔接事项的公告",
    issuer: "财政部 税务总局公告 2026 年第 10 号",
    date: "相关优惠执行至 2027-12-31",
    url: "https://shanxi.chinatax.gov.cn/son/detail/ty-11401-545-1817690",
  },
  {
    id: "small-scale-vat-administration",
    title: "关于起征点标准等增值税征管事项的公告",
    issuer: "国家税务总局公告 2026 年第 4 号",
    date: "全文有效",
    url: "https://tianjin.chinatax.gov.cn/11200000000/0300/030004/03000418/20260202150609746.shtml",
  },
  {
    id: "small-profit-enterprise",
    title: "关于进一步支持小微企业和个体工商户发展有关税费政策的公告",
    issuer: "财政部 税务总局公告 2023 年第 12 号",
    date: "相关优惠执行至 2027-12-31",
    url: "https://fgk.chinatax.gov.cn/zcfgk/c102416/c5210453/content.html",
  },
  {
    id: "enterprise-income-tax-regulation",
    title: "中华人民共和国企业所得税法实施条例",
    issuer: "中华人民共和国国务院令第 512 号",
    date: "现行有效",
    url: "https://www.chinatax.gov.cn/n810341/n810765/n812176/n812748/c1193046/content.html",
  },
  {
    id: "business-entertainment-deduction",
    title: "一般企业业务招待费税前扣除标准",
    issuer: "国家税务总局",
    date: "2025-05-30",
    url: "https://www.chinatax.gov.cn/chinatax/n810356/n3010387/c5240872/content.html",
  },
  {
    id: "staff-welfare-deduction",
    title: "职工福利费税前扣除限额及支出范围",
    issuer: "国家税务总局天津市税务局",
    date: "2026-03-17",
    url: "https://tianjin.chinatax.gov.cn/11200000000/0300/030005/p20260317085645328.shtml",
  },
  {
    id: "annual-bonus",
    title: "关于延续实施全年一次性奖金个人所得税政策的公告",
    issuer: "财政部 税务总局公告 2023 年第 30 号",
    date: "执行至 2027-12-31",
    url: "https://shanghai.chinatax.gov.cn/tax/zcfw/zcfgk/grsds/202308/t468460.html",
  },
  {
    id: "special-deduction-standards",
    title: "关于提高个人所得税有关专项附加扣除标准的通知",
    issuer: "国务院 国发〔2023〕13 号",
    date: "2023-01-01 起执行",
    url: "https://shanxi.chinatax.gov.cn/zdgk/detail/sx-11400-545-1780764",
  },
  {
    id: "stamp-duty-basis",
    title: "印花税的计税依据是什么",
    issuer: "国家税务总局",
    date: "现行口径",
    url: "https://www.chinatax.gov.cn/chinatax/n810356/n3010387/c5196049/content.html",
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
  {
    id: "accounting-law",
    title: "中华人民共和国会计法（2024 年修正）",
    issuer: "全国人民代表大会常务委员会",
    date: "2024-07-01 施行",
    url: "https://kjs.mof.gov.cn/zhengcefabu/202408/t20240812_3941615.htm",
  },
  {
    id: "electronic-voucher",
    title: "关于规范电子会计凭证报销入账归档的通知",
    issuer: "财政部、国家档案局 财会〔2020〕6 号",
    date: "全文有效",
    url: "https://kjs.mof.gov.cn/zhengcefabu/202003/t20200331_3490938.htm",
  },
  {
    id: "travel-controls",
    title: "中央和国家机关差旅费管理办法（管理流程参考）",
    issuer: "财政部 财行〔2013〕531 号",
    date: "具体标准不适用于一般企业",
    url: "https://www.mof.gov.cn/gkml/caizhengwengao/wg2014/wg201402/201407/t20140728_1118944.htm",
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
      "通用做法是先确认因公属性、补正票据并留存审批和付款证明；最终是否报销仍以公司制度和审批结果为准。",
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
      "国家税务总局公布的办理时间为 2026 年 3 月 1 日至 6 月 30 日，目前已超过常规办理期。",
    steps: [
      "如已办理，可在个人所得税 APP 中查看申报记录和办理状态。",
      "如应办但尚未办理，建议尽快通过个人所得税 APP 或 12366 确认后续处理方式。",
      "涉及单位预扣数据时，可再联系公司薪酬或个税服务团队核对。",
    ],
    sourceIds: ["annual-filing"],
  },
  contractTaxReview: {
    badge: "公开规则＋内部制度",
    title: "从税务角度看合同，核心是让交易、价税、发票、付款和纳税时点相互一致。",
    summary:
      "通用审核不只是看税率。应先按真实交易判断税种和纳税主体，再核对合同条款、履约证据、发票和资金流是否能够互相印证；合同写法不能改变实际业务的税务性质。",
    steps: [
      "核对签约主体、纳税人身份、交易内容、交付或验收方式，避免合同名称与实际业务不一致。",
      "明确金额是含税还是不含税、适用税率或征收率、税额如何列示，以及政策变化时价格是否调整。",
      "约定发票种类、开票项目、开票时间和错误发票的更正方式；取得专票不等于一定可以抵扣。",
      "把付款节点、交付验收和纳税义务发生时间对齐。书面合同约定的付款日期可能影响增值税纳税义务时点。",
      "判断合同是否属于印花税应税凭证；价款和增值税税额分别列明时，印花税计税依据通常不含增值税税款。",
      "涉及跨境、关联交易、股权或资产转让、长期项目和税收优惠时，在签署前交由税务和法务人员专项复核。",
    ],
    internalNote:
      "以上是通用税务审阅清单；合同模板、审批权限、可接受税率和风险承担条款应以本公司制度及具体交易为准。",
    sourceIds: [
      "vat-law",
      "vat-regulation",
      "deduction-voucher",
      "invoice-rules",
      "stamp-duty-basis",
    ],
  },
  contractTaxRisks: {
    badge: "公开规则＋内部制度",
    title:
      "合同常见税务风险主要有 6 类：交易实质、签约主体、价税条款、发票、纳税时点和印花税。",
    summary:
      "其中最常见的是合同写法与实际履约不一致，导致开票、抵扣、税前扣除或纳税时间出现问题。",
    stepHeading: "具体看这 6 项：",
    steps: [
      "交易实质不一致：合同名称、服务内容、交付成果与实际业务对不上，可能被按真实业务重新判断税务处理。",
      "主体不一致：签约方、收付款方、开票方或实际履约方不同，容易造成发票不合规、成本难以税前扣除。",
      "价税约定不清：未写明含税或不含税、税率和政策变化后的价格承担，可能引起补税或结算争议。",
      "发票条款不完整：未约定发票类型、开票项目、时间和错票处理；取得专票也不代表进项税一定能抵扣。",
      "付款与纳税时点错位：付款、交付、验收和开票节点设置不当，可能提前产生纳税义务或造成账税差异。",
      "印花税漏缴或多缴：只看合同名称、不看真实内容，或没有把价款和增值税税额分别列明。",
    ],
    internalNote:
      "跨境、关联交易、股权或资产转让、长期项目及大额合同，建议签署前由税务和法务人员专项复核。",
    sourceIds: [
      "vat-law",
      "vat-regulation",
      "deduction-voucher",
      "invoice-rules",
      "stamp-duty-basis",
    ],
  },
  inputVatCredit: {
    badge: "公开规则",
    title: "有增值税专用发票不代表一定可以抵扣进项税额。",
    summary:
      "通常要同时满足：购买方按一般计税方法纳税、取得合规扣税凭证、支出用于可抵扣的经营活动，并且不属于法律规定的不得抵扣情形。最终应结合发票用途确认和申报状态判断。",
    steps: [
      "先确认购买方是否为一般纳税人，以及该业务是否采用一般计税方法。",
      "核对专票或其他扣税凭证的购买方、项目、税额和业务内容，并按规定完成用途确认。",
      "判断实际用途。用于简易计税项目、免税项目、特定非应税交易、集体福利或个人消费等情形的进项税额，可能不得抵扣。",
      "交际应酬消费按个人消费处理；贷款利息及与贷款直接相关的部分费用，现行条例明确暂不得抵扣。",
      "已抵扣后发生用途改变、非正常损失、销售退回或折让的，及时核对是否需要作进项税额转出或扣减。",
    ],
    internalNote:
      "大额资产、混合用途、跨境服务或无法划分用途的项目计算较复杂，应由税务人员按当期台账复核。",
    sourceIds: ["vat-law", "vat-regulation", "vat-input-credit"],
  },
  smallScaleVat: {
    badge: "公开规则",
    title: "2026—2027 年小规模纳税人按新的“起征点＋1%征收率”口径处理。",
    summary:
      "按月申报的起征点为月销售额 10 万元，按季申报的为季度销售额 30 万元，按次纳税的为每次（日）1,000 元。未达到起征点通常免征增值税；达到起征点时，应按现行规则计算全部销售额，而不是继续套用已废止的旧征管口径。",
    steps: [
      "先确认纳税期限是按月、按季还是按次，并汇总同一期间内全部应税交易。",
      "2026 年 1 月 1 日至 2027 年 12 月 31 日，原适用 3% 征收率的多数应税交易减按 1% 征收；销售、出租不动产或转让土地使用权等除外。",
      "适用 1% 政策时，按 1% 征收率开具增值税发票。",
      "销售额未达到起征点时，可以对全部或部分交易放弃免税并开具增值税专用发票；对应交易需按规定缴税。",
      "临界金额、差额征税、预收款、不动产或跨地区项目应按具体业务另行核对。",
    ],
    sourceIds: [
      "small-scale-vat-transition",
      "small-scale-vat-administration",
    ],
  },
  smallProfitEnterprise: {
    badge: "公开规则",
    title: "符合条件的小型微利企业，企业所得税实际税负为 5%，政策执行至 2027 年底。",
    summary:
      "现行政策是先按 25% 计算应纳税所得额，再按 20% 税率缴纳企业所得税，折算实际税负为 5%；不能简单把企业所得税法定税率理解成永久改为 5%。",
    steps: [
      "企业应从事国家非限制和禁止行业。",
      "年度应纳税所得额不超过 300 万元。",
      "从业人数不超过 300 人；劳务派遣用工也计入，按全年季度平均值计算。",
      "资产总额不超过 5,000 万元，按全年季度平均值计算。",
      "最终资格以企业所得税年度汇算清缴结果为准，不能只看企业名称或增值税纳税人身份。",
    ],
    sourceIds: ["small-profit-enterprise"],
  },
  businessEntertainmentTax: {
    badge: "公开规则＋内部制度",
    title: "业务招待费税前扣除额按“两限孰低”计算。",
    summary:
      "企业发生的与生产经营有关的业务招待费，按实际发生额的 60% 扣除，但最高不得超过当年销售（营业）收入的 5‰。可报销金额、会计入账金额和企业所得税税前扣除金额不是同一个概念。",
    steps: [
      "留存招待对象、事由、参与人员、时间地点、审批记录、发票和付款证明，能够说明与经营活动有关。",
      "先计算实际发生额的 60%，再计算当年销售（营业）收入的 5‰，取两者较低者作为税前扣除上限。",
      "超过税前扣除上限的部分通常仍可按真实业务入账，但企业所得税汇算时需要纳税调增。",
      "是否允许员工报销、单次标准和审批层级，按公司业务招待制度执行。",
    ],
    internalNote:
      "员工问“能不能报销”时，应先走公司审批；60% 和 5‰解决的是企业所得税扣除问题，不是报销审批标准。",
    sourceIds: [
      "business-entertainment-deduction",
      "deduction-voucher",
    ],
  },
  staffWelfareTax: {
    badge: "公开规则＋内部制度",
    title: "职工福利费税前扣除上限通常为工资、薪金总额的 14%。",
    summary:
      "企业实际发生且属于职工福利费范围的支出，不超过工资、薪金总额 14% 的部分准予企业所得税税前扣除。超过部分通常需要在汇算清缴时纳税调增。",
    steps: [
      "先判断支出性质；食堂补贴、困难补助、符合规定的交通或生活补贴等可能属于职工福利费。",
      "区分福利费、工资薪金和工会经费等项目，不能仅凭发票名称决定归类。",
      "留存受益人员、用途、审批、发放或支付记录及合法凭证，并单独核算实际发生额。",
      "按年度工资、薪金总额的 14% 计算扣除限额，超过部分在企业所得税汇算时调整。",
      "人人有份的现金或实物福利还可能涉及员工个人所得税，不能因计入福利费就当然免税。",
    ],
    internalNote:
      "员工聚餐、团建、节日福利和各类补贴的报销范围及标准，仍应按公司福利和费用制度确认。",
    sourceIds: [
      "staff-welfare-deduction",
      "enterprise-income-tax-regulation",
      "deduction-voucher",
    ],
  },
  advertisingTax: {
    badge: "公开规则",
    title: "一般企业广告费和业务宣传费按当年销售（营业）收入的 15% 限额扣除。",
    summary:
      "符合条件的广告费和业务宣传费，不超过当年销售（营业）收入 15% 的部分准予扣除；超过部分可结转以后纳税年度扣除。特殊行业另有规定的，需要按当期有效政策单独确认。",
    steps: [
      "确认费用确属对外广告或业务宣传，并与企业经营相关，不要仅按供应商开票项目归类。",
      "留存合同、投放计划、发布载体或页面、验收记录、发票和付款证明。",
      "汇算时按当年销售（营业）收入的 15% 计算一般企业扣除限额。",
      "超过限额的金额建立结转台账，在以后年度有额度时继续扣除。",
    ],
    sourceIds: [
      "enterprise-income-tax-regulation",
      "deduction-voucher",
    ],
  },
  annualBonusTax: {
    badge: "公开规则",
    title: "全年一次性奖金目前可以选择单独计税，也可以并入综合所得计税。",
    summary:
      "居民个人符合条件的全年一次性奖金，在 2027 年 12 月 31 日前可以选择不并入当年综合所得，按全年一次性奖金政策单独计税；也可以选择并入当年综合所得。哪种更省税取决于全年收入和各项扣除。",
    steps: [
      "单独计税时，用全年一次性奖金除以 12，按月度税率表确定适用税率和速算扣除数。",
      "同一纳税年度内，每名纳税人通常只能使用一次全年一次性奖金单独计税办法。",
      "把“单独计税”和“并入综合所得”两种结果都测算后再选择，不要只根据奖金金额判断。",
      "年度汇算时可在个人所得税 APP 中核对奖金计税方式；涉及单位申报数据时联系薪酬人员。",
    ],
    sourceIds: ["annual-bonus"],
  },
  specialDeductionStandards: {
    badge: "公开规则",
    title: "子女教育和 3 岁以下婴幼儿照护每名子女每月 2,000 元，赡养老人每月合计 3,000 元。",
    summary:
      "上述提高后的专项附加扣除标准自 2023 年 1 月 1 日起执行。这里的金额是应纳税所得额扣除，不是直接退还同等金额的税款。",
    steps: [
      "子女教育：每名子女每月 2,000 元，可由父母一方全额扣除，或双方各按 50% 扣除。",
      "3 岁以下婴幼儿照护：每名婴幼儿每月 2,000 元，分配方式与子女教育相同。",
      "赡养老人：独生子女每月 3,000 元；非独生子女与兄弟姐妹分摊每月 3,000 元，每人每月不超过 1,500 元。",
      "扣除方式一经选定，在一个纳税年度内通常不能变更；应在个人所得税 APP 中如实填报和更新。",
    ],
    sourceIds: ["special-deduction-standards", "special-deduction"],
  },
  stampDutyContract: {
    badge: "公开规则",
    title: "不是所有合同都缴印花税；属于应税凭证的，再按对应税目和计税依据计算。",
    summary:
      "应先判断合同是否属于印花税法列举的应税凭证。应税合同中价款与增值税税额分别列明的，计税依据通常不包括列明的增值税税款；未分别列明的，按合同所列金额确定。",
    steps: [
      "确认合同名称和真实交易内容，判断是否落入印花税应税合同或产权转移书据等税目。",
      "核对合同金额是否把不含税价款和增值税税额分别列示。",
      "按适用税目税率计算，并关注多方签约、合同变更、未列金额及后续结算等特殊情形。",
      "不要仅因合同未盖章、以电子形式签署或名称不是“合同”就直接判断无需缴税，应看凭证内容和法律效力。",
    ],
    sourceIds: ["stamp-duty-basis"],
  },
  deductionVoucher: {
    badge: "公开规则",
    title: "没有发票不等于一律不能税前扣除，但多数境内应税支出仍应取得合规发票。",
    summary:
      "企业所得税税前扣除首先要满足真实性、合法性和关联性。境内发生增值税应税支出，向已办理税务登记的单位或个人采购时，通常以发票作为税前扣除凭证；仅有收据通常不能替代。",
    steps: [
      "先判断交易是否真实、与经营相关，并留存合同、验收、付款和业务说明。",
      "如对方已办理税务登记且该支出属于增值税应税项目，要求对方按规定开具发票。",
      "对方依法无需办理税务登记且属于小额零星经营业务时，可按规定使用税务机关代开发票，或载明收款单位、个人姓名及身份证号、项目、金额等信息的收款凭证和内部凭证。",
      "非应税项目或法规允许使用其他外部凭证的，按对应凭证规则办理；凭证不合规时应及时补开、换开。",
      "能否员工报销与能否企业所得税税前扣除应分别判断，不能相互替代。",
    ],
    internalNote:
      "小额零星业务的具体认定、凭证内容和补救期限应由财务人员结合交易对方身份及当地申报情况复核。",
    sourceIds: ["deduction-voucher", "invoice-rules"],
  },
  travelLimit: {
    badge: "公开规则＋内部制度",
    title: "可以先按通用差旅报销流程办理。",
    summary:
      "通用做法是“事前审批—按标准支出—提交凭证—业务负责人确认—财务审核—支付归档”。公开规则能确定凭证和会计税务底线，但交通等级、住宿上限、补贴金额和提交时限由企业自行规定。",
    steps: [
      "确认出差目的、地点、日期、人员、预计费用和成本归属；已出差但未事前审批的，补充书面说明。",
      "整理出差申请、机票或车票、住宿发票、支付记录，以及会议通知或客户拜访记录等业务证明。",
      "交通和住宿通常在公司标准内据实报销；超标、退改签或缺少凭证的，提交原因和例外审批。",
      "伙食及市内交通通常选择定额补贴或凭票报销；已由接待方承担的费用不重复申领。",
      "直属负责人确认业务真实性，财务复核预算、标准、票据和重复报销后付款并归档。",
    ],
    internalNote:
      "以上是通用企业做法，不代表公司已经批准；具体额度、审批人、报销期限和例外处理以本公司制度为准。",
    sourceIds: [
      "deduction-voucher",
      "accounting-law",
      "electronic-voucher",
      "travel-controls",
    ],
  },
  genericInternalPolicy: {
    badge: "公开规则＋内部制度",
    title: "可以先按通用的“事前审批—凭证—分级审核—例外留痕”流程办理。",
    summary:
      "报销垫付、采购付款、业务招待、借款备用金和预算审批等事项通常采用同一套控制逻辑：证明业务真实且与公司经营相关，在预算和授权范围内办理，并保存合法凭证和完整审批记录。",
    steps: [
      "先说明事项用途、交易对象、金额、预算或成本归属，并按授权层级取得事前审批。",
      "准备发票或其他合法凭证、合同或订单、验收或业务完成证明，以及实际付款记录。",
      "业务负责人确认事项真实和必要；财务复核预算、费用标准、票据合规、税务处理及是否重复报销。",
      "超预算、超标准、缺少事前审批或凭证不完整的，补充书面原因并走单独的例外审批，不默认承诺可以报销。",
      "审批通过后向员工或供应商付款，并将申请、审批、凭证和支付记录关联归档。",
    ],
    internalNote:
      "以上是多数企业可采用的通用做法；具体金额、审批权限、材料清单、付款周期和禁止事项以本公司正式制度为准。",
    sourceIds: ["deduction-voucher", "accounting-law", "electronic-voucher"],
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

export function findAnswer(question: string): Answer {
  const normalized = question.replace(/\s+/g, "");
  if (
    normalized.includes("子女教育") ||
    normalized.includes("婴幼儿照护") ||
    normalized.includes("婴幼儿") ||
    normalized.includes("赡养老人") ||
    (/(专项附加|专项扣除|附加扣除)/.test(normalized) &&
      /(标准|额度|金额|多少)/.test(normalized))
  ) {
    return answers.specialDeductionStandards;
  }
  if (
    normalized.includes("年终奖") ||
    normalized.includes("全年一次性奖金") ||
    normalized.includes("一次性奖金")
  ) {
    return answers.annualBonusTax;
  }
  if (
    normalized.includes("小型微利") ||
    normalized.includes("小微企业所得税") ||
    normalized.includes("企业所得税5%") ||
    (normalized.includes("企业所得税") &&
      /(300人|300万|5000万)/.test(normalized))
  ) {
    return answers.smallProfitEnterprise;
  }
  if (
    normalized.includes("小规模") ||
    normalized.includes("月销售额10万") ||
    normalized.includes("季度销售额30万") ||
    normalized.includes("3%降1%") ||
    normalized.includes("1%征收率")
  ) {
    return answers.smallScaleVat;
  }
  if (
    normalized.includes("进项税") ||
    normalized.includes("抵扣进项") ||
    normalized.includes("不得抵扣") ||
    (normalized.includes("专票") && normalized.includes("抵扣"))
  ) {
    return answers.inputVatCredit;
  }
  if (
    normalized.includes("印花税") ||
    normalized.includes("应税凭证")
  ) {
    return answers.stampDutyContract;
  }
  if (
    normalized.includes("合同") &&
    normalized.includes("税") &&
    /(风险|隐患|注意什么|注意事项|容易出什么问题)/.test(normalized)
  ) {
    return answers.contractTaxRisks;
  }
  if (
    normalized.includes("合同税务") ||
    normalized.includes("税务合同") ||
    (normalized.includes("合同") &&
      /(税务|税率|开票|发票|含税|不含税|纳税)/.test(normalized))
  ) {
    return answers.contractTaxReview;
  }
  if (
    /(招待费|业务招待|宴请)/.test(normalized) &&
    /(税|扣除|所得|比例|限额|60%|千分之五|5‰)/.test(normalized)
  ) {
    return answers.businessEntertainmentTax;
  }
  if (
    normalized.includes("职工福利费") ||
    normalized.includes("福利费扣除") ||
    (normalized.includes("福利费") && normalized.includes("14%"))
  ) {
    return answers.staffWelfareTax;
  }
  if (
    normalized.includes("广告费") ||
    normalized.includes("业务宣传费") ||
    normalized.includes("宣传费扣除")
  ) {
    return answers.advertisingTax;
  }
  if (
    normalized.includes("没发票") ||
    normalized.includes("没有发票") ||
    normalized.includes("只有收据") ||
    normalized.includes("税前扣除凭证") ||
    (normalized.includes("收据") && normalized.includes("税前扣除"))
  ) {
    return answers.deductionVoucher;
  }
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
    normalized.includes("出差") ||
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
  if (
    normalized.includes("报销") ||
    normalized.includes("垫付") ||
    normalized.includes("公司费用") ||
    normalized.includes("采购") ||
    normalized.includes("付款") ||
    normalized.includes("招待") ||
    normalized.includes("宴请") ||
    normalized.includes("备用金") ||
    normalized.includes("借款") ||
    normalized.includes("预算") ||
    normalized.includes("审批") ||
    normalized.includes("费用标准") ||
    normalized.includes("公司制度") ||
    normalized.includes("内部制度") ||
    normalized.includes("合同审批") ||
    normalized.includes("合同流程") ||
    normalized.includes("用印") ||
    normalized.includes("流程怎么") ||
    normalized.includes("怎么走流程")
  ) {
    return answers.genericInternalPolicy;
  }
  return answers.fallback;
}

export function formatAnswerForFeishu(
  answer: Answer,
  options: { includeSources?: boolean } = {},
): string {
  const lines = [
    answer.title,
    "",
    answer.summary,
  ];

  if (answer.steps?.length) {
    lines.push(
      "",
      answer.stepHeading ?? "建议这样处理：",
      ...answer.steps.map((step, index) => `${index + 1}. ${step}`),
    );
  }

  if (answer.internalNote) {
    lines.push("", `需要注意：${answer.internalNote}`);
  }

  const citedSources = answer.sourceIds
    .map((sourceId) => sources.find((source) => source.id === sourceId))
    .filter((source): source is Source => Boolean(source));

  if (options.includeSources && citedSources.length) {
    lines.push(
      "",
      "参考依据（需要时再看）：",
      ...citedSources.map(
        (source, index) => `${index + 1}. ${source.title}\n${source.url}`,
      ),
    );
  }

  return lines.join("\n");
}

export function isHelpRequest(question: string): boolean {
  return /^(\/?help|帮助|使用说明|你能做什么|你好|您好)[！!。.？?\s]*$/i.test(
    question,
  );
}

export function createFinanceAssistantReply(question: string): string {
  if (!question) {
    return "请直接发送财税问题，例如：数电发票没有章，可以报销吗？";
  }
  if (isHelpRequest(question)) {
    return [
      "你好，我是财税小助手。你可以直接问我：",
      "• 数电发票没有章，可以报销吗？",
      "• 发票抬头开成个人，怎么处理？",
      "• 怎么查验增值税发票真伪？",
      "• 从税务角度怎么看合同？",
      "• 专票取得后，进项税一定能抵扣吗？",
      "• 小规模纳税人月销售额 10 万元怎么交税？",
      "• 业务招待费能税前扣除多少？",
      "• 年终奖单独计税还是并入综合所得？",
      "• 专项附加扣除漏填了怎么办？",
      "• 出差酒店超标能报销吗？",
      "• 我帮公司垫付了费用，怎么报销？",
      "",
      "公司制度类问题会先给出通用企业做法，再标明需要以本公司制度确认的内容。没有明确依据时，不会编造结论。",
    ].join("\n");
  }

  return formatAnswerForFeishu(findAnswer(question), {
    includeSources: /(依据|政策|法规|文件|来源|出处|原文|链接)/.test(question),
  });
}
