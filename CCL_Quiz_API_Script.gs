// ═══════════════════════════════════════════════════════════════════
//  CCL QUIZ — Google Apps Script API (Backend)
//  GitHub HTML → এই Script → Google Sheets
//
//  📋 সেটআপ নির্দেশনা (একবার করলেই হবে):
//  ১. Google Sheets-এ যান → Extensions → Apps Script
//  ২. এই পুরো কোড পেস্ট করুন → Save (Ctrl+S)
//  ৩. Deploy → New Deployment → Web App
//     - Execute as: Me
//     - Who has access: Anyone (anonymous)
//  ৪. Deploy → URL কপি করুন (এটাই আপনার API URL)
//  ৫. GitHub HTML ফাইলে GOOGLE_SCRIPT_URL এ এই URL বসান
// ═══════════════════════════════════════════════════════════════════

// ── CONFIG ──────────────────────────────────────────────────────────
const RESPONSES_SHEET = "📊 Quiz Responses";
const SUMMARY_SHEET   = "📈 Summary Dashboard";
const QUESTIONS_SHEET = "📝 Questions";

// ── doGet: Health check ─────────────────────────────────────────────
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "ok",
      message: "CCL Quiz API is running",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── doPost: Receive quiz submission from GitHub ─────────────────────
function doPost(e) {
  // CORS headers allow GitHub Pages to call this
  const response = {
    success: false,
    message: "",
    data: {}
  };

  try {
    // Parse incoming data
    const raw  = e.postData ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    // Validate
    if (!data.name || data.name.trim() === "") {
      response.message = "নাম দেওয়া হয়নি";
      return buildResponse(response);
    }

    // Save to Responses sheet
    const result = saveToSheet(data);
    response.success = true;
    response.message = "সফলভাবে সংরক্ষণ হয়েছে";
    response.data    = result;

    // Update summary
    updateSummary();

  } catch (err) {
    response.message = "Error: " + err.message;
    Logger.log("doPost Error: " + err.message);
  }

  return buildResponse(response);
}

// ── CORS-enabled response ────────────────────────────────────────────
function buildResponse(data) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ── Save submission to Google Sheet ─────────────────────────────────
function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Create sheet if not exists
  let sh = ss.getSheetByName(RESPONSES_SHEET);
  if (!sh) {
    sh = ss.insertSheet(RESPONSES_SHEET);
    setupResponsesSheet(sh);
  }

  // Build answer details
  const answers     = data.answers || {};
  const questions   = data.questions || [];
  let correctCount  = 0;
  const answerCells = [];

  questions.forEach((q, i) => {
    const given  = (answers[i + 1] || "").toString().toUpperCase();
    const correct = (q.ans || "").toString().toUpperCase();
    const isOk   = given === correct;
    if (isOk) correctCount++;
    answerCells.push(isOk ? "✓" : `✗(${given || "?"})`);
  });

  const total   = questions.length || 20;
  const pct     = Math.round((correctCount / total) * 100);
  const grade   = pct >= 80 ? "A — চমৎকার" :
                  pct >= 60 ? "B — ভালো"    :
                  pct >= 40 ? "C — মধ্যম"   : "F — আরও পড়ুন";

  const now     = Utilities.formatDate(
    new Date(), "Asia/Dhaka", "dd-MMM-yyyy HH:mm:ss"
  );
  const serial  = sh.getLastRow(); // row count = serial

  // Build row: Serial | নাম | ইমেইল/ফোন | তারিখ | Q1..Q20 | সঠিক | % | গ্রেড
  const row = [
    serial,
    data.name.trim(),
    (data.email || "—").trim(),
    now,
    ...answerCells,
    correctCount,
    pct + "%",
    grade
  ];

  sh.appendRow(row);

  // Apply color to the row based on score
  const lastRow  = sh.getLastRow();
  const numCols  = row.length;
  const bgColor  = pct >= 80 ? "#E8F5E9" :
                   pct >= 60 ? "#FFF8E1" :
                   pct >= 40 ? "#FFF3E0" : "#FFEBEE";
  sh.getRange(lastRow, 1, 1, numCols).setBackground(bgColor);

  // Bold the score columns
  sh.getRange(lastRow, numCols - 2, 1, 3)
    .setFontWeight("bold");

  Logger.log(`Saved: ${data.name} | ${correctCount}/${total} | ${pct}% | ${grade}`);

  return {
    name:    data.name,
    correct: correctCount,
    total:   total,
    pct:     pct,
    grade:   grade,
    serial:  serial
  };
}

