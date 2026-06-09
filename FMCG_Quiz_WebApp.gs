// ═══════════════════════════════════════════════════════════════════════
//  FMCG SALES QUIZ — Google Apps Script Web App
//  Chandpur Corporation Ltd. | Ahmed Halim Podcast
//
//  সেটআপ নির্দেশনা:
//  ১. Google Sheets খুলুন (FMCG_Quiz_Template.xlsx আপলোড করুন)
//  ২. Extensions → Apps Script-এ যান
//  ৩. এই পুরো কোড পেস্ট করুন
//  ৪. Deploy → New Deployment → Web App হিসেবে পাবলিশ করুন
//  ৫. "Anyone" অ্যাক্সেস দিন
//  ৬. লিংক কপি করে স্টাফদের পাঠান
// ═══════════════════════════════════════════════════════════════════════

const SHEET_QUESTIONS = "📝 Questions";
const SHEET_RESULTS   = "📊 Results";
const QUIZ_TITLE      = "FMCG Sales Quiz";
const COMPANY         = "";

// ── doGet: Main entry point ─────────────────────────────────────────
function doGet(e) {
  const page = e.parameter.page || "quiz";
  const html = page === "result"
    ? buildResultPage(e.parameter)
    : buildQuizPage();
  return HtmlService.createHtmlOutput(html)
    .setTitle(`${QUIZ_TITLE} | ${COMPANY}`)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── doPost: Save answers ────────────────────────────────────────────
function doPost(e) {
  try {
    const data    = JSON.parse(e.postData.contents);
    const result  = saveAnswers(data);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── Read questions from sheet ───────────────────────────────────────
function getQuestions() {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const sh  = ss.getSheetByName(SHEET_QUESTIONS);
  const data = sh.getRange(5, 1, 20, 9).getValues();
  return data.map(row => ({
    id:      row[0],
    q:       row[1],
    optA:    row[2],
    optB:    row[3],
    optC:    row[4],
    optD:    row[5],
    correct: String(row[6]).trim().toUpperCase(),
    cat:     row[7],
    exp:     row[8]
  })).filter(q => q.q);
}

// ── Save answers to Results sheet ──────────────────────────────────
function saveAnswers(data) {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const sh  = ss.getSheetByName(SHEET_RESULTS);
  const qs  = getQuestions();

  const now    = Utilities.formatDate(new Date(), "Asia/Dhaka", "dd-MMM-yyyy HH:mm");
  const answers = data.answers || {};
  let correct  = 0;

  const ansRow = [
    sh.getLastRow(),      // serial
    data.name || "—",
    data.email || "—",
    now
  ];

  qs.forEach(q => {
    const given = (answers[q.id] || "").toUpperCase();
    const isOk  = given === q.correct;
    if (isOk) correct++;
    ansRow.push(isOk ? "✓" : `✗(${given||"?"})`);
  });

  const pct   = Math.round(correct / qs.length * 100);
  const grade = pct >= 80 ? "A — চমৎকার" : pct >= 60 ? "B — ভালো" : pct >= 40 ? "C — মধ্যম" : "F — আরও পড়ুন";

  ansRow.push(correct, pct + "%", grade);
  sh.appendRow(ansRow);

  // Color the row
  const lastRow = sh.getLastRow();
  const bgColor = pct >= 80 ? "#E8F5E9" : pct >= 60 ? "#FFF8E1" : "#FFEBEE";
  sh.getRange(lastRow, 1, 1, ansRow.length).setBackground(bgColor);

  return { success: true, correct, total: qs.length, pct, grade, name: data.name };
}

// ── Build Quiz HTML Page ────────────────────────────────────────────
function buildQuizPage() {
  const questions = getQuestions();
  const scriptUrl = ScriptApp.getService().getUrl();

  const questionCards = questions.map((q, i) => `
    <div class="q-card" id="qcard${i}">
      <div class="q-header">
        <div class="q-num">${i + 1}</div>
        <div class="q-body">
          <div class="q-text">${q.q}</div>
          <div class="q-cat">${q.cat}</div>
        </div>
      </div>
      <div class="opts">
        ${['A','B','C','D'].map(k => `
          <label class="opt" id="opt${i}_${k}">
            <input type="radio" name="q${q.id}" value="${k}" onchange="markAnswered(${i},'${k}')">
            <span class="opt-key">${k}</span>
            <span class="opt-text">${q['opt'+k]}</span>
          </label>`).join('')}
      </div>
      <div class="q-status" id="status${i}"></div>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${QUIZ_TITLE}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{
    --navy:#0D1B4B;--teal:#0D6E6E;--gold:#C9A227;
    --green:#1A7A4A;--red:#C0392B;--amber:#E08C1A;
    --bg:#F4F6FB;--white:#fff;--border:#E2E8F0;
    --text:#1E293B;--muted:#64748B;
  }
  body{font-family:'Segoe UI',Arial,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}

  /* HEADER */
  .header{background:var(--navy);color:#fff;padding:0;position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,.25)}
  .header-inner{max-width:900px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
  .header h1{font-size:17px;font-weight:700;letter-spacing:-.3px}
  .header p{font-size:11px;color:rgba(255,255,255,.65);margin-top:2px}
  .score-badge{background:var(--gold);color:var(--navy);font-size:13px;font-weight:700;padding:6px 16px;border-radius:20px;white-space:nowrap}

  /* PROGRESS */
  .progress-wrap{background:rgba(255,255,255,.1);height:4px;margin:0}
  .progress-fill{height:100%;background:var(--gold);transition:width .3s;width:0%}

  /* MAIN */
  .main{max-width:900px;margin:0 auto;padding:20px 16px 100px}

  /* PARTICIPANT INFO */
  .info-card{background:var(--white);border-radius:14px;padding:20px;margin-bottom:20px;border:1px solid var(--border);box-shadow:0 2px 8px rgba(0,0,0,.06)}
  .info-card h2{font-size:14px;font-weight:600;color:var(--navy);margin-bottom:14px;display:flex;align-items:center;gap:6px}
  .info-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .field label{display:block;font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
  .field input{width:100%;padding:10px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:14px;font-family:inherit;color:var(--text);transition:border-color .2s;background:var(--white)}
  .field input:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px rgba(13,110,110,.12)}

  /* QUESTION CARD */
  .q-card{background:var(--white);border-radius:14px;padding:18px;margin-bottom:12px;border:1px solid var(--border);box-shadow:0 1px 4px rgba(0,0,0,.04);transition:border-color .2s,box-shadow .2s}
  .q-card.answered{border-color:var(--teal)}
  .q-header{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px}
  .q-num{min-width:32px;height:32px;border-radius:50%;background:var(--bg);color:var(--navy);font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;border:1.5px solid var(--border)}
  .q-num.done{background:var(--teal);color:#fff;border-color:var(--teal)}
  .q-body{flex:1}
  .q-text{font-size:14px;font-weight:600;color:var(--text);line-height:1.55}
  .q-cat{font-size:11px;color:var(--muted);margin-top:4px;background:var(--bg);display:inline-block;padding:2px 8px;border-radius:4px}
  .q-status{font-size:11px;color:var(--teal);margin-top:8px;font-weight:500;min-height:16px}

  /* OPTIONS */
  .opts{display:flex;flex-direction:column;gap:7px}
  .opt{display:flex;align-items:flex-start;gap:10px;padding:10px 14px;border-radius:9px;border:1.5px solid var(--border);cursor:pointer;transition:all .15s;background:var(--bg)}
  .opt input[type=radio]{display:none}
  .opt-key{font-weight:700;font-size:12px;color:var(--muted);min-width:18px;flex-shrink:0;margin-top:1px;background:var(--white);border:1px solid var(--border);width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:all .15s}
  .opt-text{font-size:13px;color:var(--text);line-height:1.45;flex:1}
  .opt:hover{border-color:var(--teal);background:#f0f9f9}
  .opt:hover .opt-key{border-color:var(--teal);color:var(--teal)}
  .opt.selected{border-color:var(--teal);background:#E0F5F5}
  .opt.selected .opt-key{background:var(--teal);color:#fff;border-color:var(--teal)}

  /* STICKY FOOTER */
  .footer-bar{position:fixed;bottom:0;left:0;right:0;background:var(--white);border-top:1px solid var(--border);padding:12px 20px;z-index:100;box-shadow:0 -4px 16px rgba(0,0,0,.08)}
  .footer-inner{max-width:900px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
  .answered-count{font-size:13px;color:var(--muted)}
  .answered-count strong{color:var(--navy)}
  .submit-btn{background:var(--teal);color:#fff;border:none;border-radius:10px;padding:12px 28px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;display:flex;align-items:center;gap:8px}
  .submit-btn:hover{background:#0a5a5a;transform:translateY(-1px)}
  .submit-btn:disabled{background:#999;cursor:not-allowed;transform:none}

  /* MODAL */
  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;display:none}
  .modal-bg.show{display:flex}
  .modal{background:var(--white);border-radius:16px;padding:28px;max-width:500px;width:100%;text-align:center}
  .modal h2{font-size:20px;color:var(--navy);margin-bottom:8px}
  .modal p{font-size:14px;color:var(--muted);margin-bottom:20px;line-height:1.6}
  .result-score{font-size:56px;font-weight:700;line-height:1;margin:16px 0}
  .result-grade{font-size:18px;font-weight:600;padding:8px 20px;border-radius:20px;display:inline-block;margin-bottom:16px}
  .grade-A{background:#E8F5E9;color:var(--green)}
  .grade-B{background:#FFF8E1;color:var(--amber)}
  .grade-C{background:#FFF3E0;color:#E65100}
  .grade-F{background:#FFEBEE;color:var(--red)}
  .modal-btn{background:var(--navy);color:#fff;border:none;border-radius:10px;padding:12px 28px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:8px;width:100%}
  .loading{font-size:14px;color:var(--muted);margin:12px 0}
  .spinner{display:inline-block;width:20px;height:20px;border:3px solid var(--border);border-top-color:var(--teal);border-radius:50%;animation:spin .7s linear infinite;vertical-align:middle;margin-right:8px}
  @keyframes spin{to{transform:rotate(360deg)}}

  /* UNANSWERED HIGHLIGHT */
  .q-card.unanswered-warn{border-color:var(--red);animation:shake .3s}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}

  @media(max-width:500px){
    .info-row{grid-template-columns:1fr}
    .header h1{font-size:14px}
  }
</style>
</head>
<body>

<div class="header">
  <div class="header-inner">
    <div>
      <h1>${QUIZ_TITLE}</h1>
      <p>${COMPANY} | ২০ প্রশ্ন — প্রতিটিতে ৪টি বিকল্প</p>
    </div>
    <div class="score-badge" id="scoreBadge">০/২০ উত্তর দেওয়া হয়েছে</div>
  </div>
  <div class="progress-wrap"><div class="progress-fill" id="progressBar"></div></div>
</div>

<div class="main">
  <div class="info-card">
    <h2>👤 আপনার তথ্য দিন</h2>
    <div class="info-row">
      <div class="field">
        <label>আপনার নাম</label>
        <input type="text" id="userName" placeholder="পূর্ণ নাম লিখুন" required>
      </div>
      <div class="field">
        <label>ইমেইল / ফোন নম্বর</label>
        <input type="text" id="userEmail" placeholder="ইমেইল বা মোবাইল নম্বর">
      </div>
    </div>
  </div>

  ${questionCards}
</div>

<div class="footer-bar">
  <div class="footer-inner">
    <div class="answered-count"><strong id="ansCount">০</strong>/২০ প্রশ্নের উত্তর দেওয়া হয়েছে</div>
    <button class="submit-btn" onclick="submitQuiz()" id="submitBtn">
      পরীক্ষা জমা দিন →
    </button>
  </div>
</div>

<div class="modal-bg" id="modalBg">
  <div class="modal" id="modalContent">
    <div class="loading"><span class="spinner"></span>ফলাফল গণনা হচ্ছে...</div>
  </div>
</div>

<script>
const SCRIPT_URL = "${scriptUrl}";
const TOTAL = ${questions.length};
const answered = {};

function markAnswered(qIndex, key) {
  answered[qIndex + 1] = key;
  const card = document.getElementById('qcard' + qIndex);
  card.classList.add('answered');
  card.classList.remove('unanswered-warn');
  document.getElementById('qnum' + qIndex) && (document.getElementById('qnum' + qIndex).classList.add('done'));
  document.querySelectorAll('#qcard' + qIndex + ' .opt').forEach(o => o.classList.remove('selected'));
  document.querySelector('#opt' + qIndex + '_' + key) && document.querySelector('#opt' + qIndex + '_' + key).classList.add('selected');
  document.getElementById('status' + qIndex).textContent = '✓ উত্তর দেওয়া হয়েছে';
  const qnum = document.getElementById('qcard' + qIndex + ' .q-num') || card.querySelector('.q-num');
  if(qnum) { qnum.classList.add('done'); }
  updateProgress();
}

function updateProgress() {
  const count = Object.keys(answered).length;
  document.getElementById('ansCount').textContent = count;
  document.getElementById('scoreBadge').textContent = count + '/' + TOTAL + ' উত্তর দেওয়া হয়েছে';
  document.getElementById('progressBar').style.width = (count / TOTAL * 100) + '%';
}

function submitQuiz() {
  const name = document.getElementById('userName').value.trim();
  if (!name) { document.getElementById('userName').focus(); alert('অনুগ্রহ করে আপনার নাম দিন।'); return; }

  const unanswered = [];
  for(let i=1;i<=TOTAL;i++) { if(!answered[i]) unanswered.push(i); }
  if (unanswered.length > 0) {
    const warn = confirm('আপনি ' + unanswered.length + 'টি প্রশ্নের উত্তর দেননি (প্রশ্ন: ' + unanswered.slice(0,5).join(', ') + (unanswered.length>5?'...':'') + ')।\\n\\nতারপরও জমা দিতে চান?');
    if (!warn) {
      document.getElementById('qcard' + (unanswered[0]-1)).scrollIntoView({behavior:'smooth',block:'center'});
      document.getElementById('qcard' + (unanswered[0]-1)).classList.add('unanswered-warn');
      return;
    }
  }

  document.getElementById('submitBtn').disabled = true;
  document.getElementById('modalBg').classList.add('show');

  const payload = {
    name: name,
    email: document.getElementById('userEmail').value.trim(),
    answers: answered
  };

  fetch(SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
  .then(r => r.json())
  .then(result => showResult(result))
  .catch(err => showResult({ success: false, error: err.message }));
}

function showResult(r) {
  if (!r.success) {
    document.getElementById('modalContent').innerHTML =
      '<h2>⚠️ সমস্যা হয়েছে</h2><p>' + (r.error||'অজানা ত্রুটি') + '</p><button class="modal-btn" onclick="document.getElementById(\'modalBg\').classList.remove(\'show\');document.getElementById(\'submitBtn\').disabled=false;">ঠিক আছে</button>';
    return;
  }
  const pct = r.pct;
  const gradeClass = pct>=80?'grade-A':pct>=60?'grade-B':pct>=40?'grade-C':'grade-F';
  const emoji = pct>=80?'🏆':pct>=60?'👍':pct>=40?'📚':'💪';
  document.getElementById('modalContent').innerHTML = \`
    <div style="font-size:40px;margin-bottom:8px">\${emoji}</div>
    <h2>\${r.name} — পরীক্ষা সম্পন্ন!</h2>
    <div class="result-score" style="color:\${pct>=80?'#1A7A4A':pct>=60?'#E08C1A':pct>=40?'#E65100':'#C0392B'}">\${r.correct}<span style="font-size:28px;color:#999">/\${r.total}</span></div>
    <div class="result-grade \${gradeClass}">\${r.grade}</div>
    <p style="font-size:13px;color:#555;margin-bottom:16px">স্কোর: <strong>\${pct}%</strong> | \${r.correct}টি সঠিক, \${r.total-r.correct}টি ভুল<br>ফলাফল Results শীটে সংরক্ষণ হয়েছে।</p>
    <button class="modal-btn" onclick="window.location.reload()">আবার চেষ্টা করুন</button>
  \`;
}

// Allow selecting option by clicking anywhere on the label
document.querySelectorAll('.opt').forEach(opt => {
  opt.addEventListener('click', function() {
    const radio = this.querySelector('input[type=radio]');
    if(radio) { radio.checked = true; radio.dispatchEvent(new Event('change')); }
  });
});
</script>
</body>
</html>`;
}

// ── Build Result Page (optional standalone) ──────────────────────────
function buildResultPage(params) {
  const correct = parseInt(params.correct) || 0;
  const total   = parseInt(params.total) || 20;
  const pct     = Math.round(correct / total * 100);
  const name    = params.name || "অংশগ্রহণকারী";
  const grade   = pct >= 80 ? "A — চমৎকার" : pct >= 60 ? "B — ভালো" : pct >= 40 ? "C — মধ্যম" : "F — আরও পড়ুন";
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ফলাফল</title></head>
  <body style="font-family:Arial;text-align:center;padding:40px;background:#F4F6FB">
  <h1 style="color:#0D1B4B">${COMPANY}</h1>
  <h2>${QUIZ_TITLE}</h2>
  <div style="font-size:64px;color:#0D6E6E;font-weight:700">${correct}/${total}</div>
  <div style="font-size:20px;margin:12px 0">${name} | স্কোর: ${pct}%</div>
  <div style="font-size:18px;background:#E8F5E9;padding:10px 24px;border-radius:20px;display:inline-block">${grade}</div>
  </body></html>`;
}

// ════════════════════════════════════════════════════════════════════
//  সেটআপ নির্দেশনা (বাংলায়):
//
//  ধাপ ১: FMCG_Quiz_Template.xlsx → Google Sheets-এ আপলোড করুন
//  ধাপ ২: Extensions → Apps Script → এই কোড পেস্ট করুন → Save
//  ধাপ ৩: Deploy → New Deployment
//           Type: Web App
//           Execute as: Me
//           Who has access: Anyone
//  ধাপ ৪: Deploy বাটনে ক্লিক → URL কপি করুন
//  ধাপ ৫: URL স্টাফদের WhatsApp/Email-এ পাঠান
//
//  প্রশ্ন পরিবর্তন করতে:
//  "📝 Questions" শীটে B-G কলাম আপডেট করুন
//  Apps Script → Deploy → New Deployment (আবার)
//
//  ফলাফল দেখতে:
//  "📊 Results" শীটে প্রতিটি অংশগ্রহণকারীর উত্তর দেখুন
// ════════════════════════════════════════════════════════════════════
