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
// position, returns string of consecutive numerals:
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


// console.log(sumEnginePartNumbers(file));


// part 2:

/**
 * The missing part wasn't the only issue - one of the gears in the engine is
 * wrong. A gear is any * symbol that is adjacent to exactly two part numbers.
 * Its gear ratio is the result of multiplying those two numbers together. This
 * time, you need to find the gear ratio of every gear and add them all up so
 * that the engineer can figure out which gear needs to be replaced.
 *
 */


// Plan:
// Traverse matrix
// When a star is located:
// lookaround to find two "anchors":
// if two anchors are on same row, they must be separated by a single non-numeral
// for each anchor:
// traverse backward from numeral to find start of part number
// traverse forward and write complete number

function sumGearRatios(schematic: string) {
  const partsMatrix = splitLines(schematic);
  const gear = "*";
  const gearRatios: number[] = [];

  // loop over rows
  for (let row = 0; row < partsMatrix.length; row++) {
    // loop within individual rows
    for (let col = 0; col < partsMatrix[row].length; col++) {
      const currentChar = partsMatrix[row][col];

      if (currentChar === gear) {
        const [firstAnchorCoords, secondAnchorCoords] = locateAnchors(partsMatrix, row, col);
        // check if there are valid anchors, if not, skip this element:
        if (firstAnchorCoords.length && secondAnchorCoords.length) {

          const firstPartNum = Number(findFullNumFromAnchor(partsMatrix, firstAnchorCoords));
          const secondPartNum = Number(findFullNumFromAnchor(partsMatrix, secondAnchorCoords));

          console.log('part nums:', firstPartNum, secondPartNum);
          gearRatios.push(firstPartNum * secondPartNum);
        }
      }
    }
  }
  return gearRatios.reduce((a, b) => a + b);
}


// Locate points where gears touch adjacent engine part numbers:
function locateAnchors(matrix: string[], row: number, col: number) {

  const firstAnchor: number[] = [];
  const secondAnchor: number[] = [];

  const lookaroundCoords = [
    [row, col - 1], // left
    [row, col + 1], // right
    [row - 1, col], // top
    [row + 1, col], // bottom
    [row - 1, col - 1], // top-left
    [row + 1, col - 1], // bottom-left
    [row - 1, col + 1], // top-right
    [row + 1, col + 1], // bottom-right
  ];

  for (const coord of lookaroundCoords) {
    const aRow: number = coord[0];
    const aCol: number = coord[1];
    const isNotNum = isNaN(Number(matrix[aRow][aCol]));

    if (!isNotNum && firstAnchor.length === 0) {
      firstAnchor.push(aRow, aCol);
    }

    if (!isNotNum && firstAnchor.length) {
      const firstAnchorRow = firstAnchor[0];
      const firstAnchorCol = firstAnchor[1];
      // check to make sure second anchor is not another numeral in same part
      // num sequence:
      if (!(aRow === firstAnchorRow && Math.abs(aCol - firstAnchorCol) <= 1)) {
        secondAnchor.push(aRow, aCol);
      }
    }

  }

  return [firstAnchor, secondAnchor];
}

function findFullNumFromAnchor(partsMatrix: string[], anchorPoint: number[]) {
  console.log("in findFullNumFromAnchor");
  const [row, col] = anchorPoint;
  const fullNumChars: string[] = [];
  let colStart: number | null = null;

  // traverse backward to find start of number:
  for (let i = col; !isNaN(Number(partsMatrix[row][i])); i--) {
    console.log('in backward loop');
    colStart = i;
  }

  // ts guard:
  if (colStart === null) return;

  // traverse forward to write number:
  for (let i = colStart; !isNaN(Number(partsMatrix[row][i])); i++) {
    fullNumChars.push(partsMatrix[row][i]);
  }

  console.log('fullNumChars?', fullNumChars);
  return fullNumChars.join('');
}

const testMatrix = [
  '467..114..',
  '...*......',
  '..35..633.',
  '......#...',
  '617*......',
  '.....+.58.',
  '..592.....',
  '......755.',
  '...$.*....',
  '.664.598..',
];

// console.log(locateAnchors(testMatrix, 4, 3));
// console.log(findFullNumFromAnchor(testMatrix, [9, 5]));
console.log(sumGearRatios(file));