// ── Setup Response Sheet headers ─────────────────────────────────────
function setupResponsesSheet(sh) {
  const NAVY = "#0D1B4B"; const TEAL = "#0D6E6E";
  const GOLD = "#C9A227"; const WHITE = "#FFFFFF";

  // Title row
  sh.getRange("A1").setValue("CHANDPUR CORPORATION LTD. — Quiz Responses")
    .setBackground(NAVY).setFontColor(WHITE)
    .setFontWeight("bold").setFontSize(14)
    .setHorizontalAlignment("center");
  sh.getRange("A1:X1").merge().setBackground(NAVY);
  sh.setRowHeight(1, 38);

  // Header row
  const hdrs = [
    "#", "নাম (Name)", "ইমেইল/ফোন", "তারিখ ও সময়",
    ...Array.from({length: 20}, (_, i) => `Q${i + 1}`),
    "সঠিক", "স্কোর%", "গ্রেড"
  ];

  hdrs.forEach((h, i) => {
    const cell = sh.getRange(2, i + 1);
    cell.setValue(h)
      .setBackground(i < 4 ? NAVY : (i < 24 ? TEAL : "#1B5E20"))
      .setFontColor(i < 4 ? GOLD : WHITE)
      .setFontWeight("bold")
      .setFontSize(9)
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle")
      .setWrap(true);
  });

  sh.setRowHeight(2, 32);
  sh.setColumnWidth(1, 40);
  sh.setColumnWidth(2, 160);
  sh.setColumnWidth(3, 140);
  sh.setColumnWidth(4, 160);
  for (let c = 5; c <= 24; c++) sh.setColumnWidth(c, 55);
  sh.setColumnWidth(25, 60);
  sh.setColumnWidth(26, 70);
  sh.setColumnWidth(27, 130);
  sh.setFrozenRows(2);
  sh.setFrozenColumns(4);
}

