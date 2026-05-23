# SpeakUp — Project Memory

> 给 Robinhood Chain 上 tokenized 股票持有人的股东大会 AI 投票 Copilot。
> Give every on-chain shareholder a voice.

本文件是项目长期上下文。每次 session 启动自动加载，遇到决策回到本文件对照。

---

## 1. 项目身份

- **名称**: SpeakUp
- **Slogan (EN)**: Give every on-chain shareholder a voice.
- **Slogan (CN)**: 让每一位链上股东，都被听见。
- **代号**: SpeakUp
- **域名**: `speakup.vote`（D1 内确认可注册并购买）
- **仓库**: 先本地开发，提交前上传 GitHub 并设为公开（HackQuest 评审需要公开仓库链接）

### 终极 Vision

成为 RWA 时代的治理操作系统。当 BlackRock / Vanguard / Robinhood / Coinbase 把万亿美元传统资产搬上链后，SpeakUp 是这些资产持有人参与公司治理、ETF voting choice、债券契约修改、地产/基金治理决策的统一入口。

### Hackathon 终点

2026-06-14 提交可演示 MVP 到 HackQuest，争 Agentic 类别 Top 3 + Robinhood 配额，晋级 2026-07-10 至 07-12 伦敦 Founder House。

---

## 2. Hackathon 背景

- **赛事**: Arbitrum Open House London Online Buildathon
- **主办**: Arbitrum Foundation + HackQuest
- **提交平台**: https://www.hackquest.io/hackathons/Arbitrum-Open-House-London-Online-Buildathon
- **关键时间**:
  - 报名截止 2026-05-25
  - 提交截止 2026-06-14
  - 公布 2026-06-17
  - Founder House 2026-07-10 至 07-12（前 3 名晋级）

### 奖金布局

| 类别 | 总额 | 1st / 2nd / 3rd |
|---|---|---|
| Overall | $70K USDC | 40 / 20 / 10 |
| Best Agentic | $15K USDC | 7 / 5 / 3 |
| Grants | $30K USDC | 组委会自主发放 |

**两条隐藏配额**:
1. Overall 3 选 1 必须给 Robinhood Chain 项目
2. Overall 3 选 1 必须给 Arbitrum 项目

**目标卡位**: Agentic 类别 Top 3 + Robinhood 配额。

### 评审 4 维度（每个交付决策都对照这四条）

1. **Smart contract quality** - 最佳实践、逻辑清晰、最小安全漏洞
2. **Product-Market Fit** - 真实用户吸引与留存潜力
3. **Innovation and Creativity** - 原创性、突破边界
4. **Real Problem Solving** - 解决真实市场需求

---

## 3. 产品定位

### 一句话

给 Robinhood Chain 上 tokenized 股票/ETF 持有人，做股东大会代理投票（proxy voting）的 AI Copilot。把 100 页 SEC DEF 14A 浓缩成 3 行决策建议，一键完成链上投票委托。

### 核心用户

Robinhood 5000 万传统券商散户（未来会持有链上 tokenized 股票），**不是加密原住民**。所有 UX 文案与命名以"非加密用户秒懂"为标准。

### 核心痛点

美股散户股东会 proxy 参与率长期低于 30%。主因：DEF 14A 文件 100+ 页、术语晦涩、没时间读。

### MVP 端到端闭环（必须全部跑通）

```
连钱包 (Privy social login)
  → 检测 tokenized 股票持仓 (Robinhood Chain testnet)
  → 拉 SEC EDGAR DEF 14A 议题
  → AI 给出议题摘要 + 推荐 (Claude Sonnet)
  → 用户一键签名
  → 链上 EAS attestation
  → mock relayer 回执上链
```

### 三个 Agent 角色

- **Reader Agent** (Sonnet): 拉取 SEC EDGAR DEF 14A / 8-K，提取议题、董事候选、薪酬包、ESG 提案
- **Advisor Agent** (Sonnet): 基于用户偏好画像 + ISS/Glass Lewis 公开报告，生成推荐
- **Executor Agent** (Haiku): 把决策打包成 EAS attestation 调用

---

## 4. 技术栈（已锁定，不要改）

### 链

| 用途 | 选型 |
|---|---|
| 主部署 | Robinhood Chain testnet |
| Fallback / 双部署 | Arbitrum Sepolia |

### 合约

- Solidity + Foundry
- EAS (Ethereum Attestation Service) schema 承载投票意向
- 最小 Registry 合约
- 测试覆盖目标 90%+，对应"合约质量"维度

### 数据源

- **SEC EDGAR DEF 14A** API（免费、官方）
- **ISS / Glass Lewis** 公开报告摘要（AI 参考输入）
- **Demo 标的**: TSLA + AMZN + NFLX，直接用 Robinhood Chain testnet 原生 Stock Token（ERC-20，无需 KYC，无需部署 mock）
  - TSLA `0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E`
  - AMZN `0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02`
  - NFLX `0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93`
