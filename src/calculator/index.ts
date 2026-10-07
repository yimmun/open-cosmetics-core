import { OpenCosmeticFormula, Ingredient } from '../spec';

export interface CalculationResult {
  balancedIngredients: (Ingredient & { calculatedPercentage: number; batchWeight: number })[];
  totalPercentage: number;
  isBalanced: boolean;
  qsIngredientName?: string;
  costPer100g?: number;
}

export interface DyeMolecule {
  inciName: string;
  molecularWeight: number; // g/mol
  percentage: number;      // % w/w
  type: 'Precursor' | 'Coupler';
}

export const calculateBOM = (
  formula: OpenCosmeticFormula,
  batchSize: number = 100 // Unit: g
): CalculationResult => {
  let nonQsSum = 0;
  let qsIndex = -1;

  formula.ingredients.forEach((ing, index) => {
    if (ing.isQuantumSatis) {
      qsIndex = index;
    } else {
      nonQsSum += ing.percentage;
    }
  });

  const qsPercentage = qsIndex !== -1 ? Math.max(0, 100 - nonQsSum) : 0;
  const isBalanced = qsIndex !== -1 || Math.abs(nonQsSum - 100) < 0.0001;

  let totalCostPer100g = 0;

  const balancedIngredients = formula.ingredients.map((ing, index) => {
    const finalPct = index === qsIndex ? qsPercentage : ing.percentage;
    const batchWeight = (batchSize * finalPct) / 100;

    if (ing.costPerKg) {
      totalCostPer100g += (finalPct / 100) * (ing.costPerKg / 10);
    }

    return {
      ...ing,
      calculatedPercentage: Number(finalPct.toFixed(4)),
      batchWeight: Number(batchWeight.toFixed(4))
    };
  });

  return {
    balancedIngredients,
    totalPercentage: qsIndex !== -1 ? 100 : Number(nonQsSum.toFixed(4)),
    isBalanced,
    qsIngredientName: qsIndex !== -1 ? formula.ingredients[qsIndex].tradeName : undefined,
    costPer100g: Number(totalCostPer100g.toFixed(4))
  };
};

export const calculateDyeStoichiometry = (dyes: DyeMolecule[]) => {
  let precursorMoles = 0;
  let couplerMoles = 0;

  dyes.forEach((dye) => {
    const moles = (dye.percentage / 100) / dye.molecularWeight;
    if (dye.type === 'Precursor') precursorMoles += moles;
    if (dye.type === 'Coupler') couplerMoles += moles;
  });

  const ratio = couplerMoles > 0 ? (precursorMoles / couplerMoles).toFixed(2) : 'N/A';
  const isStoichiometric = Math.abs(precursorMoles - couplerMoles) < 0.0005;

  return {
    precursorMoles,
    couplerMoles,
    molarRatio: ratio,
    isBalanced: isStoichiometric,
    status: isStoichiometric
      ? 'Balanced'
      : precursorMoles > couplerMoles
      ? 'Excess Precursor (Darker/Off-tone)'
      : 'Excess Coupler (Unreacted Coupler Risk)'
  };
};
