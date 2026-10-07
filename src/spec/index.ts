export interface Ingredient {
  id: string;
  phase: string;
  tradeName: string;
  inciName: string;
  casNumber?: string;
  percentage: number;
  isQuantumSatis: boolean;
  function?: string;
  costPerKg?: number;
  currency?: string;
}

export interface OpenCosmeticFormula {
  schemaVersion: "1.0.0";
  metadata: {
    formulaId: string;
    formulaCode: string;
    name: string;
    version: string;
    productCategory: string;
    application: "Leave On" | "Rinse Off";
    author?: string;
    createdAt: string;
    targetPh?: number;
  };
  ingredients: Ingredient[];
}
