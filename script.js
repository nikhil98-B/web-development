// ---------- Setup pdf.js worker ----------
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ---------- Grab elements ----------
const dropArea = document.getElementById("dropArea");
const fileInput = document.getElementById("fileInput");
const fileNameEl = document.getElementById("fileName");
const imageWarning = document.getElementById("imageWarning");
const analyzeBtn = document.getElementById("analyzeBtn");
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const progressFill = document.getElementById("progressFill");
const progressPercent = document.getElementById("progressPercent");
const results = document.getElementById("results");
const scoreCircle = document.getElementById("scoreCircle");
const scoreValue = document.getElementById("scoreValue");
const scoreLabel = document.getElementById("scoreLabel");
const goodList = document.getElementById("goodList");
const suggestionList = document.getElementById("suggestionList");
const rawTextOutput = document.getElementById("rawTextOutput");

// ----- Company mode elements -----
const modePersonal = document.getElementById("modePersonal");
const modeCompany = document.getElementById("modeCompany");
const personalView = document.getElementById("personalView");
const companyMode = document.getElementById("companyMode");
const multiDropArea = document.getElementById("multiDropArea");
const multiFileInput = document.getElementById("multiFileInput");
const multiFileName = document.getElementById("multiFileName");
const fileList = document.getElementById("fileList");
const requirementsInput = document.getElementById("requirementsInput");
const rankBtn = document.getElementById("rankBtn");
const companyLoader = document.getElementById("companyLoader");
const companyLoaderText = document.getElementById("companyLoaderText");
const companyProgressFill = document.getElementById("companyProgressFill");
const companyProgressPercent = document.getElementById("companyProgressPercent");
const leaderboard = document.getElementById("leaderboard");
const rankList = document.getElementById("rankList");

let uploadedFile = null;
let uploadedFiles = [];

// ============================================================
// ==================== MODE SWITCHING ========================
// ============================================================
function setMode(mode) {
  const personal = mode === "personal";
  modePersonal.classList.toggle("active", personal);
  modeCompany.classList.toggle("active", !personal);
  personalView.classList.toggle("hidden", !personal);
  companyMode.classList.toggle("hidden", personal);
}

modePersonal.addEventListener("click", () => setMode("personal"));
modeCompany.addEventListener("click", () => setMode("company"));

// ============================================================
// ==================== PERSONAL MODE =========================
// ============================================================

// ---------- Upload box interactions ----------
dropArea.addEventListener("click", () => fileInput.click());

dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("dragover");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("dragover");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("dragover");
  if (e.dataTransfer.files.length) {
    handleFile(e.dataTransfer.files[0]);
  }
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    handleFile(fileInput.files[0]);
  }
});

function handleFile(file) {
  uploadedFile = file;
  fileNameEl.textContent = "Selected: " + file.name;
  analyzeBtn.disabled = false;

  // show warning only for image uploads
  if (file.type.startsWith("image/")) {
    imageWarning.classList.remove("hidden");
  } else {
    imageWarning.classList.add("hidden");
  }
}

// ---------- Progress bar helper ----------
function setProgress(percent, label) {
  progressFill.style.width = percent + "%";
  progressPercent.textContent = percent + "%";
  if (label) loaderText.textContent = label;
}

function setCompanyProgress(percent, label) {
  companyProgressFill.style.width = percent + "%";
  companyProgressPercent.textContent = percent + "%";
  if (label) companyLoaderText.textContent = label;
}

// ---------- Analyze button ----------
analyzeBtn.addEventListener("click", async () => {
  if (!uploadedFile) return;

  results.classList.add("hidden");
  loader.classList.remove("hidden");
  setProgress(0, "Starting...");

  try {
    const text = await extractText(uploadedFile, setProgress);
    const report = analyzeResume(text, null);

    setTimeout(() => {
      showResults(report);
      loader.classList.add("hidden");
      results.classList.remove("hidden");
      setProgress(0, "Analyzing your resume...");
    }, 400);

  } catch (err) {
    loader.classList.add("hidden");
    alert("Could not read this file. Try a clearer image or a different format.");
    console.error(err);
  }
});

// ============================================================
// ==================== COMPANY MODE ==========================
// ============================================================

// ---------- Upload box interactions (multiple) ----------
multiDropArea.addEventListener("click", () => multiFileInput.click());

multiDropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  multiDropArea.classList.add("dragover");
});

multiDropArea.addEventListener("dragleave", () => {
  multiDropArea.classList.remove("dragover");
});

multiDropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  multiDropArea.classList.remove("dragover");
  if (e.dataTransfer.files.length) {
    uploadMultiple(e.dataTransfer.files);
  }
});

