import { EngineeringDomain, ProficiencyLevel } from "@prisma/client";

export interface StudentSkillInput {
  tagId: string;
  tagName: string;
  domain: EngineeringDomain;
  proficiency: ProficiencyLevel;
}

export interface OfferTagInput {
  tagId: string;
  tagName: string;
  domain: EngineeringDomain;
  isRequired: boolean;
  weight: number;
}

export interface CompatibilityResult {
  score: number; // 0 - 100%
  percentage: number;
  matchedRequiredTags: string[];
  missingRequiredTags: string[];
  matchedOptionalTags: string[];
  domainMatch: boolean;
  breakdown: {
    requiredScore: number;
    optionalScore: number;
    domainScore: number;
  };
}

const PROFICIENCY_MULTIPLIER: Record<ProficiencyLevel, number> = {
  BEGINNER: 0.7,
  INTERMEDIATE: 1.0,
  ADVANCED: 1.25,
};

/**
 * Calculează scorul de compatibilitate dintre un student și o ofertă de practică.
 * Ponderea:
 * - 70% acoperirea competențelor obligatorii (isRequired: true)
 * - 20% acoperirea competențelor opționale/dorite (isRequired: false)
 * - 10% potrivirea domeniului principal de inginerie
 */
export function calculateCompatibilityScore(
  studentDomain: EngineeringDomain,
  studentSkills: StudentSkillInput[],
  offerPrimaryDomain: EngineeringDomain,
  offerTags: OfferTagInput[]
): CompatibilityResult {
  if (offerTags.length === 0) {
    const domainMatch = studentDomain === offerPrimaryDomain;
    const score = domainMatch ? 75 : 50;
    return {
      score,
      percentage: score,
      matchedRequiredTags: [],
      missingRequiredTags: [],
      matchedOptionalTags: [],
      domainMatch,
      breakdown: {
        requiredScore: 0,
        optionalScore: 0,
        domainScore: domainMatch ? 10 : 0,
      },
    };
  }

  const studentSkillsMap = new Map<string, StudentSkillInput>();
  for (const skill of studentSkills) {
    studentSkillsMap.set(skill.tagName.toLowerCase().trim(), skill);
  }

  const requiredTags = offerTags.filter((t) => t.isRequired);
  const optionalTags = offerTags.filter((t) => !t.isRequired);

  const matchedRequiredTags: string[] = [];
  const missingRequiredTags: string[] = [];
  const matchedOptionalTags: string[] = [];

  // 1. Calcul scor cerințe obligatorii
  let totalRequiredWeight = 0;
  let earnedRequiredWeight = 0;

  for (const reqTag of requiredTags) {
    const weight = reqTag.weight || 1.0;
    totalRequiredWeight += weight;

    const matchedSkill = studentSkillsMap.get(reqTag.tagName.toLowerCase().trim());
    if (matchedSkill) {
      matchedRequiredTags.push(reqTag.tagName);
      const mult = PROFICIENCY_MULTIPLIER[matchedSkill.proficiency] || 1.0;
      earnedRequiredWeight += weight * Math.min(1.0, mult);
    } else {
      missingRequiredTags.push(reqTag.tagName);
    }
  }

  const requiredRatio = totalRequiredWeight > 0 ? earnedRequiredWeight / totalRequiredWeight : 1.0;
  const requiredScore = requiredRatio * 70;

  // 2. Calcul scor cerințe opționale
  let totalOptionalWeight = 0;
  let earnedOptionalWeight = 0;

  for (const optTag of optionalTags) {
    const weight = optTag.weight || 1.0;
    totalOptionalWeight += weight;

    const matchedSkill = studentSkillsMap.get(optTag.tagName.toLowerCase().trim());
    if (matchedSkill) {
      matchedOptionalTags.push(optTag.tagName);
      const mult = PROFICIENCY_MULTIPLIER[matchedSkill.proficiency] || 1.0;
      earnedOptionalWeight += weight * Math.min(1.0, mult);
    }
  }

  const optionalRatio = totalOptionalWeight > 0 ? earnedOptionalWeight / totalOptionalWeight : 0.5;
  const optionalScore = optionalRatio * 20;

  // 3. Calcul potrivire domeniu inginerie
  const domainMatch = studentDomain === offerPrimaryDomain;
  const domainScore = domainMatch ? 10 : 0;

  const rawTotal = requiredScore + optionalScore + domainScore;
  const finalScore = Math.min(100, Math.max(0, Math.round(rawTotal)));

  return {
    score: finalScore,
    percentage: finalScore,
    matchedRequiredTags,
    missingRequiredTags,
    matchedOptionalTags,
    domainMatch,
    breakdown: {
      requiredScore: Math.round(requiredScore * 10) / 10,
      optionalScore: Math.round(optionalScore * 10) / 10,
      domainScore,
    },
  };
}
