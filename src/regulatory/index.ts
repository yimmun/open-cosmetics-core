import { OpenCosmeticFormula } from '../spec';

export interface ComplianceRule {
  inciName: string;
  casNumber?: string;
  listName: "Health Canada Hotlist" | "EU Annex II" | "EU Annex III" | "California Prop 65";
  restrictionType: "Prohibited" | "Restricted";
  maxPercentage?: number;
  conditionDescription?: string;
}

export interface RegulatoryFinding {
  inci: string;
  listName: string;
  severity: "FAIL" | "WARN";
  message: string;
}

export class RegulatoryScreener {
  private rulesIndex = new Map<string, ComplianceRule[]>();

  constructor(rules: ComplianceRule[]) {
    rules.forEach((rule) => {
      const key = rule.inciName.trim().toUpperCase();
      const existing = this.rulesIndex.get(key) || [];
      existing.push(rule);
      this.rulesIndex.set(key, existing);
    });
  }

  public screen(formula: OpenCosmeticFormula): RegulatoryFinding[] {
    const findings: RegulatoryFinding[] = [];

    formula.ingredients.forEach((ing) => {
      const key = ing.inciName.trim().toUpperCase();
      const matchingRules = this.rulesIndex.get(key);

      if (matchingRules) {
        matchingRules.forEach((rule) => {
          if (rule.restrictionType === "Prohibited") {
            findings.push({
              inci: ing.inciName,
              listName: rule.listName,
              severity: "FAIL",
              message: `Prohibited substance under ${rule.listName}.`
            });
          } else if (rule.restrictionType === "Restricted") {
            if (rule.maxPercentage !== undefined && ing.percentage > rule.maxPercentage) {
              findings.push({
                inci: ing.inciName,
                listName: rule.listName,
                severity: "FAIL",
                message: `Exceeds max allowable concentration (${rule.maxPercentage}%) under ${rule.listName}. Current: ${ing.percentage}%.`
              });
            } else {
              findings.push({
                inci: ing.inciName,
                listName: rule.listName,
                severity: "WARN",
                message: rule.conditionDescription || `Subject to restrictions under ${rule.listName}.`
              });
            }
          }
        });
      }
    });

    return findings;
  }
}
