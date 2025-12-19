import { getNewStrengthAndDifficultyWithDefaults } from "./memory";

const firstRun = getNewStrengthAndDifficultyWithDefaults(
  1,
  1000,
  10,
  1,
  1 * 24 * 69 * 60 * 1000,
  1,
);

console.log("First run:", firstRun);

const secondRun = getNewStrengthAndDifficultyWithDefaults(
  0.5,
  3000,
  10,
  firstRun.newStrength,
  2 * 24 * 69 * 60 * 1000,
  firstRun.newDifficulty,
);

console.log("Second run:", secondRun);

const thirdRun = getNewStrengthAndDifficultyWithDefaults(
  0,
  5000,
  10,
  secondRun.newStrength,
  3 * 24 * 69 * 60 * 1000,
  secondRun.newDifficulty,
);

console.log("Third run:", thirdRun);

const fourthRun = getNewStrengthAndDifficultyWithDefaults(
  1,
  800,
  10,
  thirdRun.newStrength,
  1 * 24 * 69 * 60 * 1000,
  thirdRun.newDifficulty,
);

console.log("Fourth run:", fourthRun);

const fifthRun = getNewStrengthAndDifficultyWithDefaults(
  0.8,
  1500,
  10,
  fourthRun.newStrength,
  2 * 24 * 69 * 60 * 1000,
  fourthRun.newDifficulty,
);

console.log("Fifth run:", fifthRun);

const sixthRun = getNewStrengthAndDifficultyWithDefaults(
  0.3,
  4000,
  10,
  fifthRun.newStrength,
  3 * 24 * 69 * 60 * 1000,
  fifthRun.newDifficulty,
);

console.log("Sixth run:", sixthRun);

const runHundred = (prevStrength: number, prevDifficulty: number) => {
  let strength = prevStrength;
  let difficulty = prevDifficulty;

  for (let i = 0; i < 100; i++) {
    const result = getNewStrengthAndDifficultyWithDefaults(
      1,
      500,
      10,
      strength,
      (i + 1) * 24 * 69 * 60 * 1000,
      difficulty,
    );
    strength = result.newStrength;
    difficulty = result.newDifficulty;

    console.log(`Run ${i + 1}:`, result);
  }

  return { strength, difficulty };
};

const hundredRun = runHundred(1, 1);

console.log("After 100 perfect runs:", hundredRun);

const runHundredBad = (prevStrength: number, prevDifficulty: number) => {
  let strength = prevStrength;
  let difficulty = prevDifficulty;

  for (let i = 0; i < 100; i++) {
    const result = getNewStrengthAndDifficultyWithDefaults(
      0.3,
      4000,
      10,
      strength,
      (i + 1 + 100) * 24 * 69 * 60 * 1000,
      difficulty,
    );
    strength = result.newStrength;
    difficulty = result.newDifficulty;

    console.log(`Run ${i + 1 + 100}:`, result);
  }

  return { strength, difficulty };
};

const hundredRunBad = runHundredBad(1, 1);

console.log("After 100 bad runs:", hundredRunBad);
