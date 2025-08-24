import FormulaSegment from "@/models/FormulaSegment";

interface Formula {
  id: number;
  name: string;
  formula: string;
  slug: string;
  template?: string;
  formula_segments: FormulaSegment[];
}

export default Formula;
