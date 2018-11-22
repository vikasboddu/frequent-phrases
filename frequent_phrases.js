/*
Given a string representing a document, write a function which returns the top 10 most frequent repeated phrases.
A phrase is a stretch of three to ten consecutive words and cannot span sentences.
Omit a phrase if it is a subset of another, longer phrase, even if the shorter phrase occurs more frequently
(for example, if “cool and collected” and “calm cool and collected” are repeated, do not include “cool and collected” in the returned set).
A phrase is repeated if it is used two or more times.

Example input
  The quick brown fox jumped over the lazy dog.
  The lazy dog, peeved to be labeled lazy, jumped over a snoring turtle.
  In retaliation the quick brown fox jumped over ten snoring turtles.
  Then the quick brown fox refueled with some ice cream.

Example output
  ['the lazy dog', 'the quick brown fox jumped over']*/

let flatten = require('array-flatten')
let ngram = require('n-gram')

exports.ngramInRange = ngramInRange
exports.clean = clean
exports.cleanHelper = cleanHelper
exports.phraseFilter = phraseFilter
exports.commonPhrases = commonPhrases

// String Integer Integer Integer Integer -> [List-of String]
// takes in a document and returns the n most common phrases
// max_phrase >= phrase length >= min_phrase
// phrase_occurrences >= phrase_count
function commonPhrases (document, min_phrase, max_phrase, phrase_count, top_n) {
  let list_of_sentences = document.split('. ')

  let phrases_to_occurrences = list_of_sentences
    .map(list_of_sentences => list_of_sentences.split(' '))
    .map(list_of_words => ngramInRange(clean(list_of_words), min_phrase, max_phrase))

  phrases_to_occurrences = flatten.depth(phrases_to_occurrences, 1)
    .reduce(function(acc, ngram){
      ngram = ngram.join(' ')
      if(typeof acc[ngram] !== "undefined") {
        acc[ngram]++
        return acc
      } else {
        acc[ngram] = 1
        return acc
      }
    }, {})

  return phraseFilter(phrases_to_occurrences, phrase_count, top_n)
}

// [List-of String] Integer Integer -> [List-of [List-of String]]
// takes a list of words and outputs a list of ngrams within the range provided
function ngramInRange (list_of_words, min_phrase, max_phrase) {
  let ngram_builder = []
  for (let i = min_phrase; i <= max_phrase; i++) {
    ngram_builder.push(ngram(i)(list_of_words))
  }
  return flatten.depth(ngram_builder, 1)
}

// [List-of String] -> [List-of String]
// cleans a list of words based on clean_helper
function clean (list_of_words) {
  return list_of_words.map(word => cleanHelper(word))
}

// String -> String
function cleanHelper(word) {
  return word.toLowerCase().replace(/[^a-zA-Z ]/g, "").trim()
}

// {String: Integer} Integer Integer -> [List-of String]
// takes in a dictonary of phrases and their occurrences
// filters it based on the minimum phrase count and sub-phrase duplication
// returns top_n values
function phraseFilter (phrases_to_occurrences, phrase_count, top_n) {
  let phrases_to_occurrences_min = {}

  Object.keys(phrases_to_occurrences).forEach(function(phrase){
    if (phrases_to_occurrences[phrase] >= phrase_count) {
      phrases_to_occurrences_min[phrase] = phrases_to_occurrences[phrase]
    }
  })

  let asc_phrases = Object.keys(phrases_to_occurrences_min).sort((a, b) => (a.length - b.length))

  for (let i = 0; i < asc_phrases.length; i++) {
    for (let j = i; j < asc_phrases.length; j++) {
      if (i !== j) {
        if (asc_phrases[j].includes(asc_phrases[i])) {
          delete phrases_to_occurrences_min[asc_phrases[i]]
        }
      }
    }
  }

  let top_phrases = Object.keys(phrases_to_occurrences_min).sort((a, b) =>
    (phrases_to_occurrences_min[b] - phrases_to_occurrences_min[a])) //handle equal occurrences?

  return top_phrases.slice(0, top_n)
}