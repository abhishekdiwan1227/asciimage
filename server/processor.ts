import { spawn } from "child_process"
import fs from "fs"
import path from "path"

const processorPath = path.join(__dirname, "tools", "asciimg.py")
const pythonPath = path.join(__dirname, "asciimage", "bin", "python3")

export function processFile(file: string, outputFolder: string) {
    process.env["IMG_PATH"] = file
    process.env["OUTPUT_PATH"] = outputFolder

    const logPath = path.join(outputFolder, "asciimage.logs")

    return new Promise((res, rej) => {
        var asciiProcess = spawn(pythonPath, [processorPath])
        asciiProcess.stdout.setEncoding("utf-8")
        asciiProcess.stderr.setEncoding("utf-8")

        if (!fs.existsSync(outputFolder)) { 
            fs.mkdirSync(outputFolder)
        }

        var logWriter = fs.createWriteStream(logPath)

        asciiProcess.stdout.on("data", data => {
            logWriter.write(data + '\n')
        })

        asciiProcess.stderr.on("error", err => {
            logWriter.write(err + '\n')
        })

        asciiProcess.on("close", code => {
            logWriter.end()

            if (code != 0) {
                console.error(`[ERROR CODE] ${code}.`)
                return rej(code)
            }
            else {
                var outputFile = path.join(outputFolder, path.parse(file).name)
                if (!fs.existsSync(outputFile)) {
                    return rej("Failed to convert to ASCII.")
                }
                var data = fs.readFileSync(outputFile, { encoding: "utf-8" })
                return res(data)
            }
        })
    })
}