// ── Update Summary Dashboard ─────────────────────────────────────────
function updateSummary() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SUMMARY_SHEET);
  if (!sh) {
    sh = ss.insertSheet(SUMMARY_SHEET, 0);
  }

  const resSh = ss.getSheetByName(RESPONSES_SHEET);
  if (!resSh || resSh.getLastRow() < 3) return;

  const data     = resSh.getRange(3, 1, resSh.getLastRow() - 2, 27).getValues();
  const total    = data.length;
  const avgScore = Math.round(
    data.reduce((s, r) => s + (parseInt(r[24]) || 0), 0) / total
  );
  const aCount   = data.filter(r => String(r[26]).startsWith("A")).length;
  const fCount   = data.filter(r => String(r[26]).startsWith("F")).length;
  const now      = Utilities.formatDate(new Date(), "Asia/Dhaka", "dd-MMM-yyyy HH:mm");

  sh.clear();
  sh.getRange("A1:F1").merge()
    .setValue("CHANDPUR CORPORATION LTD. — Quiz Summary Dashboard")
    .setBackground("#0D1B4B").setFontColor("#C9A227")
    .setFontWeight("bold").setFontSize(14)
    .setHorizontalAlignment("center");
  sh.setRowHeight(1, 40);

  sh.getRange("A2:F2").merge()
    .setValue("সর্বশেষ আপডেট: " + now)
    .setBackground("#1A2E6B").setFontColor("#AABCDD")
    .setFontSize(10).setHorizontalAlignment("center");

  const summaryData = [
    ["মোট অংশগ্রহণকারী", total,        "#0D6E6E", "#FFFFFF"],
    ["গড় স্কোর %",        avgScore + "%","#1A7A4A", "#FFFFFF"],
    ["A গ্রেড পেয়েছেন",   aCount,       "#C9A227", "#0D1B4B"],
    ["F গ্রেড পেয়েছেন",   fCount,       "#C0392B", "#FFFFFF"],
  ];

  summaryData.forEach((item, i) => {
    const col = i + 1;
    sh.getRange(4, col).setValue(item[0])
      .setBackground(item[2]).setFontColor(item[3])
      .setFontWeight("bold").setFontSize(10)
      .setHorizontalAlignment("center");
    sh.getRange(5, col).setValue(item[1])
      .setBackground(item[2]).setFontColor(item[3])
      .setFontWeight("bold").setFontSize(20)
      .setHorizontalAlignment("center");
    sh.setColumnWidth(col, 160);
    sh.setRowHeight(4, 30);
    sh.setRowHeight(5, 50);
  });

  // Recent 10 entries
  sh.getRange("A7:F7").merge()
    .setValue("সাম্প্রতিক ১০ জনের ফলাফল")
    .setBackground("#0D1B4B").setFontColor("#FFFFFF")
    .setFontWeight("bold").setFontSize(11)
    .setHorizontalAlignment("left");

  const recHdrs = ["#", "নাম", "তারিখ", "সঠিক", "স্কোর", "গ্রেড"];
  recHdrs.forEach((h, i) => {
    sh.getRange(8, i + 1).setValue(h)
      .setBackground("#0D6E6E").setFontColor("#FFFFFF")
      .setFontWeight("bold").setFontSize(10)
      .setHorizontalAlignment("center");
  });

  const recent = data.slice(-10).reverse();
  recent.forEach((row, i) => {
    const r = 9 + i;
    const bg = i % 2 === 0 ? "#FFFFFF" : "#F4F6FB";
    const pctNum = parseInt(row[25]) || 0;
    const gradeColor = pctNum >= 80 ? "#1A7A4A" : pctNum >= 60 ? "#E08C1A" : "#C0392B";
    [row[0], row[1], row[3], row[24], row[25], row[26]].forEach((v, ci) => {
      sh.getRange(r, ci + 1).setValue(v)
        .setBackground(bg)
        .setFontColor(ci === 5 ? gradeColor : "#1E293B")
        .setFontWeight(ci >= 3 ? "bold" : "normal")
        .setFontSize(10)
        .setHorizontalAlignment(ci === 1 ? "left" : "center");
    });
  });
}

// ── onOpen: Add menu ─────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("🏢 CCL Quiz Admin")
    .addItem("📊 Summary আপডেট করুন",       "updateSummary")
    .addItem("🔗 API URL দেখুন",             "showApiUrl")
    .addItem("🧹 Test Data মুছুন",           "clearTestData")
    .addItem("📧 Result Email পাঠান",        "sendResultEmails")
    .addSeparator()
    .addItem("⚙️ Sheet Setup করুন",          "manualSetup")
    .addToUi();
}

// ── Show API URL ─────────────────────────────────────────────────────
function showApiUrl() {
  try {
    const url = ScriptApp.getService().getUrl();
    SpreadsheetApp.getUi().alert(
      "✅ আপনার API URL:\n\n" + url +
      "\n\n📋 এই URL টি GitHub HTML ফাইলে\nGOOGLE_SCRIPT_URL ভেরিয়েবলে বসান।"
    );
  } catch(e) {
    SpreadsheetApp.getUi().alert(
      "⚠️ Deploy করার পর URL পাওয়া যাবে।\n" +
      "Deploy → New Deployment → Web App করুন।"
    );
  }
}

// ── Manual Setup ────────────────────────────────────────────────────
function manualSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(RESPONSES_SHEET);
  if (!sh) {
    sh = ss.insertSheet(RESPONSES_SHEET);
    setupResponsesSheet(sh);
    SpreadsheetApp.getUi().alert("✅ Responses শীট তৈরি হয়েছে!");
  } else {
    SpreadsheetApp.getUi().alert("✅ Responses শীট আগে থেকেই আছে।");
  }
  updateSummary();
}

