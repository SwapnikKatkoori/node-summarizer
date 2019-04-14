const SummarizerManager = require("../src/SummarizerManager");
let fs = require("fs");
let content = fs.readFileSync(__dirname + "/test.txt", 'utf8');
let content2 = fs.readFileSync(__dirname + "/test2.txt", 'utf8');

test('Gets the sentiment analysis', async () => {
	let Summarizer = new SummarizerManager(content2, 3);
	let summary = await Summarizer.get_summary_by_rank();
	console.log(summary);
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

// test('Tests the get_sentiment() function',async ()=>{
// 	jest.setTimeout(30000);


// })

// test('Tests the get_frequency_reduction() function',()=>{
// 	jest.setTimeout(30000);


// })

// test('Tests the get_rank_reduction() function',async ()=>{
// 	jest.setTimeout(30000);


// })

