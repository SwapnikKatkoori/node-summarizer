const Preprocesser = require('./src/Preprocesser').Preprocesser;

class Summarizer{
	constructor(){
		this.preprocesser = new Preprocesser("This is a test. I hope this works.")
		console.log(this.preprocesser.process_string())
	}
}


const summarizer = new Summarizer()