const SummarizerManager = require("../src/SummarizerManager").SummarizerManager;
let fs = require("fs");
let content = fs.readFileSync(__dirname + "/test.txt", 'utf8');

test('Gets the sentiment analysis', () => {
	let Summarizer = new SummarizerManager("This is some sample text. This should summarize quickly.");
 	expect(typeof(Summarizer.get_sentiment())).toBe("number");
});

test('Makes sure that there are no errors in the random walk',async ()=>{
	jest.setTimeout(30000);

	for(let i = 0; i<500; i++){
		let Summarizer = new SummarizerManager(content,5);
		let summary = await Summarizer.get_summary_by_rank();
		expect(typeof(summary)).toBe('string');

	}
})

test('Makes sure that there are no errors in frequency approach',()=>{
	jest.setTimeout(30000);

	for(let i = 0; i<500; i++){
		let Summarizer = new SummarizerManager(content,5);
		let summary = Summarizer.get_summary_by_frequency();
		expect(typeof(summary)).toBe('string');

	}
})

test('Makes sure that it handles edge cases',async ()=>{
	jest.setTimeout(30000);

	let Summarizer = new SummarizerManager("A simple sentence.",5);
	let summary = Summarizer.get_summary_by_frequency();
	expect(typeof(summary)).toBe('string');

	for(let i = 0; i<15; i++){
		Summarizer.get_summary_by_frequency();
		expect(typeof(summary)).toBe('string');
	}

	let rank_summary = await Summarizer.get_summary_by_rank();
	console.log(rank_summary);
	expect(typeof(rank_summary)).toBe('string');
	
	for(let i = 0; i<15; i++){
		rank_summary = await Summarizer.get_summary_by_rank();
		expect(typeof(rank_summary)).toBe('string');
	}
	
})