- Faucet 一键发 5x 每只 Stock Token，无 KYC：https://faucet.testnet.chain.robinhood.com
- Fallback：Arbitrum Sepolia 上自部署相同 ERC-20 镜像以做双链演示
- 详细 D1 调研见 `docs/d1-research.md`

### AI

- 主: **Claude Sonnet 4.6** (`claude-sonnet-4-6`) - 长文档解读、推荐生成
- 辅: **Claude Haiku 4.5** (`claude-haiku-4-5-20251001`) - 议题分类、提取
- Anthropic SDK 直连，**必须启用 prompt caching**
- 不引入 LangChain 这类胖框架

### 前端

- Next.js (App Router) + TypeScript strict
- viem + wagmi
- **Privy embedded wallet** (社交登录零门槛)
- UI 风格: fintech app 调性，对标 Robinhood / Cash App
- **不要 Web3 暗黑风**，不要赛博朋克，不要荧光绿

### 索引

- Envio HyperIndex 跟踪 attestation 与历史投票

### 工程

- 包管理: **bun** 首选，pnpm 备选
- 仓库结构: monorepo
  - `packages/contracts` - Solidity + Foundry
  - `packages/app` - Next.js 前端
  - `packages/agent` - Anthropic SDK + 三个 Agent
  - `packages/indexer` - Envio HyperIndex
- 部署: Caddy + systemd（NodeStake 默认栈）

---

## 5. 22 天里程碑

| 阶段 | 日期 | 目标 |
|---|---|---|
| D1-D4 启动 | 5/25-5/28 | Robinhood Chain testnet 接入、EDGAR API 验证、demo 标的敲定、仓库脚手架 |
| D5-D9 合约 + Agent | 5/29-6/2 | EAS schema + Registry 合约 + 测试 90%+，三个 Agent prompt 工程 |
| D10-D14 前端 MVP | 6/3-6/7 | Privy 登录、持仓列表、议题卡片、Copilot 对话流，骨架打通 |
| D15-D18 端到端 | 6/8-6/11 | 真实 EDGAR 数据 + 链上签名 + attestation + mock relayer，3 个标的跑通 |
| D19-D20 打磨 | 6/12-6/13 | Demo 视频 ≤3 分钟、Deck 10-12 页、README、部署到稳定域名 |
| D21 提交 | 6/14 | 提交 HackQuest + buffer 修 bug |

---

## 6. 产品边界（不要做）

- **不是 DAO 治理工具** (Tally/Boardroom/Aragon 的事)
- **不是投资建议**，文案明确"非投资建议"
- **不是自动投票机器人**，所有投票必须用户最终签名
- **不是交易工具**，与买卖股票无关
- 不引入历史投票回看、社交分享、邀请码等演示外功能

---

## 7. 工作流约束

### 沟通风格

- 中文回复，技术术语保留英文
- 直接给结论，不要"也许可以..."的水分
- 进度更新走"做了什么 / 下一步 / 需要决定"三段式
- **任何英文文本不出现 em dash (—) 或 en dash (–)**

### 代码风格

- 不写解释 WHAT 的注释，只在 WHY 不显然时写一行
- 不为不可能的场景做错误处理
- 不写 backwards-compat shim、`_unused` vars
- TypeScript strict mode 必开
- 错误结构化抛出，不静默吞掉
- Shell 脚本 `set -euo pipefail`

### 必须停下来问用户的场景

- 需要花钱（域名、API 付费、testnet 之外的费用）
- 涉及外部账号注册或 KYC
- 合约 ABI 与外部协议（Ondo / Backed / Dinari）的对接选择
- 任何对终极 Goal 或评审 4 维度的取舍
- 不擅自 push 远端或创建 PR

### 演示剧本（3 分钟）

- **0:00-0:30** 钩子: 70% 美股散户不参与股东会投票，Robinhood 即将放大 1000 倍
- **0:30-2:00** Demo: 登录 → 持仓 → 特斯拉 → AI 卡片 → 一键签名 → 链上回执
- **2:00-2:40** 商业: TAM 万亿、监管顺风、Robinhood Chain 路线图缺口
- **2:40-3:00** Roadmap + 团队

---

## 8. 已敲定的开工决策（2026-05-23）

1. **域名**: `speakup.vote`
2. **仓库**: 本地开发，提交日前上传 GitHub 公开
3. **Demo 标的**: TSLA + AMZN + NFLX，直接用 Robinhood Chain testnet 原生 Stock Token（已验证为 ERC-20，无 KYC）
4. **Robinhood Chain testnet 接入**: 优先用公开 RPC，需要 KYC/表单时再问用户
5. **凭证**: Anthropic API key、Privy app id 由用户在 D5 前提供，Envio token D15 前提供
6. **团队**: NodeStake 单人 + Claude 协作，前端/合约/Agent 全栈由 Claude 实现
