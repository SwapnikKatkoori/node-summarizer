const SummarizerManager = require("../src/SummarizerManager");
let fs = require("fs");
let content = fs.readFileSync(__dirname + "/test.txt", 'utf8');
let content2 = fs.readFileSync(__dirname + "/test2.txt", 'utf8');

test('Gets the sentiment analysis', async () => {
	let Summarizer = new SummarizerManager(content2, 3);
	let summary_obj = await Summarizer.get_summary_by_rank();
	console.log(summary_obj);
 	expect(typeof(Summarizer.get_sentiment())).toBe("number");
});

test('Makes sure that there are no errors in the random walk',async ()=>{
	jest.setTimeout(30000);

	for(let i = 0; i<500; i++){
		let Summarizer = new SummarizerManager(content,5);
		let summary_obj = await Summarizer.get_summary_by_rank();
		expect(typeof(summary_obj.summary)).toBe('string');

	}
})

test('Makes sure that there are no errors in frequency approach',()=>{
	jest.setTimeout(30000);

	for(let i = 0; i<500; i++){
		let Summarizer = new SummarizerManager(content,5);
		let summary_obj = Summarizer.get_summary_by_frequency();
		expect(typeof(summary_obj.summary)).toBe('string');

	}
})

test('Makes sure that it handles edge cases',async ()=>{
	jest.setTimeout(30000);

	let Summarizer = new SummarizerManager(".",5);
	let summary_obj = Summarizer.get_summary_by_frequency();
	console.log(summary_obj);
	expect(typeof(summary_obj.summary)).toBe('string');

	for(let i = 0; i<15; i++){
		summary_obj = Summarizer.get_summary_by_frequency();
		expect(typeof(summary_obj.summary)).toBe('string');
	}

	let rank_summary = await Summarizer.get_summary_by_rank();
	console.log(rank_summary);
	expect(typeof(rank_summary.summary)).toBe('string');
	
	for(let i = 0; i<15; i++){
		rank_summary = await Summarizer.get_summary_by_rank();
		expect(typeof(rank_summary.summary)).toBe('string');
	}
	
})

// test('Tests the get_sentiment() function',async ()=>{
// 	jest.setTimeout(30000);


// })

test('Tests the get_frequency_reduction() function',async ()=>{
	jest.setTimeout(30000);
	let Summarizer = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let reduction = Summarizer.get_frequency_reduction();
	expect(reduction.reduction).toBe("50.9%");

	let Summarizer2 = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let summary = Summarizer2.get_summary_by_frequency();
	let reduction2 = Summarizer.get_frequency_reduction();
	expect(reduction2.reduction).toBe("50.9%");

	let Summarizer3 = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let summary2 = await Summarizer2.get_summary_by_rank();
	let reduction3 = Summarizer.get_frequency_reduction();
	expect(reduction3.reduction).toBe("50.9%");

})

test('Tests the get_rank_reduction() function',async ()=>{
	jest.setTimeout(30000);
	let Summarizer = new SummarizerManager("This is a single sentence. This is a single sentence. This is not", 1);
	let reduction = await Summarizer.get_rank_reduction();
	expect(typeof(reduction.reduction)).toBe('string');

	let Summarizer2 = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let summary = await Summarizer2.get_summary_by_rank();
	let reduction2 = await Summarizer.get_rank_reduction();
	expect(typeof(reduction2.reduction)).toBe('string');

	let Summarizer3 = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let summary2 = Summarizer2.get_summary_by_frequency();
	Summarizer.get_rank_reduction().then((data)=>{
		let reduction3 = data;
		expect(typeof(reduction3.reduction)).toBe('string');
	})
	

})

test("Final test to test everything",()=>{

})
