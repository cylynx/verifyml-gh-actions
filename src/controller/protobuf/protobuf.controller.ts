import type { IProtobuf } from './protobuf.interface';
import * as TProtobuf from './protobuf.type';
import protobuf, { Reader, Root } from 'protobufjs';
import jsonDescriptor from './protobuf.schema.json';

class ProtobufController implements IProtobuf {
  constructor() {}

  public decodeMessage = (fileBuffer: ArrayBuffer) => {
    const uint8Arr = new Uint8Array(fileBuffer);
    const root: Root = protobuf.Root.fromJSON(jsonDescriptor);

    const modelDetails = root.lookupType('model_card_toolkit.proto.ModelCard');

    const isInvalid = modelDetails.verify(uint8Arr);
    if (isInvalid) {
      throw isInvalid;
    }

    const reader = new Reader(uint8Arr);

    const message = modelDetails.decode(
      reader,
    ) as unknown as TProtobuf.ModelCard;
    return message;
  };

  private getReportResult = (
    reports: TProtobuf.TestInputReport,
  ): TProtobuf.ReportResult => {
    const defaultResult: TProtobuf.ReportResult = {
      passCount: 0,
      failCount: 0,
    };

    const dict = reports.reduce((result, report) => {
      const { tests } = report;
      const testCount = tests.length;

      if (testCount === 0) {
        return result;
      }

      const passCount = tests.reduce((count: number, test: TProtobuf.Test) => {
        const { passed = false } = test;

        if (passed === false) {
          return count;
        }

        return count + 1;
      }, 0);

      const failCount = testCount - passCount;
      const newResult = {
        passCount: result.passCount + passCount,
        failCount: result.failCount + failCount,
      };

      return newResult;
    }, defaultResult);

    return dict;
  };

  public deriveTestResults = (
    modelCard: TProtobuf.ModelCard,
  ): TProtobuf.TestResult => {
    const { quantitativeAnalysis, explainabilityAnalysis, fairnessAnalysis } =
      modelCard;

    const { explainabilityReports } = explainabilityAnalysis;
    const { performanceMetrics } = quantitativeAnalysis;
    const { fairnessReports } = fairnessAnalysis;

    const testResult: TProtobuf.TestResult = {
      explainabilityAnalysis: this.getReportResult(explainabilityReports),
      quantitativeAnalysis: this.getReportResult(performanceMetrics),
      fairnessAnalysis: this.getReportResult(fairnessReports),
    };

    return testResult;
  };
}

export default ProtobufController;
