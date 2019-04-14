const Summarizer = require('./Summarizer').Summarizer;
const natural = require("natural");

class SummarizerManager{
	constructor(string, number_of_sentences){
		this.string = string;
		this.number_of_sentences = number_of_sentences;
		this.current_summary = ""
	}

	get_sentiment(){
		let self = this;
		if (self.current_summary != ""){
			let Analyzer = require('natural').SentimentAnalyzer;
			let stemmer = require('natural').PorterStemmer;
			let analyzer = new Analyzer("English", stemmer, "afinn");
			return analyzer.getSentiment(this.string.split(" "));
		}else{
			return Error("Error in get sentiment");
		}
	}

	get_summary_by_frequency(){
		let self = this;
		let summarizer = new Summarizer(self.string, self.number_of_sentences);
		const summary = summarizer.summarize_by_frequency();
		self.current_summary = summary;
		return summary;
	}

	get_summary_by_rank(){
		let self = this;
		let summarizer = new Summarizer(self.string, self.number_of_sentences);
		const summary = summarizer.summarize_by_rank();
		self.current_summary = summary;
		return summary;
	}
}

module.exports.SummarizerManager = SummarizerManager;