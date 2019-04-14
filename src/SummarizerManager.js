const Summarizer = require('./Summarizer').Summarizer;
const natural = require("natural");

class SummarizerManager{
	constructor(string, number_of_sentences){
		this.string = string;
		this.number_of_sentences = number_of_sentences;
		this.rank_summary = "";
		this.frequency_summary = "";
	}

	get_sentiment(){
		let self = this;
		let Analyzer = require('natural').SentimentAnalyzer;
		let stemmer = require('natural').PorterStemmer;
		let analyzer = new Analyzer("English", stemmer, "afinn");
		return analyzer.getSentiment(self.string.split(" "));
		
	}
	get_frequency_reduction(){
		if (rank_summary == ""){
			this.get_summary_by_frequency();
		}
		let dec = 1-(this.frequency_summary.length/this.string.length);
		let string_dec = String(dec);
		return string_dec.slice(2,4)+"."+string_dec.slice(4,5)+"%";
	}

	get_rank_reduction(){
		if (rank_summary == ""){
			this.get_summary_by_rank();
		}
		let dec = 1-(this.rank_summary.length/this.string.length);
		let string_dec = String(dec);
		return string_dec.slice(2,4)+"."+string_dec.slice(4,5)+"%";
	}

	get_rank_reduction_as_dec(){
		if (rank_summary == ""){
			this.get_summary_by_rank();
		}
		let dec = 1-(this.rank_summary.length/this.string.length);
		return dec;
	}

	get_frequency_reduction_as_dec(){
		if (rank_summary == ""){
			this.get_summary_by_frequency();
		}
		let dec = 1-(this.frequency_summary.length/this.string.length);
		return dec;
	}

	get_summary_by_frequency(){
		try{
			let summarizer = new Summarizer(this.string, this.number_of_sentences);
			const summary = summarizer.summarize_by_frequency();
			this.frequency_summary = summary;
			return summary;
		}catch(err){
			return Error("An invalid sentence was entered");
		}

	}

	get_summary_by_rank(){
		try{
			let summarizer = new Summarizer(this.string, this.number_of_sentences);
			const summary = summarizer.summarize_by_rank();
			this.rank_summary = summary;
			return summary;
		}catch(err){
			return Error("An invalid sentence was entered");
		}
	}
}

module.exports = SummarizerManager;