multiFileInput.addEventListener("change", () => {
  if (multiFileInput.files.length) {
    uploadMultiple(multiFileInput.files);
  }
});

function uploadMultiple(fileArray) {
  uploadedFiles = Array.from(fileArray);
  multiFileName.textContent = "Selected: " + uploadedFiles.length + " resume(s)";
  renderFileList();
  rankBtn.disabled = uploadedFiles.length === 0;
}

function renderFileList() {
  fileList.innerHTML = "";
  uploadedFiles.forEach((f, i) => {
    const li = document.createElement("li");
    const badge = document.createElement("span");
    badge.className = "file-num";
    badge.textContent = "#" + (i + 1);
    const info = document.createElement("span");
    info.textContent = f.name;
    li.appendChild(badge);
    li.appendChild(info);
    fileList.appendChild(li);
  });
}

// ---------- Requirements parsing ----------
function parseCompanyRequirements(raw) {
  const req = { keywords: [], minYears: 0 };

  // extract minimum experience like "2 years" or "Minimum experience: 2 years"
  const expMatch = raw.match(/(\d+(?:\.\d+)?)\s*(?:\s*)?years?\s*(?:of)?\s*experience/i);
  const minMatch = raw.match(/minimum\s+(?:of\s+)?(\d+(?:\.\d+)?)\s*years?/i);
  if (minMatch) req.minYears = parseFloat(minMatch[1]);
  else if (expMatch) req.minYears = parseFloat(expMatch[1]);

  raw.split(/[\n,;]+/).forEach((line) => {
    const s = line.trim();
    if (!s) return;
    if (/\d+\s*years?\s*(of)?\s*experience/i.test(s)) return;          // the experience line
    if (/^(minimum|required|key|core)\b/i.test(s)) return;              // stray labels
    req.keywords.push(s.toLowerCase());
  });

  return req;
}

// ============================================================
// ==================== TEXT EXTRACTION =======================
// ============================================================

// Generic extractor that reports progress via a callback
async function extractText(file, progressCb) {
  let text = "";

  if (file.type === "application/pdf") {
    progressCb(20, "Reading PDF...");
    text = await extractTextFromPDF(file, progressCb);
    progressCb(100, "Analyzing...");
  } else if (file.type.startsWith("image/")) {
    text = await extractTextFromImage(file, progressCb);
  } else {
    progressCb(50, "Reading file...");
    text = await file.text(); // .txt
    progressCb(100, "Analyzing...");
  }

  return text;
}

async function extractTextFromPDF(file, progress) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const percent = Math.round((i / pdf.numPages) * 80) + 10; // 10% -> 90%
    progress(percent, `Reading page ${i} of ${pdf.numPages}...`);

    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
}

async function extractTextFromImage(file, progress) {
  progress(0, "Loading OCR engine...");

  const result = await Tesseract.recognize(file, "eng", {
    logger: (info) => {
      if (info.status === "recognizing text") {
        const percent = Math.round(info.progress * 100);
        progress(percent, `Reading text from image... ${percent}%`);
      } else if (info.status === "loading tesseract core") {
        progress(5, "Loading OCR engine...");
      } else if (info.status === "initializing api") {
        progress(10, "Initializing OCR...");
      }
    }
  });

  progress(100, "Analyzing...");
  return result.data.text;
}

