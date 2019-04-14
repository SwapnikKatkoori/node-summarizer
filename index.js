let SummarizerManager = require("./src/SummarizerManager").SummarizerManager;
let fs = require("fs")
let content = fs.readFileSync("./test.txt", 'utf8')
let Summarizer = new SummarizerManager(content,5);

module.exports.SummarizerManager = require("./src/SummarizerManager");