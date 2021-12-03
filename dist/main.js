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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const comment_1 = __importDefault(require("./controller/comment"));
const protobuf_1 = __importDefault(require("./controller/protobuf"));
const reader_1 = __importDefault(require("./controller/reader"));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const readerController = new reader_1.default();
    const protobufController = new protobuf_1.default();
    const commentController = new comment_1.default();
    try {
        const cwd = core.getInput('cwd');
        const path = core.getInput('data-path');
        if (!path) {
            core.setFailed('`data-path` is not provided, the path to dataset is required for us to compute the results.');
            throw new Error('Missing `data-path` parameters');
        }
        const filePath = `${cwd}${path}`;
        const data = yield readerController.readDataFromPath(filePath);
        const modelCard = protobufController.decodeMessage(data);
        const testResult = protobufController.deriveTestResults(modelCard);
        commentController.makeComment(testResult, path);
    }
    catch (error) {
        core.setFailed(error.message);
    }
});
main();
