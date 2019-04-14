const SummarizerManager = require("../src/SummarizerManager").SummarizerManager;
let fs = require("fs")
let content = fs.readFileSync("./test.txt", 'utf8')

test('Gets the sentiment analysis', () => {
	let Summarizer = new SummarizerManager("This is some sample text. This should summarize quickly.");
 	expect(typeof(Summarizer.get_sentiment())).toBe("number");
});

test('Makes sure that there are no errors in the random walk',async ()=>{
	jest.setTimeout(30000);

	for(let i = 0; i<500; i++){
		let Summarizer = new SummarizerManager(content,5);
		let summary = await Summarizer.get_summary_by_rank()
		expect(typeof(summary)).toBe('string');

	}
})