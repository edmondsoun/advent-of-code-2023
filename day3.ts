// <reference path="./node_modules/@types/node/fs.d.ts" />
import { readFileSync } from 'fs';

const file = readFileSync('./day3input.txt', 'utf-8');

/** Takes text input, splits on newlines, returns array with each line as an
 * element. */
function splitLines(input: string) {
  const lines = input.split(/\r?\n/);
  return lines;
}

/**
 * The engine schematic (your puzzle input) consists of a visual representation
 * of the engine. Any number adjacent to a symbol, even diagonally,
 * is a "part number" and should be included in your sum. (Periods (.) do not
 * count as a symbol.)
 *
 * Input: array of strings that represent the engine
 * Output: sum of valid part numbers in engine schematic
*/

function sumEnginePartNumbers(schematic: string) {
  const partsMatrix = splitLines(schematic);
  const partNums: number[] = [];

  // loop over rows
  for (let i = 0; i < partsMatrix.length; i++) {

    // loop within individual rows
    for (let j = 0; j < partsMatrix[i].length; j++) {

      const isNotNum = isNaN(Number(partsMatrix[i][j]));
      let fullNumStr = '';

      if (!isNotNum) {
        fullNumStr = findFullNum(partsMatrix, i, j);
      }

      const isValid = isValidPartNum(partsMatrix, fullNumStr, i, j);
      if (isValid) {
        const fullNum = Number(fullNumStr);
        partNums.push(fullNum);
        j += fullNumStr.length;
      }
    }
  }

  return partNums.reduce((a, b) => a + b);
}

// Helper function to extract substring of numerals. Takes matrix and starting
// position, returns string of consecurtive numerals:
function findFullNum(matrix: string[], i: number, j: number) {

  let fullNum: string[] = [];
  let isNotNum = false;

  while (!isNotNum) {
    // console.log(fullNum);
    fullNum.push(matrix[i][j]);
    j++;

    isNotNum = isNaN(Number(matrix[i][j]));
  }

  return fullNum.join('');
}

// Helper function to perform lookaround in matrix to identify valid part nums.
function isValidPartNum(matrix: string[], fullNumStr: string, i: number, j: number) {

  // All symbol chars:
  const symbols = new Set(['@', '#', '$', '%', '&', '*', '/', '+', '-', '=']);

  let foundSymbol = false;

  // ['abc123def'] / '123' / i = 0; j = 3
  for (let substrIdx = 0; substrIdx < fullNumStr.length; substrIdx++) {
    // Generate lookaroundCoords for current character, including offset for
    // position in substring:
    const offset = substrIdx;

    const lookaroundCoords = [
      [i, j - 1 + offset], // left
      [i, j + 1 + offset], // right
      [i - 1, j + offset], // top
      [i + 1, j + offset], // bottom
      [i - 1, j - 1 + offset], // top-left
      [i + 1, j - 1 + offset], // bottom-left
      [i - 1, j + 1 + offset], // top-right
      [i + 1, j + 1 + offset], // bottom-right
    ];

    for (const coord of lookaroundCoords) {
      const row = coord[0];
      const col = coord[1];

      console.log("row & col:", row, col)
      // guard against OOB lookup errors:
      if (matrix[row] !== undefined) {

        const possibleSymbol = matrix[row][col];
        if (symbols.has(possibleSymbol)) {
          foundSymbol = true;
          return foundSymbol;
        }
      }
    }
  }

  return foundSymbol;
}


console.log(sumEnginePartNumbers(file));