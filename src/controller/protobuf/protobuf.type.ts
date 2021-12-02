import * as TProtobuf from './protobuf.type';
export interface ModelCard {
  modelDetails: ModelDetails;
  modelParameters: ModelParameters;
  considerations: Consideration;
  quantitativeAnalysis: QuantitativeAnalysis;
  explainabilityAnalysis: ExplainabilityAnalysis;
  fairnessAnalysis: FairnessAnalysis;
}

/** ====================================
 *  Model Details
 ** ==================================== */
export interface ModelDetails {
  name: string;
  overview: string;
  documentation: string;
  owners: Owner[];
  version: Version;
  licenses: License[];
  references: Reference[];
  citations: Citation[];
  regulatoryRequirements: string;
}

export type Owner = {
  name: string;
  contact: string;
  role: string;
};

export type Version = {
  name: string;
  date: string;
  diff: string;
};

export type License = {
  identifier: string;
  custom_text: string;
};

export type Reference = {
  reference: string;
};

export type Citation = {
  style: string;
  citation: string;
};

/** ====================================
 *  Model Parameters
 ** ==================================== */
export interface ModelParameters {
  modelArchitecture?: string;
  data: Dataset[];
  inputFormat?: string;
  outputFormat?: string;
}

export interface Dataset {
  name: string;
  link: string;
  sensitive: SensitiveData;
  graphics: GraphicsCollection;
  description: string;
}

export type SensitiveData = {
  sensitiveData: string[];
  sensitiveDataUsed: string[];
  justification: string;
};

export interface GraphicsCollection {
  description: string;
  collection: Graphic[];
}

export type Graphic = {
  name: string;
  image: string;
};

/** ====================================
 *  Quantitative Analysis
 ** ==================================== */
export interface QuantitativeAnalysis {
  performanceMetrics: PerformanceMetric[];
}

export type PerformanceMetric = {
  type: string;
  value: string;
  slice: string;
  graphics: GraphicsCollection;
  tests: Test[];
};

export type Test = {
  name: string;
  description: string;
  threshold: string;
  result: string;
  passed: boolean;
  graphics: GraphicsCollection;
};

/** ====================================
 *  Consideration
 ** ==================================== */
export interface Consideration {
  users: User[];
  useCases: UseCase[];
  limitations: Limitation[];
  tradeoffs: Tradeoff[];
  ethicalConsiderations: Risk[];
  fairnessAssessment: FairnessAssessment[];
}

export type User = {
  description: string;
};

export type UseCase = User;
export type Limitation = UseCase;
export type Tradeoff = Limitation;

export type Risk = {
  name: string;
  mitigationStrategy: string;
};

export type FairnessAssessment = {
  groupAtRisk: string;
  benefits: string;
  harms: string;
  mitigationStrategy: string;
};

/** ====================================
 *  Explainability Analysis
 ** ==================================== */
export interface ExplainabilityAnalysis {
  explainabilityReports: ExplainabilityReport[];
}

export type ExplainabilityReport = {
  type: string;
  slice: string;
  description: string;
  graphics: GraphicsCollection;
  tests: Test[];
};

/** ====================================
 *  Fairness Analysis
 ** ==================================== */
export interface FairnessAnalysis {
  fairnessReports: FairnessReport[];
}

export type FairnessReport = {
  type: string;
  slice: string;
  segment: string;
  description: string;
  graphics: GraphicsCollection;
  tests: Test[];
};

/** ====================================
 *   Test Result
 ** ==================================== */
export type ReportResult = {
  passCount: number;
  failCount: number;
};

export type TestResult = {
  quantitativeAnalysis: ReportResult;
  explainabilityAnalysis: ReportResult;
  fairnessAnalysis: ReportResult;
};

export type TestInputReport = Array<
  | TProtobuf.ExplainabilityReport
  | TProtobuf.PerformanceMetric
  | TProtobuf.FairnessReport
>;
