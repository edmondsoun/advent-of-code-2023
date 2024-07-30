// <reference path="./node_modules/@types/node/fs.d.ts" />
import { readFileSync } from 'fs';

const file = readFileSync('./day2input.txt', 'utf-8');

/** Takes text input, splits on newlines, returns array with each line as an
 * element. */
function splitLines(input: string) {
  const lines = input.split(/\r?\n/);
  return lines;
}

// PART 1

/**
 * Helper function to determine if a game is valid.
 *
 * Input: string like: "3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green"
 * Output: boolean
 */

function isGameValid(game: string) {
  const blockPulls = game.split(/, |; /);
  console.log('the block pull', blockPulls);

  for (const pull of blockPulls) {
    const quantityAndColor = pull.split(" ");
    const [strQuantity, color] = quantityAndColor;
    const quantity = Number(strQuantity);
    console.log("game color and quant", color, quantity);

    if (color === "red" && quantity > 12) return false;
    if (color === "green" && quantity > 13) return false;
    if (color === "blue" && quantity > 14) return false;
  }

  return true;
}


/**
 * Determine which games would have been possible if the bag had been loaded
 * with only 12 red cubes, 13 green cubes, and 14 blue cubes. What is the sum of
 * the IDs of those games?
 *
 * Input: normalized text like:
 * Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
 * Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
 * ...
 *
 * Output: sum of IDs of possible games
 */


function sumPossibleGames(input: string) {
  const games = splitLines(input);
  let sum: number = 0;

  for (const game of games) {
    const [gameName, blockPulls] = game.split(": ");
    const [g, id] = gameName.split(" ");

    const isValid = isGameValid(blockPulls);
    console.log("is this game valid?", id, isValid);

    if (isValid) sum += Number(id);
  }

  return sum;
}


// console.log(sumPossibleGames(file));



// PART 2:


/** For each game, find the minimum set of cubes that must have been present.
 * What is the sum of the power of these sets?
 *
 * The power of a set of cubes is equal to the numbers of red, green, and blue
 * cubes multiplied together. */

function sumMinCubeSetPowers(input: string) {
  const games = splitLines(input);
  let sum: number = 0;

  for (const game of games) {
    const [gameName, blockPulls] = game.split(": ");

    const { red, green, blue } = findMinCubes(blockPulls);
    const power = red * green * blue;

    sum += power;
  }

  return sum;
}


function findMinCubes(game: string) {
  const blockPulls = game.split(/, |; /);
  console.log('the block pull', blockPulls);

  const minCubes = {
    "red": 0,
    "green": 0,
    "blue": 0,
  };

  for (const pull of blockPulls) {
    const quantityAndColor = pull.split(" ");
    const [strQuantity, color] = quantityAndColor;
    const quantity = Number(strQuantity);
    console.log("game color and quant", color, quantity);

    if (color === "red" && quantity > minCubes[color]) minCubes[color] = quantity;
    if (color === "green" && quantity > minCubes[color]) minCubes[color] = quantity;
    if (color === "blue" && quantity > minCubes[color]) minCubes[color] = quantity;

  }
  console.log("minCube return:", minCubes)

  return minCubes;
}


console.log(sumMinCubeSetPowers(file));