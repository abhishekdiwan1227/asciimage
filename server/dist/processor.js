"use strict";
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
exports.processFile = void 0;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function processFile(file, outputFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        var asciimageConverterPath = process.env["ASCIIMAGE_PATH"];
        process.env["IMG_PATH"] = file;
        process.env["OUTPUT_PATH"] = outputFolder;
        return new Promise((res, rej) => {
            var asciiProcess = (0, child_process_1.spawn)("python3", ["/home/abhishek/source/repos/asciimage/tools/asciimg.py"]);
            asciiProcess.stdout.setEncoding("utf-8");
            asciiProcess.stderr.setEncoding("utf-8");
            asciiProcess.stdout.on("data", data => {
                console.log(data);
            });
            asciiProcess.stderr.on("error", err => {
                console.error(err);
            });
            asciiProcess.on("close", code => {
                if (code != 0) {
                    console.error(`[ERROR CODE] ${code}`);
                    rej(code);
                }
                else {
                    var outputFile = path_1.default.join(outputFolder, path_1.default.parse(file).name);
                    var data = fs_1.default.readFileSync(outputFile, { encoding: "utf-8" });
                    res(data);
                }
            });
        });
    });
}
exports.processFile = processFile;
//# sourceMappingURL=processor.js.map