// ── Clear test data ──────────────────────────────────────────────────
function clearTestData() {
  const ui = SpreadsheetApp.getUi();
  const res = ui.alert(
    "নিশ্চিত করুন",
    "সব টেস্ট ডেটা মুছে ফেলবেন? (Header rows থাকবে)",
    ui.ButtonSet.YES_NO
  );
  if (res !== ui.Button.YES) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(RESPONSES_SHEET);
  if (sh && sh.getLastRow() > 2) {
    sh.deleteRows(3, sh.getLastRow() - 2);
    ui.alert("✅ টেস্ট ডেটা মুছে দেওয়া হয়েছে।");
  }
}

// ── Send result emails ───────────────────────────────────────────────
function sendResultEmails() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const sh  = ss.getSheetByName(RESPONSES_SHEET);
  if (!sh || sh.getLastRow() < 3) {
    SpreadsheetApp.getUi().alert("কোনো ডেটা নেই।"); return;
  }

  const data = sh.getRange(3, 1, sh.getLastRow() - 2, 27).getValues();
  const now  = Utilities.formatDate(new Date(), "Asia/Dhaka", "dd-MMM-yyyy");
  const total = data.length;
  const avg   = Math.round(data.reduce((s,r)=>s+(parseInt(r[24])||0),0)/total);

  // Build HTML summary
  let rows = data.map(r => {
    const pct = parseInt(r[25]) || 0;
    const color = pct>=80?"#1A7A4A":pct>=60?"#E08C1A":"#C0392B";
    return `<tr>
      <td style="padding:6px 8px;border-bottom:1px solid #eee">${r[1]}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${r[24]}/20</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center;font-weight:bold;color:${color}">${r[25]}</td>
      <td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center;color:${color}">${r[26]}</td>
    </tr>`;
  }).join('');

  const html = `
  <div style="font-family:Arial;max-width:600px;margin:0 auto">
    <div style="background:#0D1B4B;color:white;padding:20px;text-align:center;border-radius:8px 8px 0 0">
      <h2 style="margin:0">Chandpur Corporation Ltd.</h2>
      <p style="margin:6px 0 0;opacity:.7">FMCG Quiz Results — ${now}</p>
    </div>
    <div style="background:#F4F6FB;padding:16px;display:flex;gap:12px">
      <div style="background:white;padding:12px;border-radius:8px;text-align:center;flex:1">
        <div style="font-size:11px;color:#64748B">মোট অংশগ্রহণকারী</div>
        <div style="font-size:28px;font-weight:bold;color:#0D6E6E">${total}</div>
      </div>
      <div style="background:white;padding:12px;border-radius:8px;text-align:center;flex:1">
        <div style="font-size:11px;color:#64748B">গড় স্কোর</div>
        <div style="font-size:28px;font-weight:bold;color:#1A7A4A">${avg}%</div>
      </div>
    </div>
    <table style="width:100%;border-collapse:collapse;background:white">
      <thead>
        <tr style="background:#0D1B4B;color:white">
          <th style="padding:8px;text-align:left">নাম</th>
          <th style="padding:8px">সঠিক</th>
          <th style="padding:8px">স্কোর%</th>
          <th style="padding:8px">গ্রেড</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <div style="background:#0D1B4B;color:#AABCDD;padding:12px;text-align:center;font-size:11px;border-radius:0 0 8px 8px">
      CCL Quiz System — স্বয়ংক্রিয় রিপোর্ট
    </div>
  </div>`;

  try {
    MailApp.sendEmail({
      to: Session.getActiveUser().getEmail(),
      subject: `CCL Quiz Results — ${now} | ${total} জন | গড়: ${avg}%`,
      htmlBody: html
    });
    SpreadsheetApp.getUi().alert("✅ Result email পাঠানো হয়েছে!");
  } catch(e) {
    SpreadsheetApp.getUi().alert("❌ Email error: " + e.message);
  }
}
