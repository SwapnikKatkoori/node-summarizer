const Summarizer = require('./Summarizer').Summarizer;
const natural = require("natural");

class SummarizerManager{
	constructor(string, number_of_sentences){
		this.string = string;
		this.number_of_sentences = number_of_sentences;
		this.rank_summary = "";
		this.frequency_summary = "";
	}

	getSentiment(){
		let self = this;
		let Analyzer = require('natural').SentimentAnalyzer;
		let stemmer = require('natural').PorterStemmer;
		let analyzer = new Analyzer("English", stemmer, "afinn");
		return analyzer.getSentiment(self.string.split(" "));
		
	}
	getFrequencyReduction(){
		if (this.frequency_summary == ""){
			this.frequency_summary = this.getSummaryByFrequency().summary;
		}
		let dec = 1-(this.frequency_summary.length/this.string.length);
		let string_dec = String(dec);
		return {
			reduction: string_dec.slice(2,4)+"."+string_dec.slice(4,5)+"%",
			summary: this.frequency_summary
		};
	}

	async getRankReduction(){
		if (this.rank_summary == ""){
			await this.getSummaryByRank();	
		}
		let dec = 1-(this.rank_summary.length/this.string.length);
		let string_dec = String(dec);
		return {
			reduction: string_dec.slice(2,4)+"."+string_dec.slice(4,5)+"%",
			summary: this.rank_summary
		}

	}

	async getRankReductionAsDec(){
		if (this.rank_summary == ""){
			await this.getSummaryByRank();
		}
		let dec = 1-(this.rank_summary.length/this.string.length);
		return {
			dec_reduction: dec,
			summary: this.rank_summary
		}
	}

	getFrequencyReductionAsDec(){
		if (this.frequency_summary == ""){
			this.frequency_summary = this.getSummaryByFrequency().summary;
		}
		let dec = 1-(this.frequency_summary.length/this.string.length);
		return {
			dec_reduction: dec,
			summary: this.frequency_summary
		}
	}

	getSummaryByFrequency(){
		try{
			let summarizer = new Summarizer(this.string, this.number_of_sentences);
			const summary_obj = summarizer.summarizeByFrequency();
			this.frequency_summary = summary_obj.summary;
			if(summary_obj.summary == ''){
				summary_obj.summary = Error("Not Enough similarities to be summarized, or the sentence is invalid."),
				summary_obj.sentence_list = Error("Not enough similarities to be summarized, or the sentence is invalid.")
			}
			return summary_obj;
		}catch(err){
			return Error("An invalid sentence was entered");
		}

	}

	async getSummaryByRank(){
		try{
			let summarizer = new Summarizer(this.string, this.number_of_sentences);
			const summary_obj = await summarizer.summarizeByRank();
			if(typeof(summary_obj.summary) === 'undefined' || summary_obj.summary == ''){
				summary_obj.summary = Error("Not Enough similarities to be summarized, or the sentence is invalid."),
				summary_obj.sentence_list = Error("Not enough similarities to be summarized, or the sentence is invalid.")
			}
			this.rank_summary = summary_obj.summary;
			return summary_obj;
		}catch(err){
			return Error("An invalid sentence was entered");
		}
	}
}

module.exports = SummarizerManager;