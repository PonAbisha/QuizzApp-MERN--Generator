const fs = require("fs");
const rawPdf = require("pdf-parse");

async function extractText(filePath) {
  const buffer = fs.readFileSync(filePath);

  // ✅ Get correct function from package
  const pdfParse = rawPdf.default || rawPdf;
  const data = await pdfParse(buffer);
  return data.text;
}

module.exports = { extractText };
