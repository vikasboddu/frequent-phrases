let assert = require('assert')
let frequent_phrases = require('./frequent_phrases.js');

describe('frequent_phrases.js', function() {
  describe('#ngramInRange(list_of_words, min_phrase, max_phrase)', function() {
    it('should return a unigram', function() {
      assert.deepEqual(frequent_phrases.ngramInRange(["1", "2", "3", "4", "5"], 1, 1),
        [['1'], ['2'], ['3'], ['4'], ['5']])
    })
    it('should return a bigram', function() {
      assert.deepEqual(frequent_phrases.ngramInRange(["1", "2", "3", "4", "5"], 2, 2),
        [['1', '2'], ['2', '3'], ['3', '4'], ['4', '5']])
    })
    it('should return a bigram, trigram, 4-gram, and 5-gram', function() {
      assert.deepEqual(frequent_phrases.ngramInRange(["1", "2", "3", "4", "5"], 2, 5),
        [[ '1', '2'], ['2', '3'], ['3', '4'], ['4', '5'],
          ['1', '2', '3'], ['2', '3', '4'], ['3', '4', '5'],
          ['1', '2', '3', '4' ], ['2', '3', '4', '5'],
          ['1', '2', '3', '4', '5']])
    })
    it('should return a bigram, trigram, 4-gram, and 5-gram (even though the max range is 7)', function() {
      assert.deepEqual(frequent_phrases.ngramInRange(["1", "2", "3", "4", "5"], 2, 7),
        [[ '1', '2'], ['2', '3'], ['3', '4'], ['4', '5'],
          ['1', '2', '3'], ['2', '3', '4'], ['3', '4', '5'],
          ['1', '2', '3', '4' ], ['2', '3', '4', '5'],
          ['1', '2', '3', '4', '5']])
    })
  })

  describe('#clean (list_of_words)', function() {
    it('should clean words in a list', function() {
      assert.deepEqual(frequent_phrases.clean(['VIKAS', 'Hi,', 'Ms.', 'her\'s']),
        ['vikas', 'hi', 'ms', 'hers'])
    })
  })

  describe('#cleanHelper (word)', function() {
    it('should convert to lower case', function() {
      assert.equal(frequent_phrases.cleanHelper('VIKAS'), 'vikas')
    })
    it('should clean trailing ,', function() {
      assert.equal(frequent_phrases.cleanHelper('Hi,'), 'hi')
    })
    it('should clean trailing .', function() {
      assert.equal(frequent_phrases.cleanHelper('Ms.'), 'ms')
    })
    it('should clean \'', function() {
      assert.equal(frequent_phrases.cleanHelper('her\'s'), 'hers')
    })
    it('should trim whitespace', function() {
      assert.equal(frequent_phrases.cleanHelper(' Bye '), 'bye')
    })
  })

  describe('#phraseFilter(phrases_to_occurrences, phrase_count, top_n)', function() {
    it('should filter a dictionary of phrases where there are no occurrences above the required count', function() {
      assert.deepEqual(frequent_phrases.phraseFilter({ 'the quick brown': 1,
          'quick brown fox': 1,
          'brown fox jumped': 1,
          'fox jumped over': 1,
          'jumped over the': 1,
          'over the lazy': 1,
          'the lazy dog': 1,
          'the quick brown fox': 1,
          'quick brown fox jumped': 1,
          'brown fox jumped over': 1,
          'fox jumped over the': 1,
          'jumped over the lazy': 1,
          'over the lazy dog': 1 }, 2, 10),
        [])
    })

    it('should filter a dictionary of phrases where there is more phrases than asked for', function() {
      assert.deepEqual(frequent_phrases.phraseFilter({ 'the quick brown': 1,
          'quick brown fox': 1,
          'brown fox jumped': 1,
          'fox jumped over': 1,
          'jumped over the': 1,
          'over the lazy': 1,
          'the lazy dog': 1,
          'the quick brown fox': 1,
          'quick brown fox jumped': 1,
          'brown fox jumped over': 1,
          'fox jumped over the': 1,
          'jumped over the lazy': 1,
          'over the lazy dog': 1 }, 1, 2),
        ['the quick brown fox',
          'quick brown fox jumped'])
    })
  })


  describe('#commonPhrases (document, min_phrase, max_phrase, phrase_count, top_n)', function() {
    let document = "The quick brown fox jumped over the lazy dog. " +
      "The lazy dog, peeved to be labeled lazy, jumped over a snoring turtle. " +
      "In retaliation the quick brown fox jumped over ten snoring turtles. " +
      "Then the quick brown fox refueled with some ice cream."

    it('takes in a document and returns the n most common phrases within a range and above a number of occurrences', function() {
      assert.deepEqual(frequent_phrases.commonPhrases(document, 3, 10, 2, 10), ['the lazy dog', 'the quick brown fox jumped over'])
    })
  })
})

