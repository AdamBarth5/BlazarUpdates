const fs = require("fs")
const spawn = require("child_process")
fs.writeFile("./buildFile","", () => {})


serverproc = spawn.execFile("./py/dist/server/server.exe", ["2032"], (err, stdout, stderr) => {
    console.log(err, stdout, stderr)
})

fs.watchFile("./buildFile", {persisten:false, interval:3000}, (curr, prev) => {
    console.log("Modified")
    console.log(fs.readFileSync("./buildFile", {encoding:"utf-8"}))
    fs.unwatchFile("./buildFile")
})

