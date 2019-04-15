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
		if (this.frequency_summary == ""){
			this.frequency_summary = this.get_summary_by_frequency().summary;
		}
		let dec = 1-(this.frequency_summary.length/this.string.length);
		let string_dec = String(dec);
		return {
			reduction: string_dec.slice(2,4)+"."+string_dec.slice(4,5)+"%",
			summary: this.frequency_summary
		};
	}

	async get_rank_reduction(){
		if (this.rank_summary == ""){
			await this.get_summary_by_rank();	
		}
		let dec = 1-(this.rank_summary.length/this.string.length);
		let string_dec = String(dec);
		return {
			reduction: string_dec.slice(2,4)+"."+string_dec.slice(4,5)+"%",
			summary: this.rank_summary
		}

	}

	async get_rank_reduction_as_dec(){
		if (this.rank_summary == ""){
			await this.get_summary_by_rank();
		}
		let dec = 1-(this.rank_summary.length/this.string.length);
		return {
			dec_reduction: dec,
			summary: this.rank_summary
		}
	}

	get_frequency_reduction_as_dec(){
		if (this.frequency_summary == ""){
			this.frequency_summary = this.get_summary_by_frequency().summary;
		}
		let dec = 1-(this.frequency_summary.length/this.string.length);
		return {
			dec_reduction: dec,
			summary: this.frequency_summary
		}
	}

	get_summary_by_frequency(){
		try{
			let summarizer = new Summarizer(this.string, this.number_of_sentences);
			const summary_obj = summarizer.summarize_by_frequency();
			this.frequency_summary = summary_obj.summary;
			if(summary_obj.summary == ''){
				summary_obj.summary = "Not Enough similarities to be summarized, or the sentence is invalid.",
				summary_obj.sentence_list = "Not enough similarities to be summarized, or the sentence is invalid."
			}
			return summary_obj;
		}catch(err){
			return Error("An invalid sentence was entered");
		}

	}

	async get_summary_by_rank(){
		try{
			let summarizer = new Summarizer(this.string, this.number_of_sentences);
			const summary_obj = await summarizer.summarize_by_rank();
			if(typeof(summary_obj.summary) === 'undefined' || summary_obj.summary == ''){
				summary_obj.summary = "Not Enough similarities to be summarized, or the sentence is invalid.",
				summary_obj.sentence_list = "Not enough similarities to be summarized, or the sentence is invalid."
			}
			this.rank_summary = summary_obj.summary;
			return summary_obj;
		}catch(err){
			return Error("An invalid sentence was entered");
		}
	}
}

module.exports = SummarizerManager;