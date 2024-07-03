import express from "express";
import fileUpload, { UploadedFile } from "express-fileupload"
import path from "path";
import fs from "fs";
import os from "os"
import { v4 as uuidv4 } from 'uuid';
import { processFile } from "./processor";

const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload())
// var uploadsPath = path.join(__dirname, "uploads")
// app.use('/public', express.static(uploadsPath));  

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
});

app.route("/ascii").post(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length == 0) {
        return res.status(400).json("No files selected.")
    }

    if (Object.keys(req.files).length > 1) {
        return res.status(400).json("Multiple files are not supported.")
    }

    var file = req.files.file as UploadedFile
    var destPath = path.join(os.tmpdir(), "asciimage", "uploads", uuidv4())

    if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, {recursive: true})
    }

    var destFile = path.join(destPath, file.name)

    fs.writeFileSync(destFile, file.data)

    var outputFolder = path.join(destPath, "out")

    await processFile(destFile, outputFolder)
        .then(data => res.status(200).json(data))
        .catch(err => res.status(500).json(err))
})

app.listen(port, () =>
    console.log("Server started.")
);