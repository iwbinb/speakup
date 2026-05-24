# D1 Research Notes

记录 D1 阶段的关键技术调研结论。所有结论须在 D5 开始合约开发前 freeze 进 PROJECT.md。

最后更新：2026-05-23

---

## 1. Robinhood Chain Testnet（已验证）

| 项 | 值 |
|---|---|
| Chain ID | 46630 |
| 公开 RPC | `https://rpc.testnet.chain.robinhood.com` |
| Alchemy RPC（推荐） | `https://robinhood-testnet.g.alchemy.com/v2/<API_KEY>` |
| Native gas | ETH |
| Block time | ~1.21s |
| 区块浏览器 | https://explorer.testnet.chain.robinhood.com (Blockscout) |
| Faucet | https://faucet.testnet.chain.robinhood.com |
| Faucet 发放 | 5x ETH + 5x of each Stock Token (TSLA/AMZN/PLTR/NFLX/AMD) |
| KYC 要求 | 无，公开 |
| Foundry 部署 | 已验证 `forge create` 直接可用，verify 走 Blockscout API |
| 底层架构 | Arbitrum Orbit L2, Ethereum blobs DA |

### Foundry 部署模版

```bash
export PRIVATE_KEY=0x...
export RH_RPC_URL=https://rpc.testnet.chain.robinhood.com

forge create src/Registry.sol:Registry \
  --rpc-url $RH_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

forge verify-contract <address> src/Registry.sol:Registry \
  --chain-id 46630 \
  --verifier blockscout \
  --verifier-url https://explorer.testnet.chain.robinhood.com/api/
```

---

## 2. Robinhood Chain Testnet Stock Tokens（已验证）

**关键发现**: Stock Token 是普通 ERC-20，不是 ERC-3643，无 KYC transfer 限制。这意味着我们**不需要部署任何 mock 合约**，直接用 testnet 原生 token 即可。

| Ticker | Name | 合约地址 | Total Supply | Holders |
|---|---|---|---|---|
| TSLA | Tesla | `0xC9f9c86933092BbbfFF3CCb4b105A4A94bf3Bd4E` | 4,918,985 | 196,530 |
| AMZN | Amazon | `0x5884aD2f920c162CFBbACc88C9C51AA75eC09E02` | 4,918,985 | 196,079 |
| NFLX | Netflix | `0x3b8262A63d25f0477c4DDE23F83cfe22Cb768C93` | 4,918,985 | 195,818 |
| PLTR | Palantir Technologies | `0x1FBE1a0e43594b3455993B5dE5Fd0A7A266298d0` | 4,918,985 | 196,792 |
| AMD | AMD | `0x71178BAc73cBeb415514eB542a8995b82669778d` | 4,918,985 | 200,328 |

所有 5 个均 18 decimals，testnet 钱包持有人数已超 19 万，证明 testnet 已被广泛使用。

### 辅助资产

| Symbol | 用途 | 合约地址 |
|---|---|---|
| USDC | 测试稳定币（分红/费用结算） | `0xbf4479C07Dc6fdc6dAa764A0ccA06969e894275F` |
| WETH | 包装 ETH | `0x33e4191705c386532ba27cBF171Db86919200B94` |

---

## 3. Demo 标的最终敲定（修正原计划）

### 原计划（已废弃）

dTSLA (Dinari) + bCSPX (Backed) + dAAPL (Dinari)

**废弃理由**：
- Robinhood Chain testnet 原生有真实的 TSLA/AMZN/PLTR/NFLX/AMD，叙事更纯粹（"我们直接用 Robinhood Chain 的资产"）
- Ondo 实际不发股票 token，原计划名词笔误（dTSLA 是 Dinari 的）
- Dinari/Backed (xstocks) 的合约地址需要 KYC 流程才能拿到完整，22 天工期吃紧
- 用 Robinhood Chain 原生 token 直接命中 Robinhood 配额叙事

### 新计划

**主推三标的：TSLA + AMZN + NFLX**

