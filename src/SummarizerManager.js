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
		let Analyzer = require('natural').SentimentAnalyzer;
		let stemmer = require('natural').PorterStemmer;
		let analyzer = new Analyzer("English", stemmer, "afinn");
		return analyzer.getSentiment(self.string.split(" "));
		
	}

	get_summary_by_frequency(){
		try{
			let summarizer = new Summarizer(this.string, this.number_of_sentences);
			const summary = summarizer.summarize_by_frequency();
			this.current_summary = summary;
			return summary;
		}catch(err){
			return Error("An invalid sentence was entered");
		}

	}

	get_summary_by_rank(){
		try{
			let summarizer = new Summarizer(this.string, this.number_of_sentences);
			const summary = summarizer.summarize_by_rank();
			this.current_summary = summary;
			return summary;
		}catch(err){
			return Error("An invalid sentence was entered");
		}
	}
}

module.exports.SummarizerManager = SummarizerManager;