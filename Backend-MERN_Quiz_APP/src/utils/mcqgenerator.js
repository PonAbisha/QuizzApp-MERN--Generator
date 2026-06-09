
function splitIntoSentences(text) {
  return text
    .split(/[\.\?\!\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 20); // ignore very short lines
}

function tokenize(sentence) {
  return sentence
    .split(/[\s,؛:()"'“”«»\-]+/)
    .map(w => w.trim())
    .filter(Boolean);
}

// Pick a "keyword" – longest meaningful word (length > 3)
function pickKeyword(words) {
  let best = "";
  for (const w of words) {
    if (w.length > best.length && w.length > 3) {
      best = w;
    }
  }
  return best || null;
}

function getDifficultyScore(sentence, words) {
  const uniqueWords = new Set(words.map((word) => word.toLowerCase()));
  return words.length + uniqueWords.size + Math.round(sentence.length / 20);
}

function filterByDifficulty(items, difficulty) {
  const sorted = [...items].sort(
    (a, b) => a.difficultyScore - b.difficultyScore
  );

  if (difficulty === "easy") {
    return sorted.slice(0, Math.max(1, Math.ceil(sorted.length * 0.45)));
  }

  if (difficulty === "hard") {
    return sorted.slice(Math.floor(sorted.length * 0.45));
  }

  return sorted;
}

function generateMcqsFromText(text, maxCount = 20, difficulty = "medium") {
  const sentences = splitIntoSentences(text);
  const normalizedDifficulty = ["easy", "medium", "hard"].includes(difficulty)
    ? difficulty
    : "medium";

  const base = [];
  const allKeywords = [];

  for (const sentence of sentences) {
    const words = tokenize(sentence);
    if (words.length < 4) continue;

    const keyword = pickKeyword(words);
    if (!keyword) continue;

    allKeywords.push(keyword);

    // Create a fill-in-the-blank style question
    const questionText = sentence.replace(keyword, "_____");

    base.push({
      sentence,
      keyword,
      questionText,
      difficulty: normalizedDifficulty,
      difficultyScore: getDifficultyScore(sentence, words),
    });
  }

  // Use unique keywords as pool for wrong options
  const uniqueKeywords = [...new Set(allKeywords)];

  // Shuffle the base candidates so questions are distributed across the entire book
  const filteredBase = filterByDifficulty(base, normalizedDifficulty);

  const shuffledBase = filteredBase.sort(() => 0.5 - Math.random());

  const questions = [];

  for (const item of shuffledBase) {
    const correct = item.keyword;

    // Pick 3 wrong options from other keywords
    const wrongs = uniqueKeywords
      .filter(w => w !== correct)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    if (wrongs.length < 3) continue;

    let options = [correct, ...wrongs];
    // Shuffle options
    options = options.sort(() => 0.5 - Math.random());

    const correctIndex = options.indexOf(correct);

    questions.push({
      questionText: item.questionText,
      options,
      correctIndex,
      difficulty: item.difficulty,
      sentence: item.sentence, // Pass original sentence so we can map it back to the physical page
    });

    if (questions.length >= maxCount) break;
  }

  return questions;
}

module.exports = { generateMcqsFromText };
