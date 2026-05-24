import type { ProposalList, RecommendationList } from './types';

/**
 * Pre-canned proposals + recommendations for the three demo meetings.
 * Used when ANTHROPIC_API_KEY is unset (demo mode) so hackathon judges
 * can experience the full flow without provisioning an API key.
 *
 * Content is drawn from the real SEC DEF 14A filings linked in
 * docs/d1-research.md, plus public ISS / Glass Lewis season previews.
 * Counts are intentionally close to the headline preview counts that
 * the landing page advertises.
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
          iss: { stance: 'AGAINST', reason: 'Lack of board independence and prior comp committee role.' },
          glassLewis: { stance: 'AGAINST', reason: 'Same independence concerns plus poor say-on-pay history.' },
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
          iss: { stance: 'AGAINST', reason: 'Excessive size relative to peers; dilutes shareholders.' },
          glassLewis: { stance: 'AGAINST', reason: 'Same magnitude concerns; lacks performance-conditioning beyond stock price.' },
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
          iss: { stance: 'FOR', reason: 'Material reputational and regulatory risk warrants disclosure.' },
          glassLewis: { stance: 'AGAINST', reason: 'Existing AI policy disclosures sufficient.' },
        },
        {
          itemId: 5,
          title: 'Reincorporate Tesla from Delaware to Texas',
          category: 'corporate_structure',
          managementRecommendation: 'FOR',
          oneLineBackground:
            'Move legal jurisdiction from Delaware to Texas following the 2024 Chancery ruling against the Musk package.',
          keyDetails: [
            'Texas court system has less developed corporate case law on fiduciary duty.',
            'Would reduce future shareholder derivative-suit exposure.',
            'Critics argue this entrenches insiders by limiting recourse for minority holders.',
          ],
          iss: { stance: 'AGAINST', reason: 'Reduces shareholder protections; appears motivated by recent adverse ruling.' },
          glassLewis: { stance: 'AGAINST', reason: 'Weakens minority-shareholder rights.' },
        },
        {
          itemId: 6,
          title: 'Approve the 2025 equity incentive plan refresh',
          category: 'capital_structure',
          managementRecommendation: 'FOR',
          oneLineBackground:
            'Authorize 25 million new shares for employee + executive equity grants over the next 3 years.',
          keyDetails: [
            'Three-year burn rate of 2.1%, above ISS 1.5% threshold for large caps.',
            'Dilution from refresh is 0.8% of basic shares outstanding.',
            'Plan includes evergreen provision (annual automatic top-up).',
          ],
          iss: { stance: 'AGAINST', reason: 'Above-threshold burn rate plus evergreen feature.' },
          glassLewis: { stance: 'AGAINST', reason: 'Plan size and structure too generous.' },
        },
        {
          itemId: 7,
          title: 'Shareholder proposal: climate transition plan disclosure',
          category: 'shareholder_proposal_esg',
          managementRecommendation: 'AGAINST',
          oneLineBackground:
            'Asks Tesla to publish a Scope 3 emissions baseline and a credible transition plan aligned with 1.5C pathways.',
          keyDetails: [
            'Submitted by As You Sow on behalf of 87 institutional investors.',
            'Tesla currently discloses Scope 1 and 2 but not Scope 3 (supply chain + use phase).',
            'Use-phase emissions are dominated by upstream electricity grid mix.',
          ],
          iss: { stance: 'FOR', reason: 'Scope 3 disclosure is industry-standard for auto OEMs.' },
          glassLewis: { stance: 'FOR', reason: 'Material climate-related financial risk.' },
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
        {
          itemId: 5,
          recommended: 'AGAINST',
          confidence: 'high',
          threeLineRationale: [
            'Reincorporation right after an adverse ruling looks like venue shopping.',
            'Both ISS and Glass Lewis flag erosion of minority-shareholder protections.',
            'Your "expand shareholder rights" preference supports opposing this.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 6,
          recommended: 'AGAINST',
          confidence: 'medium',
          threeLineRationale: [
            'Burn rate 2.1% exceeds ISS large-cap threshold of 1.5%.',
            'Evergreen provision is a governance red flag your profile opposes.',
            'Both ISS and Glass Lewis recommend AGAINST.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 7,
          recommended: 'FOR',
          confidence: 'high',
          threeLineRationale: [
            'Scope 3 disclosure is now standard for auto OEMs (Ford, GM, Stellantis already publish).',
            'Material to long-term EV thesis given grid decarbonization is core to product story.',
            'Both ISS and Glass Lewis support; your ESG preference aligns.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
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
          oneLineBackground: 'Annual slate including CEO Andy Jassy and 10 other nominees.',
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
          title: 'Ratify Ernst & Young LLP as auditor for 2027',
          category: 'auditor_ratification',
          managementRecommendation: 'FOR',
          oneLineBackground: 'Annual ratification of the external auditor.',
          keyDetails: [
            'EY tenure 13 years.',
            'Audit fees $41M for 2026, in line with peer mega-cap retailers.',
            'No restatements; one material weakness disclosed in AWS revenue cutoff (remediated).',
          ],
          iss: { stance: 'FOR', reason: 'Routine; remediation complete.' },
          glassLewis: { stance: 'FOR', reason: 'Acceptable.' },
        },
        {
          itemId: 4,
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
          iss: { stance: 'FOR', reason: 'Material legal risk warrants enhanced disclosure.' },
          glassLewis: { stance: 'FOR', reason: 'Investor protection rationale.' },
        },
        {
          itemId: 5,
          title: 'Shareholder proposal: warehouse-worker safety report',
          category: 'shareholder_proposal_esg',
          managementRecommendation: 'AGAINST',
          oneLineBackground:
            'Asks Amazon to publish injury rates and union-related disciplinary actions across fulfillment centers.',
          keyDetails: [
            'OSHA recordable injury rate at Amazon FCs is 2x industry average.',
            'Proposal submitted by SOC Investment Group on behalf of pension funds.',
            'Existing sustainability report covers safety metrics in aggregate but not by site.',
          ],
          iss: { stance: 'FOR', reason: 'Material reputational and regulatory risk.' },
          glassLewis: { stance: 'AGAINST', reason: 'Existing aggregate disclosure sufficient.' },
        },
        {
          itemId: 6,
          title: 'Shareholder proposal: separate Chair and CEO roles',
          category: 'shareholder_proposal_governance',
          managementRecommendation: 'AGAINST',
          oneLineBackground:
            'Split the combined Chair / CEO role currently held by Andy Jassy into two positions.',
          keyDetails: [
            'Lead independent director structure currently in place.',
            'Median S&P 500 large-cap now separates roles (62%).',
            'Submitted by Trillium Asset Management.',
          ],
          iss: { stance: 'FOR', reason: 'Best practice for boards of this size and complexity.' },
          glassLewis: { stance: 'AGAINST', reason: 'Lead independent director adequate.' },
        },
        {
          itemId: 7,
          title: 'Approve the 2026 equity incentive plan',
          category: 'capital_structure',
          managementRecommendation: 'FOR',
          oneLineBackground: 'Refresh equity pool with 50 million new shares for employee grants.',
          keyDetails: [
            'Three-year burn rate 1.1%, within ISS thresholds.',
            'Dilution 0.5% of basic shares outstanding.',
            'No evergreen provision; 5-year sunset clause.',
          ],
          iss: { stance: 'FOR', reason: 'Within thresholds; conservative structure.' },
          glassLewis: { stance: 'FOR', reason: 'Reasonable size.' },
        },
        {
          itemId: 8,
          title: 'Shareholder proposal: human rights impact assessment for Project Nimbus',
          category: 'shareholder_proposal_esg',
          managementRecommendation: 'AGAINST',
          oneLineBackground:
            'Asks AWS to disclose human rights due diligence on the $1.2B Project Nimbus contract with the Israeli government.',
          keyDetails: [
            'Contract jointly held with Google; identical proposal at Alphabet.',
            'Filed by Investors for Human Rights.',
            'Amazon argues confidentiality clauses prevent disclosure.',
          ],
          iss: { stance: 'FOR', reason: 'Material reputational risk in current geopolitical context.' },
          glassLewis: { stance: 'AGAINST', reason: 'Existing human-rights policy adequate.' },
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
          confidence: 'medium',
          threeLineRationale: [
            'Routine ratification despite long EY tenure.',
            'Material weakness was remediated; no restatement.',
            'Both ISS and Glass Lewis recommend FOR.',
          ],
          alignsWithManagement: true,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 4,
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
        {
          itemId: 5,
          recommended: 'FOR',
          confidence: 'medium',
          threeLineRationale: [
            'Injury rate 2x industry is a material safety and litigation risk.',
            'Site-level disclosure unlocks meaningful comparison vs peers.',
            'ISS supports; Glass Lewis dissents on procedural grounds.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: false,
        },
        {
          itemId: 6,
          recommended: 'FOR',
          confidence: 'medium',
          threeLineRationale: [
            'Splitting Chair and CEO is now majority practice for S&P large caps.',
            'Combined role under regulatory pressure is structurally risky.',
            'ISS supports; Glass Lewis dissents on adequacy of lead independent director.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: false,
        },
        {
          itemId: 7,
          recommended: 'FOR',
          confidence: 'high',
          threeLineRationale: [
            'Burn rate and dilution well within ISS thresholds.',
            'No evergreen, fixed sunset clause is a positive signal.',
            'Both ISS and Glass Lewis recommend FOR.',
          ],
          alignsWithManagement: true,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 8,
          recommended: 'FOR',
          confidence: 'medium',
          threeLineRationale: [
            'Material reputational and legal risk in current geopolitical climate.',
            'Disclosure of due-diligence process is non-confidential by design.',
            'Your ESG preference aligns with ISS support here.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: false,
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
          oneLineBackground: 'Re-elect Ted Sarandos, Brad Smith, and Anne Sweeney.',
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
          glassLewis: { stance: 'AGAINST', reason: 'Existing ESG reporting addresses most asks.' },
        },
        {
          itemId: 4,
          title: 'Shareholder proposal: disclose AI use in script and casting decisions',
          category: 'shareholder_proposal_esg',
          managementRecommendation: 'AGAINST',
          oneLineBackground:
            'Requires Netflix to disclose how generative AI tools are used in script development, casting, and post-production.',
          keyDetails: [
            'Filed by SAG-AFTRA pension fund.',
            'Material to relationship with writers and actors guilds.',
            'WGA contract requires disclosure; SAG-AFTRA contract pending renegotiation.',
          ],
          iss: { stance: 'FOR', reason: 'Material labor relations and legal compliance risk.' },
          glassLewis: { stance: 'FOR', reason: 'Aligned with industry-wide disclosure trend.' },
        },
        {
          itemId: 5,
          title: 'Advisory vote on executive compensation (say-on-pay)',
          category: 'say_on_pay',
          managementRecommendation: 'FOR',
          oneLineBackground: 'Annual non-binding vote on Netflix executive pay.',
          keyDetails: [
            'Co-CEO realized pay was $42M, well above streaming peer median.',
            'Pay structure remains heavily front-loaded equity, not strongly performance-conditioned.',
            '2025 say-on-pay received only 62% support.',
          ],
          iss: { stance: 'AGAINST', reason: 'Pay-for-performance alignment weak.' },
          glassLewis: { stance: 'AGAINST', reason: 'Quantum exceeds peer practice.' },
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
        {
          itemId: 4,
          recommended: 'FOR',
          confidence: 'high',
          threeLineRationale: [
            'SAG-AFTRA contract renegotiation makes AI disclosure a material labor risk.',
            'WGA precedent already requires disclosure; consistency reduces legal exposure.',
            'Both ISS and Glass Lewis support.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
        {
          itemId: 5,
          recommended: 'AGAINST',
          confidence: 'high',
          threeLineRationale: [
            'Co-CEO pay of $42M well exceeds streaming peer median; weak performance-conditioning.',
            'Prior say-on-pay vote at 62% signals broad shareholder dissent.',
            'Your "oppose high comp packages" preference applies directly.',
          ],
          alignsWithManagement: false,
          alignsWithISS: true,
          alignsWithGlassLewis: true,
        },
      ],
    },
  },
};
