/**
 * @file Handles all the preprocessing for sentence input
 */
const natural = require("natural");
const WordPos = require("wordpos");
const WeightedGraph = require('./WeightedGraph').WeightedGraph;

class Preprocesser{
	constructor(){
		this.tokenizer = new natural.SentenceTokenizer();
	}

	/**
	 * Convert paragraph into a list of sentences
	 * @param string_to_process: {string} - paragraph input
	 * @returns {Error|Array<string>} A list of strings in the sentence
	 */
	paragraphToSentences(string_to_process){
		try{
			let result = this.tokenizer.tokenize(string_to_process);
			return result;
		}catch(err){
			return Error("Cannot toeknize the given string.");
		}
	}

	/**
	 * Cleans a list of sentences by removing all punctuaation and making everything lowercase
	 * @param list_to_clean: {Array<string>}
	 * @returns {Array<Array<string>, Map<string, string>>} An array containing a cleaned list of words and a map of strings
	 */
	cleanSentences(list_to_clean){
		let sentence_map = new Map();
		const regex = /[&\/\\#,+()$~%.'":*?<>{}]/g;
		for (let i = 0; i<list_to_clean.length; i++){
			let original_sentence = list_to_clean[i];
			list_to_clean[i] = list_to_clean[i].toLowerCase(); // Converts everything to lowercase
			list_to_clean[i] = list_to_clean[i].replace(regex, ""); // Removes punctuation
			sentence_map.set(list_to_clean[i], original_sentence); // Sets the map to
		}
		return [list_to_clean,sentence_map];
	}

	//Takes in a list of sentences and returns a list of all of the words in the sentences.
	/**
	 * Takes a list of sentences and returns a list of words
	 * @param list_of_sentences: {Array<string>}
	 * @returns List of words in the sentence
	 */
	tokenizeSentences(list_of_sentences){
		let new_array = new Array();
		new_array = list_of_sentences
		let result_list = [];
		for (let i = 0; i<new_array.length; i++){
			result_list = result_list.concat(new_array[i].split(" "));
		}
		return result_list;
	}

	//Takes in a list of words and calculates the frequencies of the words.
	//Returns a list. The first item is a map of word->frequency. The second is the max frequency.
	/**
	 * Calculates the frequency of individual words in a list of words
	 * @param list_of_words: {Array<string>}
	 * @returns {(Map<string, number> | number)[]} First item is a map of word to frequency, second is the max frequency calculated
	 */
	getFrequencyAndMax(list_of_words){
		let frequency_map = new Map();
		let max = 0
		for (let i = 0; i<list_of_words.length; i++){
			const word = list_of_words[i];
			if (frequency_map.has(word)){
				const new_val = frequency_map.get(word)+1;
				frequency_map.set(word, new_val);
				if (new_val>max){
					max = new_val;
				}
			}else{
				frequency_map.set(word, 1);
			}
		}
		return [frequency_map, max];
	}

	/**
	 * Converts a frequency map into a map with weights
	 * Weight is the frequency of a single word divided by the max frequency
	 * @param list_of_words: {Array<string>}
	 * @returns {Map<string, number>} - A map of words to wordweight
	 */
	getWeights(list_of_words){
		const frequencies_and_max = this.getFrequencyAndMax(list_of_words);
		const frequencies_map = frequencies_and_max[0];
		const max = frequencies_and_max[1];
		frequencies_map.forEach((value,key,map)=>{
			map.set(key, value/max);
		});
		return frequencies_map;
	}

	/**
	 * Calculates the weight of each sentence by combining the weight of each word
	 * @param clean_sentences:  {Array<string>} Array of unmodified sentences
	 * @param weighted_map: {Map<string, number>} A map of words to word weight
	 * @returns sentence_weight_list: {Array<Array<string>>} - Array of Arrays
	 * - Inner array is [Average Weight of sentence: number, sentence: string]
	 *   - Average weight of sentence is the weight of the sentence in sum divided by the number of words
	 * - Outer array contains inner arrays for each sentence
	 */
	sentenceWeights(clean_sentences, weighted_map){
		let weight_of_sentence = 0;
		let sentence_weight_list = [];
		let sentence = "";
		for (let i = 0; i<clean_sentences.length; i++){
			sentence = clean_sentences[i];
			let word_list = sentence.split(" ");
			weight_of_sentence = 0;
			for (let j = 0; j<word_list.length; j++){
				weight_of_sentence += weighted_map.get(word_list[j]);
			}
			sentence_weight_list.push([weight_of_sentence/word_list.length, sentence]);
		}
		return sentence_weight_list;
	}

	//Takes a list of sentences and returns a map of the each sentence to its nouns and adjectives
	/**
	 * Takes a list of sentences and returns a map of each sentence to its nouns and adjectives
	 * @param clean_sentences Array of unmodified sentences
	 * @returns {Promise<Map<string, Array<string>>>}  A map of the sentence to an array of nouns and adjectives in the sentence
	 */
	async nounsAndAdjectives(clean_sentences){
		let nouns_and_adjectives_map = new Map();
		let wordpos = new WordPos();
		try{
			// Iterate through each sentence
			for (let i = 0; i<clean_sentences.length; i++){
				// Get an array of adjectives in the sentence
				let adjectives = await wordpos.getAdjectives(clean_sentences[i]);
				// Get an array of nouns in the sentence+
				let nouns = await wordpos.getNouns(clean_sentences[i]);
				// Set a map of the clean sentence (string) to an array of nouns and adjetives
				nouns_and_adjectives_map.set(clean_sentences[i],nouns.concat(adjectives));
			}
			return await nouns_and_adjectives_map;
		}catch(err){
			console.log(err)
			return
		}
	}

	/**
	 * Takes in two lists of words and gets the weight of the edge connected the vertices
	 * @param list1
	 * @param list2
	 * @returns {number}
	 */
	getEdgeWeights(list1, list2){
		let weight = 0;
		let intial = list1
		let other = list2
		if (list2.length >= list1.length){
			intial = list2
			other = list1
		}
		for(let i=0; i<intial.length; i++){
			if(other.includes(intial[i])){
				weight+=1;
			}
		}

		return weight
	}

	/**
	 * Creates a graph for the textrank algorithm
	 * TODO Update this jsdoc
	 * @param nouns_and_adjactive_map: {Promise<Map<string, Array<string>>>}
	 * @returns {WeightedGraph}
	 */
	createTextRankGraph(nouns_and_adjactive_map){
		let graph = new WeightedGraph();
		let key_list = [];
		let weight = 0
		nouns_and_adjactive_map.forEach((value,key,map)=>{
			key_list.push(key);
		})
		for(let i=0; i<key_list.length; i++){
			for(let j=i+1; j<key_list.length; j++){
				weight = this.getEdgeWeights(nouns_and_adjactive_map.get(key_list[i]), nouns_and_adjactive_map.get(key_list[j]));
				if(weight>0){
					graph.addEdge(key_list[i], key_list[j], weight);
				}
			}

		}
		return graph;
	}

	/**
	 * Text Rank algorithm
	 * TODO Update this JSdoc
	 * @param graph {WeightedGraph}
	 * @returns {Map<any, any>}
	 */
	textRank(graph){
		let key_list = graph.getAllVertices();
		let text_rank_map = new Map();

		//random key to start with
		if (key_list.length == 0){
			return text_rank_map;
		}
		let key = key_list[Math.floor(Math.random()*key_list.length)];
		let vertex = graph.getVertex(key);
		let probability_list = [];
		//random walk
		for (let i = 0; i < 10000; i++) {
			let full_weight = 0

			vertex.adjacent.forEach((value, key, map)=>{
				full_weight+=value;
			})

			vertex.adjacent.forEach((value, key, map)=>{
				for(let x = 0; x<value; x++){
					probability_list.push(key);
				}
			})


			let sentence = probability_list[Math.floor(Math.random()*probability_list.length)];
			if(text_rank_map.has(sentence)){
				text_rank_map.set(sentence, text_rank_map.get(sentence)+1)
			}else{
				text_rank_map.set(sentence, 1);
			}
			let last_vertex = vertex;
			vertex = graph.getVertex(sentence);
			probability_list = [];
		}
		return text_rank_map;

	}


}


module.exports.Preprocesser = Preprocesser
