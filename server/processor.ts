import { spawn } from "child_process"
import fs from "fs"
import path from "path"


export async function processFile(file: string, outputFolder: string) {
    var asciimageConverterPath = process.env["ASCIIMAGE_PATH"] as string
    process.env["IMG_PATH"] = file
    process.env["OUTPUT_PATH"] = outputFolder
    return new Promise((res, rej) => {
        var asciiProcess = spawn("python3", ["/home/abhishek/source/repos/asciimage/tools/asciimg.py"])
        asciiProcess.stdout.setEncoding("utf-8")
        asciiProcess.stderr.setEncoding("utf-8")

        asciiProcess.stdout.on("data", data => {
            console.log(data)
        })

        asciiProcess.stderr.on("error", err => {
            console.error(err)
        })

        asciiProcess.on("close", code => {
            if (code != 0) {
                console.error(`[ERROR CODE] ${code}`)
                rej(code)
            }
            else { 
                var outputFile = path.join(outputFolder, path.parse(file).name)
                var data = fs.readFileSync(outputFile, {encoding: "utf-8"})
                res(data)
            }
        })
    })
}