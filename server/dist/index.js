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
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const uuid_1 = require("uuid");
const processor_1 = require("./processor");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, express_fileupload_1.default)());
// var uploadsPath = path.join(__dirname, "uploads")
// app.use('/public', express.static(uploadsPath));  
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});
app.route("/ascii").post((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files || Object.keys(req.files).length == 0) {
        return res.status(400).json("No files selected.");
    }
    if (Object.keys(req.files).length > 1) {
        return res.status(400).json("Multiple files are not supported.");
    }
    var file = req.files.file;
    var destPath = path_1.default.join(os_1.default.tmpdir(), "asciimage", "uploads", (0, uuid_1.v4)());
    if (!fs_1.default.existsSync(destPath)) {
        fs_1.default.mkdirSync(destPath, { recursive: true });
    }
    var destFile = path_1.default.join(destPath, file.name);
    fs_1.default.writeFileSync(destFile, file.data);
    var outputFolder = path_1.default.join(destPath, "out");
    var data = yield (0, processor_1.processFile)(destFile, outputFolder);
    res.status(200).json(data);
}));
app.listen(port, () => console.log("Server started."));
//# sourceMappingURL=index.js.map