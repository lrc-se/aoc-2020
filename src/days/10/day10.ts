import { OutputPublic } from "@/functions/output";

interface RatingCounts {
  [K: number]: number;
}

interface ReachableRatings {
  [K: number]: number[];
}

function getTestData(input: string[]): string[][] {
  return input.join("\n").split("\n\n").map(data => data.split("\n"));
}

function getRatings(input: string[], addOutletAndDevice = false): number[] {
  const ratings = input.map(rating => +rating);
  ratings.sort((a, b) => a - b);
  if (addOutletAndDevice) {
    ratings.unshift(0);
    ratings.push(ratings[ratings.length - 1] + 3);
  }
  return ratings;
}

function getDifferences(ratings: number[]): RatingCounts {
  const diffs: RatingCounts = {};
  for (let i = 1; i < ratings.length; ++i) {
    const diff = ratings[i] - ratings[i - 1];
    if (typeof diffs[diff] == "undefined") {
      diffs[diff] = 0;
    }
    ++diffs[diff];
  }
  return diffs;
}

function getReachableRatings(ratings: number[]): ReachableRatings {
  const reachable: ReachableRatings = {};
  for (let i = 0, len = ratings.length - 1; i < len; ++i) {
    for (let j = i + 1, k = i + 4; j < k; ++j) {
      if (ratings[j] - ratings[i] <= 3) {
        if (!reachable[ratings[i]]) {
          reachable[ratings[i]] = [];
        }
        reachable[ratings[i]].push(ratings[j]);
      } else {
        break;
      }
    }
  }
  return reachable;
}

function countArrangements(rating: number, reachableRatings: ReachableRatings, lookup: RatingCounts = {}): number {
  const reachable = reachableRatings[rating];
  if (reachable) {
    return reachable
      .map(reachableRating => {
        if (!lookup[reachableRating]) {
          lookup[reachableRating] = countArrangements(reachableRating, reachableRatings, lookup);
        }
        return lookup[reachableRating];
      })
      .reduce((prev, cur) => prev + cur);
  }
  return 1;
}

function runPuzzle1(input: string[], output: OutputPublic): RatingCounts {
  const ratings = getRatings(input, true);
  const diffs = getDifferences(ratings);
  output.print("Number of rating differences: ", true);
  output.print(
    Object.keys(diffs)
      .map(diff => `${diff == "1" ? "1 jolt" : `${diff} jolts`} = ${diffs[diff as unknown as number]}`)
      .join(", ")
  );
  return diffs;
}

function runPuzzle2(input: string[], output: OutputPublic) {
  const ratings = getRatings(input, true);
  const reachable = getReachableRatings(ratings);
  const count = countArrangements(ratings[0], reachable);
  output.print(`Number of arrangements: ${count}`);
}

export function createHandler(output: OutputPublic) {
  return {
    runTest1(input: string[]) {
      output.system("Running test 1...");
      const testData = getTestData(input);
      testData.forEach((data, i) => {
        output.print(`[Example #${i + 1}] `, true);
        runPuzzle1(data, output);
      });
      output.print();
    },
    runPuzzle1(input: string[]) {
      output.system("Running puzzle 1...");
      const diffs = runPuzzle1(input, output);
      output.print(`Result: ${diffs[1] * diffs[3]}`);
      output.print();
    },
    runTest2(input: string[]) {
      output.system("Running test 2...");
      const testData = getTestData(input);
      testData.forEach((data, i) => {
        output.print(`[Example #${i + 1}] `, true);
        runPuzzle2(data, output);
      });
      output.print();
    },
    runPuzzle2(input: string[]) {
      output.system("Running puzzle 2...");
      runPuzzle2(input, output);
      output.print();
    }
  };
}
