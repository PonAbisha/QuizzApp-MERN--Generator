const fs = require("fs");
const os = require("os");
const path = require("path");
const rawPdf = require("pdf-parse");
const pdf = require("pdf-poppler");
const { createWorker } = require("tesseract.js");

function getEnglishLangPath() {
  return path.resolve(
    __dirname,
    "../../node_modules/@tesseract.js-data/eng/4.0.0_best_int"
  );
}

function sortImagePages(files) {
  return files.sort((a, b) => {
    const aNumber = Number((a.match(/(\d+)(?=\.[^.]+$)/) || [0, 0])[1]);
    const bNumber = Number((b.match(/(\d+)(?=\.[^.]+$)/) || [0, 0])[1]);
    return aNumber - bNumber;
  });
}

async function extractTextWithOcr(filePath) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "quiz-ocr-"));

  try {
    await pdf.convert(filePath, {
      format: "jpeg",
      out_dir: tempDir,
      out_prefix: "page",
      page: null,
      scale: 1800,
    });

    const imageFiles = sortImagePages(
      fs
        .readdirSync(tempDir)
        .filter((file) => /\.(jpg|jpeg|png)$/i.test(file))
        .map((file) => path.join(tempDir, file))
    );

    if (!imageFiles.length) {
      return [];
    }

    const worker = await createWorker("eng", 1, {
      langPath: getEnglishLangPath(),
      cachePath: path.join(os.tmpdir(), "tesseract-cache"),
    });

    const ocrPages = [];

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const {
          data: { text },
        } = await worker.recognize(imageFiles[i]);

        const pageText = (text || "").trim();

        if (pageText) {
          ocrPages.push({
            pageNumber: i + 1,
            text: pageText,
          });
        }
      }
    } finally {
      await worker.terminate();
    }

    return ocrPages;
  } finally {
    fs.rmSync(tempDir, {
      recursive: true,
      force: true,
    });
  }
}

async function extractText(filePath) {
  const buffer = fs.readFileSync(filePath);

  // Get correct function from package
  const pdfParse = rawPdf.default || rawPdf;
  
  const pagesList = [];

  // Custom page rendering function to capture page boundaries and texts
  async function customPageRenderer(pageData) {
    const renderOptions = {
      normalizeWhitespace: false,
      disableCombineTextItems: false
    };

    const textContent = await pageData.getTextContent(renderOptions);
    let lastY, text = "";
    
    for (const item of textContent.items) {
      if (lastY === item.transform[5] || !lastY) {
        text += item.str;
      } else {
        text += "\n" + item.str;
      }
      lastY = item.transform[5];
    }
    
    // Track the physical page number (1-based index) and text content
    pagesList.push({
      pageNumber: pageData.pageIndex + 1,
      text: text
    });
    
    return text;
  }

  const data = await pdfParse(buffer, {
    pagerender: customPageRenderer
  });

  // Ensure pages are strictly sorted by physical pageNumber
  pagesList.sort((a, b) => a.pageNumber - b.pageNumber);

  const parsedPages = pagesList
    .map((p) => ({
      pageNumber: p.pageNumber,
      text: (p.text || "").trim(),
    }))
    .filter((p) => p.text.length > 0);

  const fallbackText = (data.text || "").trim();
  const fallbackPages = fallbackText
    ? [
        {
          pageNumber: 1,
          text: fallbackText,
        },
      ]
    : [];

  const extractedPages = parsedPages.length ? parsedPages : fallbackPages;
  const extractedText = (data.text || "").trim();

  if (extractedText.length >= 20 && extractedPages.length) {
    return {
      fullText: data.text || "",
      pagesList: extractedPages,
    };
  }

  return {
  fullText: data.text || "",
  pagesList: extractedPages,
  };
}

module.exports = { extractText };
