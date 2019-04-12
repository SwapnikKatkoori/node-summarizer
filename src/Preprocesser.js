const natural = require("natural");

class Preprocesser{
	constructor(string_to_process){
		this.string_to_process = string_to_process;
		this.tokenizer = new natural.SentenceTokenizer(); 
	}

	//Turns the paragraph into a list of sentences 
	paragraph_to_sentences(string_to_process){
		return this.tokenizer.tokenize(string_to_process);
	}

	//Cleans the sentences
	clean_sentences(list_to_clean){
		const regex = /[a-z ]+/;
		for (let i = 0; i<list_to_clean.length; i++){
			list_to_clean[i] = list_to_clean[i].toLowerCase();
			list_to_clean[i] = regex.exec(list_to_clean[i])[0];
		}
		return list_to_clean;
	}

	tokenize_sentences(list_of_sentences){
		let result_list = [];
		for (let i = 0; i<list_of_sentences.length; i++){
			result_list = result_list.concat(list_of_sentences[i].split(" "));
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

	process_string(){
		const self = this
		const list_to_clean = self.paragraph_to_sentences(self.string_to_process);
		const cleaned = self.clean_sentences(list_to_clean);
		const tokenized = self.tokenize_sentences(cleaned);
		const weighted_map = self.get_weights(tokenized));
		return tokenized;
	}
}


module.exports.Preprocesser = Preprocesser