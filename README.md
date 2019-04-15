# text-summarizer

1. [ Description. ](#desc)
2. [ Installation ](#install)

<a name="desc"></a>
## 1. Description

Text-summarizer is a node.js module that summarizes a given text into a given number of sentences. This module uses two

different extractive summarization techniques: frequency based and textrank based. 

Frequency based algorithm:

- Split the given text into sentences.

- Preprocess the sentences by removing all punctuation and making all letters lowercase.

- Make a list of all the words that occur in the text and find the frequency of the words.

- Take the calculated frequencies of the words and calculate the total weight of the original sentences.

TextRank based algorithm:

-

<a name="install"></a>
## 2. Install

This package is available through NPM, and can be installed using:

```
npm install -s text-summarizer
```

