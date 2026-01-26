
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

function generateMcqsFromText(text, maxCount = 20) {
  const sentences = splitIntoSentences(text);

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
    });
  }

  // Use unique keywords as pool for wrong options
  const uniqueKeywords = [...new Set(allKeywords)];

  const questions = [];

  for (const item of base) {
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
    });

    if (questions.length >= maxCount) break;
  }

  return questions;
}

module.exports = { generateMcqsFromText };
