import {
  AnswerScore,
  getNewStrengthAndDifficultyWithDefaults,
  getForgetProbability,
  type MemoryInternals,
} from "./memory";

const runDaily = (args?: {
  prevStrength?: number;
  prevDifficulty?: number;
  runs?: number;
  startDay?: number;
  length?: number;
  answerTime?: number;
  answerScore?: number;
}) => {
  const params = {
    prevStrength: 0,
    prevDifficulty: 0,
    runs: 5,
    startDay: 0,
    length: 10,
    answerTime: 4000,
    answerScore: 0,
    ...args,
  };

  const {
    prevStrength,
    prevDifficulty,
    runs,
    startDay,
    length,
    answerTime,
    answerScore,
  } = params;

  let strength = prevStrength;
  let difficulty = prevDifficulty;

  type ResultRow = {
    day: number;
    l: number;
    anSC: number;
    exT: number;
    anT: number;
    speedScore: number;
    answerQuality: number;
    newStrength: number;
    newDifficulty: number;
    dLastReview: number;
    currentForgetProbability: number;
  };
  const results: ResultRow[] = [];

  for (let i = 0; i < runs; i++) {
    const timeSinceLastReview = (startDay + i) * 24 * 69 * 60 * 1000;

    // function that takes internals merge them into the result and push to results
    function transformAndPush(internals: MemoryInternals) {
      results.push({
        day: startDay + i,
        l: length,
        anSC: answerScore,
        exT: internals.expectedAnswerTime,
        anT: answerTime,
        speedScore: internals.speedScore,
        answerQuality: internals.answerQuality,
        newStrength: internals.newStrength,
        newDifficulty: internals.newDifficulty,
        dLastReview: internals.daysSinceLastReview,
        currentForgetProbability: internals.currentForgetProbability,
      });
    }

    const result = getNewStrengthAndDifficultyWithDefaults(
      {
        answerScore,
        answerTime,
        itemLength: length,
        strength,
        msSinceLastReview: timeSinceLastReview,
        difficulty,
      },
      transformAndPush,
    );
    strength = result.newStrength;
    difficulty = result.newDifficulty;
  }

  console.log(`\n\n`);

  console.table(results);

  // Get forgettability after 1, 7, 14, 30, 90, 180, 360 days
  console.log("Forgettability over time since last review:");
  const intervals = [1, 7, 14, 30, 90, 180, 360];
  intervals.forEach((days) => {
    const strength = results[results.length - 1].newStrength;
    const difficulty = results[results.length - 1].newDifficulty;

    const result = getForgetProbability({
      strength,
      difficulty,
      daysSinceLastReview: days,
    });
    console.log(`  After ${days} days: ${result}.`);
  });

  return { strength, difficulty, nextDay: startDay + runs };
};

const repetitive = () => {
  const first = runDaily();
  const second = runDaily({
    prevStrength: first.strength,
    prevDifficulty: first.difficulty,
    startDay: first.nextDay,
    answerScore: 0.2,
  });
  const third = runDaily({
    prevStrength: second.strength,
    prevDifficulty: second.difficulty,
    startDay: second.nextDay,
    answerScore: 0.5,
  });

  const fourth = runDaily({
    prevStrength: third.strength,
    prevDifficulty: third.difficulty,
    startDay: third.nextDay,
    answerScore: 1,
    answerTime: 8000,
  });

  const fifth = runDaily({
    prevStrength: fourth.strength,
    prevDifficulty: fourth.difficulty,
    startDay: fourth.nextDay,
    answerScore: 1,
    answerTime: 4000,
  });

  const sixth = runDaily({
    prevStrength: fifth.strength,
    prevDifficulty: fifth.difficulty,
    startDay: fifth.nextDay,
    answerScore: 1,
    answerTime: 2000,
  });

  const seventh = runDaily({
    prevStrength: sixth.strength,
    prevDifficulty: sixth.difficulty,
    startDay: sixth.nextDay,
    answerScore: 1,
    answerTime: 1000,
  });

  // eighth day
  runDaily({
    prevStrength: seventh.strength,
    prevDifficulty: seventh.difficulty,
    startDay: seventh.nextDay,
    answerScore: 1,
    answerTime: 500,
  });

  // Scenario 2: Starting with better performance and going down
  console.log(
    "\n\n\n\nScenario 2: Starting with better performance and going down\n\n",
  );

  const firstB = runDaily({
    answerScore: 1,
    answerTime: 500,
  });

  const secondB = runDaily({
    prevStrength: firstB.strength,
    prevDifficulty: firstB.difficulty,
    startDay: firstB.nextDay,
    answerScore: 1,
    answerTime: 1000,
  });

  const thirdB = runDaily({
    prevStrength: secondB.strength,
    prevDifficulty: secondB.difficulty,
    startDay: secondB.nextDay,
    answerScore: 0.5,
    answerTime: 4000,
  });

  const fourthB = runDaily({
    prevStrength: thirdB.strength,
    prevDifficulty: thirdB.difficulty,
    startDay: thirdB.nextDay,
    answerScore: 0.2,
    answerTime: 6000,
  });

  // fifth day
  runDaily({
    prevStrength: fourthB.strength,
    prevDifficulty: fourthB.difficulty,
    startDay: fourthB.nextDay,
    answerScore: 0,
    answerTime: 8000,
  });
};

