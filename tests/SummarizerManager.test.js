const SummarizerManager = require("../src/SummarizerManager");
let fs = require("fs");
let content = fs.readFileSync(__dirname + "/test.txt", 'utf8');
let content2 = fs.readFileSync(__dirname + "/test2.txt", 'utf8');

test('Gets the sentiment analysis', async () => {
	let Summarizer = new SummarizerManager(content2, 3);
	let summary_obj = await Summarizer.getSummaryByRank();
 	expect(typeof(Summarizer.getSentiment())).toBe("number");
});

test('Makes sure that there are no errors in the random walk',async ()=>{
	jest.setTimeout(30000);

	for(let i = 0; i<500; i++){
		let Summarizer = new SummarizerManager(content,5);
		let summary_obj = await Summarizer.getSummaryByRank();
		expect(typeof(summary_obj.summary)).toBe('string');

	}
})

test('Makes sure that there are no errors in frequency approach',()=>{
	jest.setTimeout(30000);

	for(let i = 0; i<500; i++){
		let Summarizer = new SummarizerManager(content,5);
		let summary_obj = Summarizer.getSummaryByFrequency();
		if (i==0){
			console.log(summary_obj.weighted_map)
		}
		expect(typeof(summary_obj.summary)).toBe('string');

	}
})

test('Makes sure that it handles edge cases',async ()=>{
	jest.setTimeout(30000);

	let Summarizer = new SummarizerManager("...",0);
	let summary_obj = Summarizer.getSummaryByFrequency();
	expect(typeof(summary_obj.summary)).toBe('object');

	for(let i = 0; i<15; i++){
		summary_obj = Summarizer.getSummaryByFrequency();
		expect(typeof(summary_obj.summary)).toBe('object');
	}

	let rank_summary = await Summarizer.getSummaryByRank();
	expect(typeof(rank_summary.summary)).toBe('object');
	
	for(let i = 0; i<15; i++){
		rank_summary = await Summarizer.getSummaryByRank();
		expect(typeof(rank_summary.summary)).toBe('object');
	}
	
})

// test('Tests the getSentiment() function',async ()=>{
// 	jest.setTimeout(30000);


// })

test('Tests the getFrequencyReduction() function',async ()=>{
	jest.setTimeout(30000);
	let Summarizer = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let reduction = Summarizer.getFrequencyReduction();
	expect(reduction.reduction).toBe("50.9%");

	let Summarizer2 = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let summary = Summarizer2.getSummaryByFrequency();
	let reduction2 = Summarizer.getFrequencyReduction();
	expect(reduction2.reduction).toBe("50.9%");

	let Summarizer3 = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let summary2 = await Summarizer2.getSummaryByRank();
	let reduction3 = Summarizer.getFrequencyReduction();
	expect(reduction3.reduction).toBe("50.9%");

})

test('Tests the getRankReduction() function',async ()=>{
	jest.setTimeout(30000);
	let Summarizer = new SummarizerManager("This is a single sentence. This is a single sentence. This is not", 1);
	let reduction = await Summarizer.getRankReduction();
	expect(typeof(reduction.reduction)).toBe('string');

	let Summarizer2 = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let summary = await Summarizer2.getSummaryByRank();
	let reduction2 = await Summarizer.getRankReduction();
	expect(typeof(reduction2.reduction)).toBe('string');

	let Summarizer3 = new SummarizerManager("This is a single sentence. This is a single sentence.", 1);
	let summary2 = Summarizer2.getSummaryByFrequency();
	Summarizer.getRankReduction().then((data)=>{
		let reduction3 = data;
		expect(typeof(reduction3.reduction)).toBe('string');
	})
	

})

test("Final test to test everything",()=>{

})