| Ticker | 叙事 hook | 议题密度 |
|---|---|---|
| TSLA | 马斯克 560 亿薪酬包重审，2024 法院推翻后重新表决 | 高（年度多议题） |
| AMZN | 反垄断诉讼、AWS 拆分提案、零工劳工 ESG | 中高 |
| NFLX | 内容审查 ESG、CEO 薪酬、回购授权 | 中 |

三个标的覆盖：科技消费 + 电商物流 + 内容流媒体三种 governance 风格，演示视频可以分别用 30s 展示。

### Fallback 路径

如某只 token 在 D15 前 EDGAR 拉不到完整 DEF 14A，从备选 PLTR / AMD 替换。

---

## 4. 第三方发行方（仅作 production roadmap 引用，MVP 不集成）

**Dinari dShares**
- SEC 注册 transfer agent，最合规
- 已发行 dAAPL/dMSFT/dNVDA/dAMZN/dGOOGL 等
- 部分文章提到部署在 Arbitrum One，但 docs 需要 API key 才能拿合约清单
- API SDK 包：`@dinari/api-sdk`
- 注册入口：partners.dinari.com
- Production 时需对接，MVP 不集成

**Backed Finance / xStocks**
- 域名已迁移到 docs.xstocks.fi（与 Kraken 合作迁 Solana）
- 已发行 bCSPX/bTSLA/bCOIN/bNVDA/bMSTR/bGME/bMSFT/bGOOGL
- 多链部署（含 Solana xStocks）
- MVP 不集成

**Ondo Finance**
- 不发股票 token，只有 OUSG (美债 ETF) + USDY (美元债)
- 与 SpeakUp 场景无关

---

## 5. SEC EDGAR API 验证（已完成）

### API 接入

| 项 | 值 |
|---|---|
| Submissions API | `https://data.sec.gov/submissions/CIK{10-digit}.json` |
| 文档 base | `https://www.sec.gov/Archives/edgar/data/{CIK-int}/{accession-no-hyphen}/{primary-doc}` |
| User-Agent | 必须带 email，否则 403。当前用 `SpeakUp-Hackathon iwbinb@icloud.com` |
| Rate limit | 10 req/s（无 API key 必须遵守） |
| 成本 | 完全免费 |

### 三只 demo 标的最新 DEF 14A

| Ticker | CIK | 最新申报日 | 文档 URL |
|---|---|---|---|
| TSLA | 0001318605 | 2025-09-17 | https://www.sec.gov/Archives/edgar/data/1318605/000110465925090866/tm252289-12_def14a.htm |
| AMZN | 0001018724 | 2026-04-09 | https://www.sec.gov/Archives/edgar/data/1018724/000110465926041026/tm261382-1_def14a.htm |
| NFLX | 0001065280 | 2026-04-16 | https://www.sec.gov/Archives/edgar/data/1065280/000119312526159286/d20613ddef14a.htm |

**AMZN + NFLX 均 2026 年最新申报，时效性极强**，演示视频可以打"实时上链投票"叙事。

### Tesla 2025 DEF 14A 文档体量

- 原始 HTML：4.5 MB / 42,566 行
- 关键术语密度：Proposal 350 / Compensation 455 / Director 420 次
- 纯文本提取后预估 200-500 KB，单次 Anthropic Sonnet 4.6（200K context）可一次容纳
- prompt caching 启用后重复解读同文档成本可降至 $0.02 量级

### D5-D9 实现要点

1. EDGAR 取数走标准 User-Agent + 10 req/s 限速，本地 cache 24h
2. HTML → 纯文本用 `cheerio` 或 `linkedom`，避免 base64 图片污染
3. Reader Agent 提示词分两段：第一段提取 proposal 列表（结构化 JSON），第二段对每个 proposal 单独深读
4. ISS / Glass Lewis 立场用关键词检索 + 用户偏好画像做 weighted scoring，避免完全依赖 LLM 黑盒

---

## 6. 仍需用户决策

- Demo 标的三选最终敲定：默认 TSLA + AMZN + NFLX，如想换成含 PLTR / AMD 请说
- Alchemy API key（D5 前）：新申请或复用现有
- Anthropic API key（D5 前）：复用现有账号
- Privy app id（D10 前）：免费档够用
- speakup.vote 域名注册（D20 前）：约 $30/年
