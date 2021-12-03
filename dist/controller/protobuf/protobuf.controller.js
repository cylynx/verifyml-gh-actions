"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const protobufjs_1 = __importStar(require("protobufjs"));
const protobuf_schema_json_1 = __importDefault(require("./protobuf.schema.json"));
class ProtobufController {
    constructor() {
        this.decodeMessage = (fileBuffer) => {
            const uint8Arr = new Uint8Array(fileBuffer);
            const root = protobufjs_1.default.Root.fromJSON(protobuf_schema_json_1.default);
            const modelDetails = root.lookupType('model_card_toolkit.proto.ModelCard');
            const isInvalid = modelDetails.verify(uint8Arr);
            if (isInvalid) {
                throw isInvalid;
            }
            const reader = new protobufjs_1.Reader(uint8Arr);
            const message = modelDetails.decode(reader);
            return message;
        };
        this.getReportResult = (reports) => {
            const defaultResult = {
                passCount: 0,
                failCount: 0,
            };
            const dict = reports.reduce((result, report) => {
                const { tests } = report;
                const testCount = tests.length;
                if (testCount === 0) {
                    return result;
                }
                const passCount = tests.reduce((count, test) => {
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
        this.deriveTestResults = (modelCard) => {
            const { quantitativeAnalysis, explainabilityAnalysis, fairnessAnalysis } = modelCard;
            const { explainabilityReports } = explainabilityAnalysis;
            const { performanceMetrics } = quantitativeAnalysis;
            const { fairnessReports } = fairnessAnalysis;
            const testResult = {
                explainabilityAnalysis: this.getReportResult(explainabilityReports),
                quantitativeAnalysis: this.getReportResult(performanceMetrics),
                fairnessAnalysis: this.getReportResult(fairnessReports),
            };
            return testResult;
        };
    }
}
exports.default = ProtobufController;
