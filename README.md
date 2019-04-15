# text-summarizer
Text-summarizer is a node.js module that summarizes text into a specified number of sentences. This module uses two

different extractive summarization techniques: frequency based and textrank based. It also provides sentiment anylisis on the 

given text, reduction percentage, as well as other information about the text. Read the How it Works section for more 

infromation about the two different approaches used.

# Table of Contents

1. [ Installation ](#install)

2. [Usage](#usage)
    
    * [Initialization](#init)
    
    * [Getting a summary](#getsum)
  
3. [ How it Works ](#desc)
4. [ Dependencies ](#depend)

<a name="install"></a>
## 1. Install

This package is available through NPM, and can be installed using:

```
npm install -s text-summarizer
```
<a name="usage"></a>
## 2. Usage

<a name="init"></a>
### Initialization

To get started, initilize a SummaryManager object.

```
let SummarizerManager = require("text-summarizer").SummarizerManager;

let summarizer = new SummarizerManager(text_to_summarize,number_of_sentences); 
```
- text_to_summarize: is a String of the text you want summarized.

- number_of_sentenced: is an Int of how many sentences you want in the summary.

<a name="getsum"></a>
### Gettting a summary

<a name="desc"></a>
## 3. How it Works

Frequency based algorithm:

This type of summary works best for text that is not too complicated. The advantage of this approach is that it more efficient 

than the textrank implementation. It was heavily inspired by this post https://stackabuse.com/text-summarization-with-nltk-in-python/

- Split the given text into sentences.

- Preprocess the sentences by removing all punctuation and making all letters lowercase.

- Make a list of all the words that occur in the text and find the frequency of the words.

- Take the calculated frequencies of the words and calculate the total weight of the original sentences.


TextRank based algorithm:

-

<a name="depend"></a>
## 4. Dependancies
  [natural](https://github.com/NaturalNode/natural)
    
   -Used for tokenizing sentences and sentiment analysis
    
  [wordpos](https://github.com/moos/wordpos)
  
   -Used to detect nouns and adjectives in a sentence in the TextRank algorithm.
  