const scenario = () => {
  // Realistic Scenario: Learning a programming concept over a week
  console.log(
    "\n\n\n\n=== Realistic Scenario: Learning a Programming Concept ===\n",
  );

  // Day 1: Initial attempt - needed multiple clues, slow response time
  const day1 = runDaily({
    answerScore: AnswerScore.CLUES,
    answerTime: 8000,
    runs: 1,
  });
  // reattempt later the same day - got it with a clue, moderate response time
  const day1Reattempt = runDaily({
    prevStrength: day1.strength,
    prevDifficulty: day1.difficulty,
    startDay: day1.nextDay - 0.5,
    answerScore: AnswerScore.CLUE,
    answerTime: 6000,
    runs: 1,
  });
  // Day 2: Review - got it correctly, improved response time
  const day2 = runDaily({
    prevStrength: day1Reattempt.strength,
    prevDifficulty: day1Reattempt.difficulty,
    startDay: day1Reattempt.nextDay,
    answerScore: AnswerScore.KNOW,
    answerTime: 4000,
    runs: 1,
  });
  // Day 4: Review after a gap - still correct, good response time
  const day4 = runDaily({
    prevStrength: day2.strength,
    prevDifficulty: day2.difficulty,
    startDay: 4,
    answerScore: AnswerScore.KNOW,
    answerTime: 3000,
    runs: 1,
  });
  // Day 7: Final review - completely mastered, excellent response time
  const day7 = runDaily({
    prevStrength: day4.strength,
    prevDifficulty: day4.difficulty,
    startDay: 7,
    answerScore: AnswerScore.VERY_KNOW,
    answerTime: 1500,
    runs: 1,
  });

  // Day 40: forgot
  const day40 = runDaily({
    prevStrength: day7.strength,
    prevDifficulty: day7.difficulty,
    startDay: 40,
    answerScore: AnswerScore.NO,
    answerTime: 9000,
    runs: 1,
  });

  // the same day re-learn and answer fast correctly
  const day40Relearn = runDaily({
    prevStrength: day40.strength,
    prevDifficulty: day40.difficulty,
    startDay: 40,
    answerScore: AnswerScore.KNOW,
    answerTime: 2000,
    runs: 1,
  });

  // Day 70: remember correctly but very slowly
  const day70 = runDaily({
    prevStrength: day40Relearn.strength,
    prevDifficulty: day40Relearn.difficulty,
    startDay: 70,
    answerScore: AnswerScore.KNOW,
    answerTime: 8000,
    runs: 1,
  });

  // Day 100: perfect recall
  runDaily({
    prevStrength: day70.strength,
    prevDifficulty: day70.difficulty,
    startDay: 100,
    answerScore: AnswerScore.VERY_KNOW,
    answerTime: 1000,
    runs: 1,
  });
};

// log a separator

console.log("\n\n\n" + "#".repeat(100) + "\n\n\n");

repetitive();

scenario();
