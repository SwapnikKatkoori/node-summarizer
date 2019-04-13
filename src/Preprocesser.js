const natural = require("natural");
const WordPos = require("wordpos");

class Preprocesser{
	constructor(){
		this.tokenizer = new natural.SentenceTokenizer(); 
	}

	//Turns the paragraph into a list of sentences 
	paragraph_to_sentences(string_to_process){
		return this.tokenizer.tokenize(string_to_process);
	}

	//Cleans the sentences
	clean_sentences(list_to_clean){
		let sentence_map = new Map();
		const regex = /[&\/\\#,+()$~%.'":*?<>{}]/g;
		for (let i = 0; i<list_to_clean.length; i++){
			let original_sentence = list_to_clean[i];
			list_to_clean[i] = list_to_clean[i].toLowerCase();
			list_to_clean[i] = list_to_clean[i].replace(regex, "");
			sentence_map.set(list_to_clean[i], original_sentence);
		}
		return [list_to_clean,sentence_map];
	}

	tokenize_sentences(list_of_sentences){
		let new_array = new Array();
		new_array = list_of_sentences
		let result_list = [];
		for (let i = 0; i<new_array.length; i++){
			result_list = result_list.concat(new_array[i].split(" "));
		}
		return result_list;
	}

	get_frequency_and_max(list_of_words){
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
	
	//Converts a frequency map into a map with weights
	get_weights(list_of_words){
		const frequencies_and_max = this.get_frequency_and_max(list_of_words);
		const frequencies_map = frequencies_and_max[0];
		const max = frequencies_and_max[1];
		frequencies_map.forEach((value,key,map)=>{
			map.set(key, value/max);
		});
		return frequencies_map;
	}

	sentence_weights(clean_sentences, weighted_map){
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
	async nouns_and_adjectives(clean_sentences){
		let nouns_and_adjectives_map = new Map();
		let wordpos = new WordPos();
		for (let i = 0; i<clean_sentences.length; i++){
			let adjectives = await wordpos.getAdjectives(clean_sentences[i]);
			let nouns = await wordpos.getNouns(clean_sentences[i]);
			nouns_and_adjectives_map.set(nouns.concat(adjectives), clean_sentences[i]);
		}

		return nouns_and_adjectives_map;
	}

}


module.exports.Preprocesser = Preprocesser