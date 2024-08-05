// <reference path="./node_modules/@types/node/fs.d.ts" />
import { readFileSync } from 'fs';

/** Takes text input, splits on newlines, returns array with each line as an
 * element. */
function splitLines(input: string) {
  const lines = input.split(/\r?\n/);
  return lines;
}

const file = readFileSync('./day4input.txt', 'utf-8');

// PROBLEM SUMMARY

/** The almanac (your puzzle input) lists all of the seeds that need to be
 * planted. It also lists what type of soil to use with each kind of seed, what
 * type of fertilizer to use with each kind of soil, what type of water to use
 * with each kind of fertilizer, and so on. Every type of seed, soil, fertilizer
 * and so on is identified with a number, but numbers are reused by each
 * category - that is, soil 123 and fertilizer 123 aren't necessarily related to
 * each other.
 *
 * Consider again the example seed-to-soil map:
 *
 * 50 98 2
 * 52 50 48

 * The first line has a destination range start of 50, a source range start of
 * 98, and a range length of 2. This line means that the source range starts at
 * 98 and contains two values: 98 and 99. The destination range is the same
 * length, but it starts at 50, so its two values are 50 and 51. With this
 * information, you know that seed number 98 corresponds to soil number 50 and
 * that seed number 99 corresponds to soil number 51.

 * The second line means that the source range starts at 50 and contains 48
 * values: 50, 51, ..., 96, 97. This corresponds to a destination range starting
 * at 52 and also containing 48 values: 52, 53, ..., 98, 99. So, seed number 53
 * corresponds to soil number 55.

 * Any source numbers that aren't mapped correspond to the same destination
 * number. So, seed number 10 corresponds to soil number 10.
 **/

// PLAN

// Helper function to convert destination range start to source range start via
// range length

//  * 50 98 2
//  * 52 50 48

// DESTINATION | SOURCE | RANGE

// PSEUDOCODE:

// Observation: start numbers will always increment straight up

/**  For initial algorithm:
- start from zero
- is current number a source range start?
  - if not:
      - maps with no offset to destination codes in sequence
  - if so:
      - map to destination codes starting at destination range start
        - map RANGE number of codes
  - return to
*/

/** NEW STRAT:
 * start with first source range start
 * map RANGE number of codes starting at destination range start
 * continue thru all source range starts
 *
 * condition: any code not represented by a key in the map will be a 1:1 source to destination
 */


function generateMappping(lines: string[]) {

  const mappings = new Map();

  for (const line of lines) {
    const [destinationStr, sourceStr, rangeStr] = line.split(" ");
    const destination = Number(destinationStr);
    const source = Number(sourceStr);
    const range = Number(rangeStr);

    for (let i = 0; i < range; i++) {
      mappings.set(source + i, destination + i);
    }
  }

  return mappings;
}

// console.log(generateMappping(["50 98 2","52 50 48"]))


// now that we have an algorithm to generate mappings, we want to work through a
// series of mappings

// is source number >= source start, < source start + range?
// if so, generate offset destination number
// if not generate destination number with no offset

// pipe into next set of mappings

/** Input: starting code (string) and mappings (array of strings) */

function convertFromSourceToDestination(start: number, mappings: string[]) {

  for (const mapping of mappings) {
    const [destinationStr, sourceStr, rangeStr] = mapping.split(" ");
    const destination = Number(destinationStr);
    const source = Number(sourceStr);
    const range = Number(rangeStr);

    if (start >= source && start < source + range) {
      return destination + (start-source);
    }
  }

  return start;
}

console.log(convertFromSourceToDestination(51, ["50 98 2", "52 50 48"]))

