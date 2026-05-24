import { z } from 'zod';

export const ProposalCategoryEnum = z.enum([
  'compensation',
  'director_election',
  'auditor_ratification',
  'say_on_pay',
  'shareholder_proposal_esg',
  'shareholder_proposal_governance',
  'shareholder_proposal_other',
  'merger_acquisition',
  'capital_structure',
  'corporate_structure',
  'other',
]);
export type ProposalCategory = z.infer<typeof ProposalCategoryEnum>;

export const ChoiceEnum = z.enum(['FOR', 'AGAINST', 'ABSTAIN']);
export type Choice = z.infer<typeof ChoiceEnum>;

export const ProposalSchema = z.object({
  itemId: z.number().int().positive(),
  title: z.string().min(1).max(300),
  category: ProposalCategoryEnum,
  managementRecommendation: ChoiceEnum,
  oneLineBackground: z.string().min(1).max(280),
  keyDetails: z.array(z.string().min(1).max(280)).max(5),
  iss: z
    .object({
      stance: ChoiceEnum,
      reason: z.string().max(280),
    })
    .nullable(),
  glassLewis: z
    .object({
      stance: ChoiceEnum,
      reason: z.string().max(280),
    })
    .nullable(),
});
export type Proposal = z.infer<typeof ProposalSchema>;

export const ProposalListSchema = z.object({
  meetingTitle: z.string(),
  meetingDate: z.string(),
  proposals: z.array(ProposalSchema).min(1),
});
export type ProposalList = z.infer<typeof ProposalListSchema>;

export const UserPreferenceSchema = z.object({
  esgSlant: z.enum(['progressive', 'neutral', 'skeptical']).default('neutral'),
  executiveCompensation: z
    .enum(['oppose_high_packages', 'neutral', 'support_pay_for_performance'])
    .default('neutral'),
  boardIndependence: z
    .enum(['prefer_independent_majority', 'neutral', 'defer_to_management'])
    .default('prefer_independent_majority'),
  shareholderRights: z
    .enum(['expand', 'neutral', 'defer_to_management'])
    .default('expand'),
  customNotes: z.string().max(500).optional(),
});
export type UserPreference = z.infer<typeof UserPreferenceSchema>;

export const RecommendationSchema = z.object({
  itemId: z.number().int().positive(),
  recommended: ChoiceEnum,
  confidence: z.enum(['low', 'medium', 'high']),
  threeLineRationale: z.array(z.string().min(1).max(200)).length(3),
  alignsWithManagement: z.boolean(),
  alignsWithISS: z.boolean().nullable(),
  alignsWithGlassLewis: z.boolean().nullable(),
});
export type Recommendation = z.infer<typeof RecommendationSchema>;

export const RecommendationListSchema = z.object({
  recommendations: z.array(RecommendationSchema).min(1),
});
export type RecommendationList = z.infer<typeof RecommendationListSchema>;

export const VoteDecisionSchema = z.object({
  itemId: z.number().int().positive(),
  choice: ChoiceEnum,
  reasoningHash: z
    .string()
    .regex(/^0x[0-9a-fA-F]{64}$/, 'must be a 0x-prefixed 32-byte hex'),
});
export type VoteDecision = z.infer<typeof VoteDecisionSchema>;

export const AttestationCallArgsSchema = z.object({
  meetingId: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
  decisions: z.array(VoteDecisionSchema).min(1),
});
export type AttestationCallArgs = z.infer<typeof AttestationCallArgsSchema>;
