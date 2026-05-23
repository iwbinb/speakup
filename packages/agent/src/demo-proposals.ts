import type { ProposalList, RecommendationList } from './types';

/**
 * Pre-canned proposals + recommendations for the three demo meetings.
 * Used when ANTHROPIC_API_KEY is unset (demo mode) so hackathon judges
 * can experience the full flow without provisioning an API key.
 *
 * Content is drawn from the real SEC DEF 14A filings linked in
 * docs/d1-research.md, but trimmed and rewritten in plain English.
 */

export const DEMO_PROPOSALS: Record<
  string,
  { proposals: ProposalList; recommendations: RecommendationList }
> = {
  'TSLA-2025-ANNUAL': {
    proposals: {
      meetingTitle: 'Tesla 2025 Annual Meeting of Stockholders',
      meetingDate: '2025-11-06',
      proposals: [
        {
          itemId: 1,
          title: 'Election of three Class III directors',
          category: 'director_election',
          managementRecommendation: 'FOR',
          oneLineBackground:
            'Re-elect Ira Ehrenpreis, Joe Gebbia, and Kathleen Wilson-Thompson to three-year terms.',
          keyDetails: [
            'All three nominees were on the board during the 2024 governance failures around the $56B Musk comp award.',
            'Independent board majority would drop to 6 of 9 if all elected, below the 75% threshold ISS recommends.',
            'No new candidates with EV-supply-chain or AI safety expertise.',
          ],
          iss: {
            stance: 'AGAINST',
            reason: 'Lack of board independence and prior comp committee role.',
          },
          glassLewis: {
            stance: 'AGAINST',
            reason: 'Same independence concerns plus poor say-on-pay history.',
          },
        },
        {
          itemId: 2,
          title: 'Ratify the 2018 Musk performance award (re-vote)',
          category: 'compensation',
          managementRecommendation: 'FOR',
          oneLineBackground:
            'Re-approval of the $56 billion CEO performance package that the Delaware Chancery Court rescinded in 2024.',
          keyDetails: [
            'Original 2018 grant was 12 tranches tied to market-cap milestones; all 12 were achieved.',
            'Court rescinded on procedural fairness grounds, not on the merits of the targets.',
            'Re-approval would not restore the cancelled tranches; this is a fresh comp package of similar size.',
            'Largest CEO compensation package in US public-company history.',
          ],
          iss: {
            stance: 'AGAINST',
            reason: 'Excessive size relative to peers; dilutes shareholders.',
          },
          glassLewis: {
            stance: 'AGAINST',
            reason: 'Same magnitude concerns; lacks performance-conditioning beyond stock price.',
          },
        },
        {
          itemId: 3,
          title: 'Ratify PricewaterhouseCoopers LLP as auditor for 2026',
          category: 'auditor_ratification',
          managementRecommendation: 'FOR',
          oneLineBackground: 'Standard annual ratification of the independent auditor.',
          keyDetails: [
            'PwC has been Tesla auditor since 2005.',
            'Audit fees in 2025 were $24.8M, in line with peers.',
            'No restatements or material weaknesses reported.',
          ],
          iss: { stance: 'FOR', reason: 'Routine; no auditor independence issues.' },
          glassLewis: { stance: 'FOR', reason: 'Routine ratification.' },
        },
        {
          itemId: 4,
          title: 'Shareholder proposal: report on AI training data and labor practices',
          category: 'shareholder_proposal_esg',
          managementRecommendation: 'AGAINST',
          oneLineBackground:
            'Independent shareholder asks Tesla to publish an annual report on the data sources and labor used to train its self-driving and Optimus models.',
          keyDetails: [
            'Proposal submitted by NYC Comptroller on behalf of pension funds holding 1.2M shares.',
            'Would require disclosure of data acquisition contracts and contractor classifications.',
            'Tesla argues disclosure would harm competitive position.',
          ],
          iss: {
            stance: 'FOR',
            reason: 'Material reputational and regulatory risk warrants disclosure.',
          },
          glassLewis: {
            stance: 'AGAINST',
            reason: 'Existing AI policy disclosures sufficient.',
          },
        },
      ],
    },
    recommendations: {
      recommendations: [
        {
          itemId: 1,
          recommended: 'AGAINST',
          confidence: 'high',
          threeLineRationale: [
            'Both ISS and Glass Lewis flag board independence at 67%, below the 75% best-practice threshold.',
            'Your preference for an independent board majority maps directly to opposing this slate.',
            'No directors on the slate dissented from the 2024 comp committee actions.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 2,
          recommended: 'AGAINST',
          confidence: 'high',
          threeLineRationale: [
            '$56B is the largest CEO comp package in US history and dilutes existing shareholders.',
            'Your "oppose high comp packages" preference directly applies here.',
            'ISS and Glass Lewis both recommend AGAINST on size and structure concerns.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 3,
          recommended: 'FOR',
          confidence: 'medium',
          threeLineRationale: [
            'Routine auditor ratification with no independence red flags.',
            'PwC tenure is long but rotated audit partners regularly.',
            'Both ISS and Glass Lewis recommend FOR.',
          ],
          alignsWithManagement: true,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 4,
          recommended: 'FOR',
          confidence: 'medium',
          threeLineRationale: [
            'Your progressive ESG stance favors more disclosure on AI training and labor.',
            'ISS supports on material risk grounds; Glass Lewis dissents.',
            'Disclosure cost is modest relative to the long-term reputational risk.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: false,
        },
      ],
    },
  },

  'AMZN-2026-ANNUAL': {
    proposals: {
      meetingTitle: 'Amazon 2026 Annual Meeting of Stockholders',
      meetingDate: '2026-05-21',
      proposals: [
        {
          itemId: 1,
          title: 'Election of 11 directors',
          category: 'director_election',
          managementRecommendation: 'FOR',
          oneLineBackground:
            'Annual slate including CEO Andy Jassy and 10 other nominees.',
          keyDetails: [
            'Board has 91% independent members.',
            'New nominee with AI safety background added this year.',
            'Combined Chair/CEO role retained despite shareholder pressure.',
          ],
          iss: { stance: 'FOR', reason: 'Strong independence and refreshment record.' },
          glassLewis: { stance: 'FOR', reason: 'Routine election; well-balanced slate.' },
        },
        {
          itemId: 2,
          title: 'Advisory vote on executive compensation (say-on-pay)',
          category: 'say_on_pay',
          managementRecommendation: 'FOR',
          oneLineBackground:
            'Annual non-binding shareholder vote on Amazon executive pay practices.',
          keyDetails: [
            'CEO realized pay was $36M, below FAANG peer median.',
            'Pay-for-performance ratio improved from 0.78 to 0.92.',
            'Equity awards now 70% performance-conditioned, up from 50%.',
          ],
          iss: { stance: 'FOR', reason: 'Pay-for-performance alignment strong.' },
          glassLewis: { stance: 'FOR', reason: 'Reasonable structure and quantum.' },
        },
        {
          itemId: 3,
          title: 'Shareholder proposal: report on antitrust risk in AWS-retail integration',
          category: 'shareholder_proposal_governance',
          managementRecommendation: 'AGAINST',
          oneLineBackground:
            'Asks Amazon to disclose how AWS and retail data sharing exposes the company to FTC and EU CMA antitrust actions.',
          keyDetails: [
            'FTC v. Amazon case is ongoing; FTC has signaled intent to seek breakup remedies.',
            'EU CMA opened a formal probe in March 2026.',
            'Investor coalition (CalPERS + 4 European pension funds) sponsors the proposal.',
          ],
          iss: {
            stance: 'FOR',
            reason: 'Material legal risk warrants enhanced disclosure.',
          },
          glassLewis: { stance: 'FOR', reason: 'Investor protection rationale.' },
        },
      ],
    },
    recommendations: {
      recommendations: [
        {
          itemId: 1,
          recommended: 'FOR',
          confidence: 'high',
          threeLineRationale: [
            'Board independence at 91% exceeds your preferred threshold.',
            'New AI safety director addresses a material emerging risk.',
            'Both ISS and Glass Lewis recommend FOR.',
          ],
          alignsWithManagement: true,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 2,
          recommended: 'FOR',
          confidence: 'medium',
          threeLineRationale: [
            'CEO pay is below FAANG peer median, addressing your high-pay-package concern.',
            '70% performance-conditioned equity is materially better than industry default.',
            'Both ISS and Glass Lewis agree.',
          ],
          alignsWithManagement: true,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 3,
          recommended: 'FOR',
          confidence: 'high',
          threeLineRationale: [
            'FTC and EU CMA actions are material legal risks shareholders deserve detail on.',
            'Your "expand shareholder rights" preference supports disclosure proposals.',
            'Both ISS and Glass Lewis support; management opposition is procedural.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
      ],
    },
  },

  'NFLX-2026-ANNUAL': {
    proposals: {
      meetingTitle: 'Netflix 2026 Annual Meeting of Stockholders',
      meetingDate: '2026-06-04',
      proposals: [
        {
          itemId: 1,
          title: 'Election of three Class III directors',
          category: 'director_election',
          managementRecommendation: 'FOR',
          oneLineBackground:
            'Re-elect Ted Sarandos, Brad Smith, and Anne Sweeney.',
          keyDetails: [
            'Sarandos is co-CEO; Smith and Sweeney are independent.',
            'Board independence holds at 78%.',
            'Smith is the most prominent AI policy voice on any media board.',
          ],
          iss: { stance: 'FOR', reason: 'Solid mix; AI policy expertise valued.' },
          glassLewis: { stance: 'FOR', reason: 'Acceptable slate.' },
        },
        {
          itemId: 2,
          title: 'Approve the 2026 stock incentive plan',
          category: 'capital_structure',
          managementRecommendation: 'FOR',
          oneLineBackground:
            'Refresh of the equity pool authorizing 8M new shares for employee + director grants over the next 3 years.',
          keyDetails: [
            'Three-year burn rate of 1.4%, within ISS acceptable range.',
            'Dilution from refresh is 1.8% of basic shares outstanding.',
            'No evergreen provision.',
          ],
          iss: { stance: 'FOR', reason: 'Burn rate and dilution within thresholds.' },
          glassLewis: { stance: 'AGAINST', reason: 'Prefer smaller share refresh.' },
        },
        {
          itemId: 3,
          title: 'Shareholder proposal: annual content moderation transparency report',
          category: 'shareholder_proposal_esg',
          managementRecommendation: 'AGAINST',
          oneLineBackground:
            'Asks Netflix to publish an annual report on content moderation, government takedown requests, and AI moderation tooling.',
          keyDetails: [
            'Submitted by Open MIC on behalf of Trillium Asset Management.',
            'Netflix already publishes a biennial Environmental Social Governance report.',
            'Proposal cites EU Digital Services Act and parallel UK/Brazil obligations.',
          ],
          iss: { stance: 'FOR', reason: 'Material regulatory and reputational risk.' },
          glassLewis: {
            stance: 'AGAINST',
            reason: 'Existing ESG reporting addresses most asks.',
          },
        },
      ],
    },
    recommendations: {
      recommendations: [
        {
          itemId: 1,
          recommended: 'FOR',
          confidence: 'medium',
          threeLineRationale: [
            'Board independence at 78% exceeds your preferred majority threshold.',
            'Smith brings rare AI policy expertise relevant to streaming content.',
            'Both ISS and Glass Lewis support.',
          ],
          alignsWithManagement: true,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 2,
          recommended: 'FOR',
          confidence: 'low',
          threeLineRationale: [
            'Burn rate and dilution are within standard governance thresholds.',
            'ISS supports; Glass Lewis dissents on size, not structure.',
            'Refresh is needed to retain talent in a competitive content market.',
          ],
          alignsWithManagement: true,
          alignsWithISS: true,
          alignsWithGlassLewis: false,
        },
        {
          itemId: 3,
          recommended: 'FOR',
          confidence: 'medium',
          threeLineRationale: [
            'Your progressive ESG stance favors content moderation transparency.',
            'EU DSA and UK Online Safety Act create real regulatory exposure.',
            'Annual cadence is modest compared to industry peers like Meta and Google.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: false,
        },
      ],
    },
  },
};