// ============================================================
// ==================== CORE SCORING ==========================
// ============================================================
// Returns: { score, good, suggestions, rawText, fit }
//   score : overall resume quality (0-100) independent of a job
//   fit   : null (personal) or object with requirement match info
function analyzeResume(rawText, requirements) {
  const text = rawText.toLowerCase();
  const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;

  let score = 0;
  const good = [];
  const suggestions = [];

  // 1. Contact info
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(rawText);
  const hasPhone = /(\+?\d[\d\s-]{8,}\d)/.test(rawText);
  if (hasEmail) {
    score += 10;
    good.push("Contains a valid email address.");
  } else {
    suggestions.push("Add a professional email address so recruiters can contact you.");
  }
  if (hasPhone) {
    score += 5;
    good.push("Contains a phone number.");
  } else {
    suggestions.push("Add a phone number for easy contact.");
  }

  // 2. Key sections
  const sectionChecks = {
    Education: ["education", "academic background", "qualification"],
    Experience: ["experience", "work history", "employment", "work experience"],
    Skills: ["skills", "technical skills", "core competencies", "competencies"],
    Projects: ["project"]
  };

  for (const label in sectionChecks) {
    const found = sectionChecks[label].some((term) => text.includes(term));
    if (found) {
      score += 10;
      good.push(`Includes a "${label}" section.`);
    } else {
      suggestions.push(`Add a clear "${label}" section — recruiters look for this explicitly.`);
    }
  }

  // 3. Word count check
  if (wordCount >= 250 && wordCount <= 900) {
    score += 15;
    good.push("Resume length looks appropriate.");
  } else if (wordCount < 250) {
    suggestions.push("Your resume seems short. Add more detail about your projects and achievements.");
  } else {
    suggestions.push("Your resume looks long. Try trimming it to 1-2 pages of relevant content.");
  }

  // 4. Action verbs
  const actionVerbs = ["built", "developed", "led", "designed", "created",
                        "managed", "improved", "launched", "implemented", "achieved",
                        "used", "oversaw", "coordinated", "reduced", "increased",
                        "conducted", "drew", "provided", "monitored"];
  const verbHits = actionVerbs.filter((v) => text.includes(v));
  if (verbHits.length >= 3) {
    score += 15;
    good.push("Uses strong action verbs (e.g. " + verbHits.slice(0, 3).join(", ") + ").");
  } else {
    suggestions.push('Use strong action verbs like "built", "led", "developed" instead of passive phrases.');
  }

  // 5. Weak phrases
  const weakPhrases = ["responsible for", "worked on", "helped with"];
  const weakHits = weakPhrases.filter((p) => text.includes(p));
  if (weakHits.length > 0) {
    suggestions.push('Avoid weak phrases like "responsible for" — describe the actual impact instead.');
  } else {
    score += 5;
    good.push("Avoids generic/weak phrasing.");
  }

  // 6. Quantified achievements
  const hasNumbers = /\d+%|\d+\+|\$\d+|\b\d{2,}\b/.test(rawText);
  if (hasNumbers) {
    score += 15;
    good.push("Includes measurable results (numbers/percentages).");
  } else {
    suggestions.push('Add measurable achievements, e.g. "increased performance by 20%" or "handled 500+ users".');
  }

  // 7. Bullet points
  const bulletCount = (rawText.match(/•|- /g) || []).length;
  if (bulletCount >= 4) {
    score += 10;
    good.push("Uses bullet points for readability.");
  } else {
    suggestions.push("Use bullet points instead of long paragraphs to make your resume easy to scan.");
  }

  // 8. Links
  const hasLink = /linkedin\.com|github\.com|http/.test(text);
  if (hasLink) {
    score += 5;
    good.push("Includes a link (LinkedIn/GitHub/portfolio).");
  } else {
    suggestions.push("Add a LinkedIn or GitHub link so recruiters can see more of your work.");
  }

  // clamp quality score
  score = Math.min(score, 100);

  // ===== Company match score (fit) =====
  let fit = null;
  if (requirements) {
    const keywords = requirements.keywords.filter(Boolean);
    const missing = keywords.filter((k) => !text.includes(k));
    const matchedCount = keywords.length - missing.length;
    const coverage = keywords.length ? matchedCount / keywords.length : 0;

    // experience points
    let expStars = 0; // 0..30 weight
    const expYears = detectYears(text);
    if (requirements.minYears > 0) {
      if (expYears >= requirements.minYears) expStars = 30;
      else if (expYears > 0) expStars = Math.min(30, Math.round((expYears / requirements.minYears) * 30));
    } else {
      expStars = 15;
    }

    const matchScore = keywords.length
      ? Math.min(100, Math.round(coverage * 70 + expStars))
      : Math.min(100, score);

    fit = {
      keywords,
      matched: matchedCount,
      total: keywords.length,
      missing,
      coverage: keywords.length ? Math.round(coverage * 100) : 100,
      expFound: expYears,
      expRequired: requirements.minYears,
      matchScore
    };
  }

  return { score, good, suggestions, rawText, fit };
}

// ---------- Detect years of experience ----------
function detectYears(text) {
  const m = text.match(/(\d+(?:\.\d+)?)\s*(?:\s*)?years?\s*(?:of)?\s*experience/i);
  if (m) return parseFloat(m[1]);
  return 0;
}

// ============================================================
// ==================== COMPANY RANKING =======================
// ============================================================
rankBtn.addEventListener("click", async () => {
  if (!uploadedFiles.length) return;

  const req = parseCompanyRequirements(requirementsInput.value);
  leaderboard.classList.add("hidden");
  rankList.innerHTML = "";
  companyLoader.classList.remove("hidden");
  setCompanyProgress(0, "Starting...");

  const entries = [];
  try {
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      const base = Math.round((i / uploadedFiles.length) * 10);
      setCompanyProgress(base, `Reading resume ${i + 1} of ${uploadedFiles.length}...`);

      const text = await extractText(file, (pct, label) => {
        // map text extraction progress (0-100) onto this file's slice
        const slice = 60 / uploadedFiles.length;
        const p = Math.round(base + (pct / 100) * slice);
        setCompanyProgress(p, `Resume ${i + 1}: ${label}`);
      });

      const report = analyzeResume(text, req);
      const rankScore = Math.round(report.score * 0.55 + report.fit.matchScore * 0.45);

      entries.push({ file, report, overall: rankScore });
      setCompanyProgress(Math.round(((i + 1) / uploadedFiles.length) * 100),
        `Analyzed resume ${i + 1} of ${uploadedFiles.length}...`);
    }
  } catch (err) {
    companyLoader.classList.add("hidden");
    alert("Could not read one or more files. Please check the formats.");
    console.error(err);
    return;
  }

  entries.sort((a, b) => b.overall - a.overall);

  setTimeout(() => {
    companyLoader.classList.add("hidden");
    renderLeaderboard(entries, req);
    leaderboard.classList.remove("hidden");
    setCompanyProgress(0, "Processing resumes...");
  }, 300);
});

