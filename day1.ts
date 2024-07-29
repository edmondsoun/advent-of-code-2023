// <reference path="./node_modules/@types/node/fs.d.ts" />
import { readFileSync } from 'fs';

const file = readFileSync('./day1part1input.txt', 'utf-8');

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

  return `${first}${last}`
}

function sumValues(input: string) {
  const lines = input.split(/\r?\n/);
  let sum = 0;

  for (const line of lines) {
    console.log(line)
    sum += Number(findCalibrationValue(line));
    console.log("current sum:", sum)
  }

  return sum;
}


sumValues(file);