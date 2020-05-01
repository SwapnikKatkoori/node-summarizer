const Preprocesser = require('./Preprocesser').Preprocesser;

class Summarizer{
	/**
	 * @constructor
	 * @param string_to_process: {string} - A big string to process
	 * @param number_of_sentences: {number} - The number of sentences in the string
	 */
	constructor(string_to_process, number_of_sentences){
		this.preprocesser = new Preprocesser();
		this.number_of_sentences = number_of_sentences;
		this.string_to_process = string_to_process;
		this.new_length = 0;
	}

	/**
	 * Sorts a list of sentences by weight
	 * @param sentence_weights_list: {Array<Array<number: weight, string: sentences>>}
	 * @returns {Array<Array<number: weight, string: sentences>>}
	 */
	sortSentences(sentence_weights_list){
		sentence_weights_list.sort((a,b)=>{
			return b[0]-a[0];
		})
		return sentence_weights_list;
	}

	//Converts the textRank map into a list
	/**
	 * Converts a text rank map into a list of Arrays
	 * @param text_rank_map {Map<string, number>}
	 * @returns {Array<Array<number, string>>} - Array of arrays that contain the sentence and the weight
	 */
	textRankMapToList(text_rank_map){
		let result_list = [];
		text_rank_map.forEach((value, key, map)=>{
			result_list.push([value,key]);
		})

		return result_list;
	}

	//Takes in a list of sorted sentences and a map of those sentences to the original sentences.
	/**
	 * TODO very confused by this function...
	 * @param sorted_sentences
	 * @param clean_sentences
	 * @returns {string}
	 */
	listToString(sorted_sentences, clean_sentences){
		const self = this;
		let result_string = ""; // What's being passed out
		let length_count = 0;
		let count = self.number_of_sentences;
		// Default to the length of the sorted sentences
		if(sorted_sentences.length < self.number_of_sentences){
			count = sorted_sentences.length;
		}
		for(var i=0; i<count; i++){
			length_count += sorted_sentences[i][1].split(" ").length;
			result_string+=clean_sentences[1].get(sorted_sentences[i][1]);
		}
		this.new_length = length_count;
		return result_string;
	}

	/**
	 * TODO also very confused by these types
	 * @returns {{summary: string, sentence_list: (Error|Array<string>), sorted_sentences: *, weighted_map: Map<string, number>}}
	 */
	summarizeByFrequency(){
		const self = this
		const list_to_clean = self.preprocesser.paragraphToSentences(self.string_to_process);
		const clean_sentences = self.preprocesser.cleanSentences(list_to_clean);
		const tokenized = self.preprocesser.tokenizeSentences(clean_sentences[0]);
		const weighted_map = self.preprocesser.getWeights(tokenized);
		const sentence_weights_list = self.preprocesser.sentenceWeights(clean_sentences[0], weighted_map);
		const sorted_sentences = self.sortSentences(sentence_weights_list);

		return {
			summary: self.listToString(sorted_sentences, clean_sentences),
			sentence_list: list_to_clean,
			weighted_map: weighted_map,
			sorted_sentences: sorted_sentences
		}
	}

	/**
	 * Summarise the sentence by rank
	 * TODO very confused by this one too, help pls
	 * @returns {Promise<{summary: string, nouns_and_adjactive_map: Map<string, Array<string>>, sentence_list: (Error|Array<string>)}>}
	 */
	async summarizeByRank(){
		const self = this;
		const list_to_clean = self.preprocesser.paragraphToSentences(self.string_to_process);
		const clean_sentences = self.preprocesser.cleanSentences(list_to_clean);
		try{
			const nouns_and_adjactive_map = await self.preprocesser.nounsAndAdjectives(clean_sentences[0]);
			let text_rank_graph = self.preprocesser.createTextRankGraph(nouns_and_adjactive_map);
			let text_rank_map = self.preprocesser.textRank(text_rank_graph);
			let text_rank_list = self.sortSentences(self.textRankMapToList(text_rank_map));
			//let list_to_pass_in = text_rank_list;
			return {
				summary: self.listToString(text_rank_list, clean_sentences),
				sentence_list: list_to_clean,
				nouns_and_adjactive_map: nouns_and_adjactive_map
			}
		}catch(err){
			console.log(err);
		}
	}
}

module.exports.Summarizer = Summarizer;
