# node-summarizer
node-summarizer is a Node.js module that summarizes text into a specified number of sentences. This module uses two
different extractive summarization techniques: frequency based and textrank based. It also provides sentiment analysis on the 
given text, reduction percentage, as well as other information about the text and generated summary. Read the [How it Works](#desc) 
section for more information about the two different approaches used.

# Table of Contents

1. [ Installation ](#install)

2. [Usage](#usage)
    
    * [Initialization](#init)
    
    * [Getting a summary](#getsum)
    
    * [Getting a reduction percentage](#getred)
    
    * [Sentiment Analysis](#sentiment)
    
    * [Usage Notes](#note)
    
3. [Method Details](#meth)
4. [ How it Works ](#desc)
5. [ Dependencies ](#depend)
6. [ License ](#license)

<a name="install"></a>
## 1. Install

To install using NPM
```
npm i node-summarizer
```
## 2. Usage 

<a name="init"></a>
### Initialization

To get started, initialize a SummaryManager object.

```
let SummarizerManager = require("node-summarizer").SummarizerManager;

let Summarizer = new SummarizerManager(text_to_summarize,number_of_sentences); 
```
*Params*
- text_to_summarize: is a String of the text you want summarized.

- number_of_sentences: is an Int of how many sentences you want in the summary.

<a name="getsum"></a>
### Gettting a summary

There are two different approaches taken for summarization. Read the [How it Works](#desc) for more information on each of them. 

To get a **frequency summary**:

```
let summary = Summarizer.getSummaryByFrequency().summary;
```
- The getSummaryByFrequency() method returns as object with summary as one of the properties. More information on it in the [Method Details](#meth) section.

To get a **TextRank summary**:

```
let summary = Summarizer.getSummaryByRank().then((summary_object)=>{
    return summary_object.summary
})
```
- The getSummaryByRank() method returns a Promise. More information on it in the [Method Details](#meth) section.

<a name="getred"></a>
### Getting a reduction percentage

To get the reduction percentage as a decimal:

```
//If you want the reduction percentage of a frequency summary.
let reduction_percentage = Summarizer.getFrequencyReductionAsDec().dec_reduction;

//If you want the reduction percentage of a TextRank summary. Returns a promise.
let reduction_percentage = Summarizer.getRankReductionAsDec().then((reduction_obj)=>{
    return reduction_obj.dec_reduction;
})
```

To get the reduction percentage as a string:

```
//If you want the reduction percentage of a frequency summary.
let reduction_percentage = Summarizer.getFrequencyReduction().reduction;

//If you want the reduction percentage of a TextRank summary. Returns a promise.
let reduction_percentage = Summarizer.getRankReduction().then((reduction_obj)=>{
    return reduction_obj.reduction;
})
```

<a name="Sentiment"></a>
### Sentiment Analysis

To get the sentiment value of the string to be summarized:

```
let sentiment = Summarizer.getSentiment();
```

-This will return a Float.

<a name="note"></a>
### Usage Notes

- The easisest way to use this is to initialize the SummaryManager object => Get a summary using one or both of the summarization methods => Get reduction percentage based on the summarization method used.

- The alternative way is to simply initialize the SummaryManager object => call one of the reduction methods which automatically creates a summary if one doesn't exist and returns both the reduction percentage and new summary as an object. This is fine if all you need is the reduction percentage and summary.

- If a sentence cannot be split into sentences or if there are not enough sentences, the summary will be an Error().

<a name="meth"></a>
## 3. Method Details

More details on the available methods of the SummarizerManager class.

### getSummaryByFrequency()

Once a SummarizerManager object has been initialized, calling this method will return an object with:

```
{
    summary: "",    //String of the summary
    sentence_list: [],  //List of all of the tokenized sentences in the given text
    weighted_map: Map,  //Map of all of the tokenized words with their frequencies.
    sorted_sentences: []   //A list of all of the sentences sorted by weights.
}
```

### getSummaryByRank()

This method returns a Promise. The result of the Promise is an object with:

```
{
    summary: "",    //String of the summary
    sentence_list: [],  //List of all of the tokenized sentences in the given text
    nouns_and_adjactive_map: Map   //Map of all of the sentences with the values being a list of nouns and adjactives in the                                        sentence
}
```

### getFrequencyReduction()

Once a SummarizerObject has been initialized calling this method will return an object with:

```
{
    reduction: "",  //A String of the percentage of reduction ex. "50.1%"
    summary: ""     //Current frequency summary
    
}
```
-Calling this method without first calling the getSummaryByFrequency() method will still work. It will automatically create
a frequency summary.

### getRankReduction()

This method returns a Promise. The result of the Promise is an object with:

```
{
    reduction: "",  //A String of the percentage of reduction ex. "50.1%"
    summary: ""     //Current frequency summary
    
}
```
-Calling this method without first calling the getSummaryByRank() method will still work. It will just automatically create
a rank summary.

### getFrequencyReductionAsDec()

This method works the same way as getFrequencyReduction and returns an object with:

```
{
    dec_reduction: Float,  //A float of the reduction ex. .50192
    summary: ""     //Current frequency summary
    
}
```

### getRankReductionAsDec()

This method works the same way as getRankReductionAsDec and returns a Promise. The result of the Promise is an object with:

```
{
    dec_reduction: "",  //A String of the percentage of reduction ex. .50192
    summary: ""     //Current frequency summary
    
}
```

### getSentiment()

This method returns a Float of the sentiment value.


<a name="desc"></a>
## 4. How it Works

How the text is summarized.

### Frequency based algorithm:

This type of summary works best for text that is not too complicated. The advantage of this approach is that it more efficient than the textrank implementation. It was heavily inspired by this [post](https://stackabuse.com/text-summarization-with-nltk-in-python/).

- Split the given text into sentences.

- Preprocess the sentences by removing all punctuation and making all letters lowercase.

- Make a list of all the words that occur in the text and find the frequency of the words.

- Take the calculated frequencies of the words and calculate the total weight of the original sentences.


### TextRank based algorithm:

While this approach costs more in terms of time complexity, it is better for getting the summary of things like newspaper articles and essays. Read more about it [here](https://web.eecs.umich.edu/~mihalcea/papers/mihalcea.emnlp04.pdf).

- Split the given text into sentences.

- Preprocess the sentences by removing all punctuation and making all letters lowercase.

- Make a map of all of the sentences with the key being the sentences themselves and the values being an array of the nouns and adjactives in the sentence.
ex. {"The Detroit Pistons are a good basketball team" => [detroit, pistons, good, basketball, team], "A basketball is round"=>[basketball, round]}

- Make a weighted graph with edges that connect sentences with matching nouns or adjectives. The weight of each edge is the number of matching nouns and adjactives. In the example above, there would be two nodes connected with an edge of 1 for "basketball"

- Choose a random starting point in the graph and "walk" through it many times using the weight of each edge as a probability of which next vertex to go to. For example, a node with two vertices with an edge of weight 4 and an edge of weight 3 would have a 4/7 chance to go to the first vertex and 3/7 chance to go to the other vertex. 

- A count is kept of how many times a node is walked on.

- Sort the sentences.

<a name="depend"></a>
## 5. Dependancies
  [natural](https://github.com/NaturalNode/natural)
    
   - Used for tokenizing sentences and sentiment analysis
    
  [wordpos](https://github.com/moos/wordpos)
  
   - Used to detect nouns and adjectives in a sentence in the TextRank algorithm.
  
<a name="license"></a>
## 6. Licence

This project is licensed under the terms of the ISC license.
