// <reference path="./node_modules/@types/node/fs.d.ts" />
import { readFileSync } from 'fs';

/** Takes text input, splits on newlines, returns array with each line as an
 * element. */
function splitLines(input: string) {
  const lines = input.split(/\r?\n/);
  return lines;
}

const file = readFileSync('./day4input.txt', 'utf-8');



/** As far as the Elf has been able to figure out, you have to figure out which
 * of the numbers you have appear in the list of winning numbers. The first
 * match makes the card worth one point and each match after the first doubles
 * the point value of that card.
 *
 * How many points are they worth in total?
 * */

// strategy:
// the cards are consistently formatted so can split to an absolute character
// for each line, split the winning numbers from the play numbers
// make a set of each
// for each item in the play set, check against winning set
// raise 2 to the power of matching nums (0 indexed)
// tally and return


function tallyWinningCards(cardSet: string) {
  const cards = splitLines(cardSet);
  const sumOfScores: number[] = [];

  for (const card of cards) {
    const score = tallyCardScore(card);
    sumOfScores.push(score);
  }

  console.log("currentscores?", sumOfScores)
  return sumOfScores.reduce((a,b) => a+b)
}

/** Helper function to tally a card's score.
 *  Takes a string that represents a card.
 *
 *  Splits into two number sets and compares to calculate score.
 *
 *  Returns a number representing the score.
 */
function tallyCardScore(card: string) {
  let matches = 0;

  const winningNumsStr = card.slice(10,39)
  const playerNumsStr = card.slice(42,117)

  const winningNumsSet = new Set(splitNums(winningNumsStr))
  const playerNumsSet = new Set(splitNums(playerNumsStr))

  for (const num of winningNumsSet) {
    if (playerNumsSet.has(num)) {
      matches++;
    }
  }

  return matches > 0 ? Math.pow(2, matches-1) : 0
}


/** Helper function to split num string at regular intervals. */
function splitNums(numStr: string) {
  const nums: string[] = []

  for (let i = 0; i < numStr.length; i++) {
    nums.push(numStr.slice(i,i+2));
    i+=2
  }

  return nums;
}

// const sampleCard = "Card   1:  9 32  7 82 10 36 31 12 85 95 |  7 69 23  9 32 22 47 10 95 14 24 71 57 12 31 59 36 68  2 82 38 80 85 21 92"
// const sampleWins = " 9 32  7 82 10 36 31 12 85 95"
// console.log(splitNums(sampleWins))
// console.log(tallyCardScore(sampleCard))

// console.log(tallyWinningCards(file))


// PART 2


/** Copies of scratchcards are scored like normal scratchcards and have the same
 * card number as the card they copied. So, if you win a copy of card 10 and it
 * has 5 matching numbers, it would then win a copy of the same cards that the
 * original card 10 won: cards 11, 12, 13, 14, and 15. This process repeats
 * until none of the copies cause you to win any more cards. (Cards will never
 * make you copy a card past the end of the table.)
 *
 * Including the original set of scratchcards, how many total scratchcards do you end up with?
 * */

//


// i misinterpreted this problem considerably! need to insert X number of cards
// of the next sequential numbers, instead of staggering the insertions
// this means i need to at least track the card number so i know where insertions occur
//

function countTotalScratchers(cardSet: string) {
  const cards = splitLines(cardSet);

  const cardStacks = new Map();

  // create a map that will hold the card number for quick manipulation.
  // these begin at 1:
  for (let i = 0; i < cards.length; i++) {
    cardStacks.set(i+1, [cards[i]])
  }

  // loop over the map
  for (let i = 1; i <= cardStacks.size; i++) {
    const cards = cardStacks.get(i); //
    console.log("the card:", cards)

    // loop within the array of cards
    for (let j = 0; j < cards.length; j++) {
      const score = tallyMatchingNums(cards[j]);
      // add cards where needed
      for (let k = 0; k < score; k++) {
        // console.log("what is k?", k)
        // console.log("what is score?", score)
        const stackToIncrement = cardStacks.get(i+k+1)
        stackToIncrement.push(stackToIncrement[0]);
      }
    }
  }

  let total = 0;

  for (const stack of cardStacks) {
    const [cardNum, cards] = stack;
    for (const card of cards) {
      total++;
    }
  }

  return total;
}


function tallyMatchingNums(card: string) {
  let matches = 0;

  const winningNumsStr = card.slice(10,39)
  const playerNumsStr = card.slice(42,117)

  // For sample output:
  // const winningNumsStr = card.slice(8,22)
  // const playerNumsStr = card.slice(25,48)

  const winningNumsSet = new Set(splitNums(winningNumsStr))
  const playerNumsSet = new Set(splitNums(playerNumsStr))
  // console.log("sets in tally:", winningNumsSet, playerNumsSet)

  for (const num of winningNumsSet) {
    if (playerNumsSet.has(num)) {
      matches++;
    }
  }

  return matches;
}

console.log(countTotalScratchers(file))

