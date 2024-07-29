// <reference path="./node_modules/@types/node/fs.d.ts" />
import { readFileSync } from 'fs';

// part 1:
const file = readFileSync('./day1input.txt', 'utf-8');

function findCalibrationValue(line: string) {
  let first: number | null = null;
  let last: number | null = null;

  // find first
  for (let i = 0; i < line.length; i++) {
    const possibleDigit = Number(line[i]);
    if (!(isNaN(possibleDigit))) {
      first = possibleDigit;
      break;
    }
  }

  // find last
  for (let i = line.length; i >= 0; i--) {
    const possibleDigit = Number(line[i]);
    if (!(isNaN(possibleDigit))) {
      last = possibleDigit;
      break;
    }
  }

  return `${first}${last}`;
}

function sumValues(input: string) {
  const lines = input.split(/\r?\n/);
  let sum = 0;

  for (const line of lines) {
    console.log(line);
    sum += Number(findCalibrationValue(line));
    console.log("current sum:", sum);
  }

  return sum;
}

// sumValues(file);


// part 2:
const numberWords = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9,
};

function findCalibrationValueAdvanced(line: string) {
  let first: number | null = null;
  let last: number | null = null;

  // find first
  for (let i = 0; i < line.length; i++) {
    const possibleDigit = Number(line[i]);

    // we found a digit and can exit:
    if (!(isNaN(possibleDigit))) {
      first = possibleDigit;
      break;
    }

    // loop over number words to chech against substring:
    for (const numWord in numberWords) {
      const substrLen = numWord.length;
      const substr = line.slice(i, (i + substrLen));

      if (numWord === substr) {
        first = numberWords[numWord as keyof typeof numberWords];
        break;
      }
    }

    // we found first, exit loop:
    if (first !== null) break;
  }

  // find last
  for (let i = line.length; i >= 0; i--) {
    const possibleDigit = Number(line[i]);
    if (!(isNaN(possibleDigit))) {
      last = possibleDigit;
      break;
    }

    // loop over number words to chech against substring:
    for (const numWord in numberWords) {
      const substrLen = numWord.length;
      const substr = line.slice(i, (i + substrLen));

      if (numWord === substr) {
        last = numberWords[numWord as keyof typeof numberWords];
        break;
      }
    }

    // we found first, exit loop:
    if (last !== null) break;
  }

  return `${first}${last}`;
}


function sumValuesAdvanced(input: string) {
  const lines = input.split(/\r?\n/);
  let sum = 0;

  for (const line of lines) {
    console.log(line);
    sum += Number(findCalibrationValueAdvanced(line));
    console.log("current sum:", sum);
  }

  return sum;
}

sumValuesAdvanced(file);