function renderLeaderboard(entries, req) {
  rankList.innerHTML = "";

  entries.forEach((entry, idx) => {
    const isBest = idx === 0;
    const row = document.createElement("div");
    row.className = "rank-row" + (isBest ? " best" : "");

    // header
    const head = document.createElement("div");
    head.className = "rank-head";
    head.innerHTML =
      `<span class="rank-num">${isBest ? "🥇" : idx + 1}</span>` +
      `<span class="rank-name">${entry.file.name}</span>` +
      `<span class="rank-overall">${entry.overall}<small>/100</small></span>`;

    if (isBest) {
      const badge = document.createElement("div");
      badge.className = "best-badge";
      badge.textContent = "🏆 BEST MATCH";
      head.appendChild(badge);
    }

    // bars
    const body = document.createElement("div");
    body.className = "rank-body";

    body.innerHTML =
      bar("Resume Quality", entry.report.score) +
      bar("Requirement Match", entry.report.fit.matchScore) +
      `<div class="match-detail">` +
      `Covered <b>${entry.report.fit.matched}</b> of <b>${entry.report.fit.total}</b> required skills (${entry.report.fit.cover}%)` +
      (entry.report.fit.expFound
        ? ` · ${entry.report.fit.expFound} yr. experience found`
        : " · no experience mentioned") +
      `</div>`;

    // expandable details
    const detail = document.createElement("details");
    detail.className = "rank-detail";
    detail.innerHTML = `
      <summary>View details</summary>
      <div class="rank-feedback">
        <p><strong>Missing required skills:</strong> ${entry.report.fit.missing.length ? entry.report.fit.missing.join(", ") : "none"}</p>
        <p><strong>What's good:</strong></p>
        <ul>${entry.report.good.map((g) => `<li>${g}</li>`).join("") || "<li>—</li>"}</ul>
        <p><strong>Suggestions:</strong></p>
        <ul>${entry.report.suggestions.map((s) => `<li>${s}</li>`).join("") || "<li>—</li>"}</ul>
      </div>`;

    body.appendChild(detail);
    row.appendChild(head);
    row.appendChild(body);
    rankList.appendChild(row);
  });
}

function bar(label, value) {
  const color = value >= 75 ? "#22c55e" : value >= 50 ? "#fbbf24" : "#ef4444";
  return `
    <div class="bar-label">${label} <span>${value}</span></div>
    <div class="bar-track"><div class="bar-fill" style="width:${value}%;background:${color}"></div></div>`;
}

// ============================================================
// ==================== PERSONAL DISPLAY ======================
// ============================================================
function showResults(report) {
  let current = 0;
  const target = report.score;
  const color = target >= 75 ? "#22c55e" : target >= 50 ? "#fbbf24" : "#ef4444";

  const interval = setInterval(() => {
    current++;
    scoreValue.textContent = current;
    scoreCircle.style.background =
      `conic-gradient(${color} ${current * 3.6}deg, #1e293b 0deg)`;
    if (current >= target) clearInterval(interval);
  }, 12);

  scoreLabel.textContent =
    target >= 75 ? "Great Resume! 🎉" :
    target >= 50 ? "Decent, but needs work 🛠️" :
    "Needs Improvement ⚠️";

  goodList.innerHTML = "";
  report.good.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = "✓ " + item;
    goodList.appendChild(li);
  });
  if (report.good.length === 0) {
    goodList.innerHTML = "<li>Nothing strong detected yet — check suggestions below.</li>";
  }

  suggestionList.innerHTML = "";
  report.suggestions.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = "→ " + item;
    suggestionList.appendChild(li);
  });
  if (report.suggestions.length === 0) {
    suggestionList.innerHTML = "<li>You're all set — no major issues found!</li>";
  }

  rawTextOutput.textContent = report.rawText && report.rawText.trim()
    ? report.rawText
    : "(no text could be extracted from this file)";
}