// <reference path="./node_modules/@types/node/fs.d.ts" />
import { readFileSync } from 'fs';

const file = readFileSync('./day4input.txt', 'utf-8');

/** Takes text input, splits on newlines, returns array with each line as an
 * element. */
function splitLines(input: string) {
  const lines = input.split(/\r?\n/);
  return lines;
}

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

console.log(tallyWinningCards(file))