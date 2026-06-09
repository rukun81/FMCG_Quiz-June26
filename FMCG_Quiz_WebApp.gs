<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>FMCG Sales Quiz — Chandpur Corporation Ltd.</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --navy:#0D1B4B;--teal:#0D6E6E;--gold:#C9A227;
  --green:#1A7A4A;--red:#C0392B;--amber:#E08C1A;
  --bg:#F4F6FB;--white:#fff;--border:#E2E8F0;
  --text:#1E293B;--muted:#64748B;--light:#F8FAFC;
}
body{font-family:'Segoe UI',Arial,sans-serif;background:var(--bg);color:var(--text);min-height:100vh}

/* HEADER */
.header{background:var(--navy);color:#fff;position:sticky;top:0;z-index:100;box-shadow:0 2px 16px rgba(0,0,0,.35)}
.header-inner{max-width:860px;margin:0 auto;padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}
.header h1{font-size:17px;font-weight:700;line-height:1.3}
.header p{font-size:11px;color:rgba(255,255,255,.6);margin-top:2px}
.score-pill{background:var(--gold);color:var(--navy);font-size:13px;font-weight:700;padding:6px 16px;border-radius:20px;white-space:nowrap;flex-shrink:0}
.progress-bar{height:4px;background:rgba(255,255,255,.15)}
.progress-fill{height:100%;background:var(--gold);transition:width .35s;width:0%}

/* MAIN */
.main{max-width:860px;margin:0 auto;padding:20px 16px 100px}

/* INFO CARD */
.info-card{background:var(--white);border-radius:14px;padding:20px;margin-bottom:18px;border:1px solid var(--border);box-shadow:0 2px 8px rgba(0,0,0,.05)}
.info-card h2{font-size:14px;font-weight:600;color:var(--navy);margin-bottom:14px;display:flex;align-items:center;gap:6px}
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.field label{display:block;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px}
.field input{width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:9px;font-size:14px;font-family:inherit;color:var(--text);background:var(--white);transition:border-color .2s}
.field input:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px rgba(13,110,110,.1)}

/* QUESTION CARD */
.q-card{background:var(--white);border-radius:14px;padding:18px 18px 14px;margin-bottom:11px;border:1.5px solid var(--border);transition:border-color .2s,box-shadow .2s}
.q-card.answered{border-color:var(--teal)}
.q-card.revealed{pointer-events:none}
.q-header{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px}
.q-num{min-width:32px;height:32px;border-radius:50%;background:var(--bg);color:var(--navy);font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid var(--border);transition:all .2s;margin-top:1px}
.q-num.done{background:var(--teal);color:#fff;border-color:var(--teal)}
.q-text{font-size:14px;font-weight:600;color:var(--text);line-height:1.55}
.q-meta{display:flex;align-items:center;gap:6px;margin-top:5px}
.q-cat{font-size:10px;color:var(--muted);background:var(--bg);padding:2px 9px;border-radius:12px;border:1px solid var(--border)}

/* OPTIONS */
.opts{display:flex;flex-direction:column;gap:7px}
.opt{display:flex;align-items:flex-start;gap:10px;padding:11px 14px;border-radius:9px;border:1.5px solid var(--border);cursor:pointer;background:var(--bg);transition:all .15s;user-select:none}
.opt:hover{border-color:var(--teal);background:#EFF9F9}
.opt.selected{border-color:var(--teal);background:#E0F5F5}
.opt.correct-ans{background:#E8F5E9;border-color:var(--green)}
.opt.correct-ans .opt-key{background:var(--green);color:#fff;border-color:var(--green)}
.opt.wrong-ans{background:#FFEBEE;border-color:var(--red)}
.opt.wrong-ans .opt-key{background:var(--red);color:#fff;border-color:var(--red)}
.opt-key{font-weight:700;font-size:12px;color:var(--muted);width:26px;height:26px;border-radius:50%;background:var(--white);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s}
.opt.selected .opt-key{background:var(--teal);color:#fff;border-color:var(--teal)}
.opt-text{font-size:13px;line-height:1.45;flex:1;color:var(--text)}

/* EXPLANATION */
.exp-box{margin-top:10px;padding:10px 13px;background:#EEF9F6;border-left:3px solid var(--teal);border-radius:0 8px 8px 0;font-size:12px;color:#374151;line-height:1.55;display:none}
.exp-box.show{display:block}
.q-status{font-size:11px;margin-top:8px;font-weight:500;min-height:16px;color:var(--teal)}

/* FOOTER BAR */
.footer-bar{position:fixed;bottom:0;left:0;right:0;background:var(--white);border-top:1px solid var(--border);padding:12px 20px;z-index:100;box-shadow:0 -4px 16px rgba(0,0,0,.1)}
.footer-inner{max-width:860px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
.ans-info{font-size:13px;color:var(--muted)}
.ans-info strong{color:var(--navy);font-size:15px}
.submit-btn{background:var(--teal);color:#fff;border:none;border-radius:10px;padding:13px 30px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .2s;display:flex;align-items:center;gap:8px}
.submit-btn:hover:not(:disabled){background:#0a5959;transform:translateY(-1px);box-shadow:0 4px 12px rgba(13,110,110,.35)}
.submit-btn:disabled{background:#94A3B8;cursor:not-allowed;transform:none;box-shadow:none}

/* LOADING OVERLAY */
.overlay{position:fixed;inset:0;background:rgba(13,27,75,.75);z-index:200;display:none;align-items:center;justify-content:center;padding:20px}
.overlay.show{display:flex}
.overlay-card{background:var(--white);border-radius:18px;padding:32px;max-width:480px;width:100%;text-align:center}
.spinner{width:48px;height:48px;border:4px solid var(--border);border-top-color:var(--teal);border-radius:50%;animation:spin .7s linear infinite;margin:0 auto 16px}
@keyframes spin{to{transform:rotate(360deg)}}
.overlay-card h3{font-size:18px;color:var(--navy);margin-bottom:8px}
.overlay-card p{font-size:13px;color:var(--muted);line-height:1.6}

/* RESULT SCREEN */
.result-screen{display:none;text-align:center;max-width:720px;margin:0 auto;padding:20px 16px 40px}
.result-screen.show{display:block}
.result-header{background:var(--navy);border-radius:16px;padding:30px 24px;margin-bottom:20px;color:#fff}
.result-icon{font-size:56px;margin-bottom:12px}
.result-name{font-size:22px;font-weight:700;margin-bottom:4px}
.result-company{font-size:12px;opacity:.6;margin-bottom:16px}
.result-score{font-size:64px;font-weight:700;line-height:1;color:var(--gold);margin-bottom:6px}
.result-pct{font-size:16px;opacity:.8}
.grade-badge{display:inline-block;padding:9px 24px;border-radius:22px;font-size:16px;font-weight:700;margin:16px 0}
.grade-A{background:#E8F5E9;color:var(--green)}
.grade-B{background:#FFF8E1;color:var(--amber)}
.grade-C{background:#FFF3E0;color:#E65100}
.grade-F{background:#FFEBEE;color:var(--red)}
.sync-status{font-size:12px;padding:8px 16px;border-radius:20px;display:inline-flex;align-items:center;gap:6px;margin-bottom:16px}
.sync-ok{background:#E8F5E9;color:var(--green)}
.sync-err{background:#FFEBEE;color:var(--red)}
.sync-pending{background:#E3F2FD;color:#1565C0}

/* DETAIL TABLE */
.detail-card{background:var(--white);border-radius:14px;overflow:hidden;border:1px solid var(--border);margin-bottom:16px;text-align:left}
.detail-card-title{background:var(--navy);color:#fff;padding:12px 16px;font-size:13px;font-weight:600}
.detail-table{width:100%;border-collapse:collapse;font-size:12px}
.detail-table th{background:var(--bg);color:var(--muted);padding:7px 10px;font-weight:600;border-bottom:1px solid var(--border);text-align:left}
.detail-table td{padding:7px 10px;border-bottom:0.5px solid var(--border);color:var(--text)}
.detail-table tr:last-child td{border-bottom:none}
.detail-table tr:nth-child(even) td{background:var(--bg)}
.ok{color:var(--green);font-weight:700}
.ng{color:var(--red);font-weight:700}
.retry-btn{background:var(--navy);color:#fff;border:none;border-radius:10px;padding:13px 32px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:8px;transition:all .2s}
.retry-btn:hover{background:#1A2E6B;transform:translateY(-1px)}

/* WARN */
.warn-shake{animation:shake .35s;border-color:var(--red)!important}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@media(max-width:520px){.info-grid{grid-template-columns:1fr}.header h1{font-size:14px}.result-score{font-size:48px}}
</style>
</head>
<body>

<!-- ══ QUIZ SECTION ══════════════════════════════════════════════ -->
<div id="quizSection">
  <div class="header">
    <div class="header-inner">
      <div>
        <h1>FMCG Sales Quiz — Ahmed Halim Podcast</h1>
        <p>Chandpur Corporation Ltd. &nbsp;|&nbsp; Sales Team Assessment &nbsp;|&nbsp; ২০ MCQ</p>
      </div>
      <div class="score-pill" id="scorePill">০/২০</div>
    </div>
    <div class="progress-bar"><div class="progress-fill" id="progFill"></div></div>
  </div>

  <div class="main">
    <div class="info-card">
      <h2>👤 আপনার তথ্য দিন</h2>
      <div class="info-grid">
        <div class="field">
          <label>আপনার নাম *</label>
          <input id="uName" type="text" placeholder="পূর্ণ নাম বাংলায় বা ইংরেজিতে">
        </div>
        <div class="field">
          <label>ইমেইল / ফোন নম্বর</label>
          <input id="uEmail" type="text" placeholder="ইমেইল বা মোবাইল নম্বর">
        </div>
      </div>
    </div>
    <div id="questionsArea"></div>
  </div>

  <div class="footer-bar">
    <div class="footer-inner">
      <div class="ans-info">
        <strong id="ansCount">০</strong>/২০ প্রশ্নের উত্তর দেওয়া হয়েছে
      </div>
      <button class="submit-btn" id="submitBtn" onclick="submitQuiz()">
        পরীক্ষা জমা দিন &nbsp;→
      </button>
    </div>
  </div>
</div>

<!-- ══ LOADING OVERLAY ════════════════════════════════════════════ -->
<div class="overlay" id="loadingOverlay">
  <div class="overlay-card">
    <div class="spinner"></div>
    <h3>ফলাফল সংরক্ষণ হচ্ছে...</h3>
    <p>আপনার উত্তর Google Sheets-এ জমা হচ্ছে।<br>অনুগ্রহ করে অপেক্ষা করুন।</p>
  </div>
</div>

<!-- ══ RESULT SECTION ═════════════════════════════════════════════ -->
<div class="result-screen" id="resultSection">
  <div class="result-header">
    <div class="result-icon" id="rIcon"></div>
    <div class="result-name" id="rName"></div>
    <div class="result-company">Chandpur Corporation Ltd. — FMCG Sales Quiz</div>
    <div class="result-score" id="rScore"></div>
    <div class="result-pct" id="rPct"></div>
  </div>
  <div class="grade-badge" id="rGrade"></div>
  <br>
  <div class="sync-status" id="syncStatus"></div>

  <div class="detail-card">
    <div class="detail-card-title">📋 প্রতিটি প্রশ্নের বিস্তারিত ফলাফল</div>
    <table class="detail-table">
      <thead>
        <tr>
          <th style="width:30px">#</th>
          <th>প্রশ্ন</th>
          <th style="width:110px">সঠিক উত্তর</th>
          <th style="width:110px">আপনার উত্তর</th>
          <th style="width:60px">ফলাফল</th>
        </tr>
      </thead>
      <tbody id="rBody"></tbody>
    </table>
  </div>
  <button class="retry-btn" onclick="location.reload()">🔄 আবার চেষ্টা করুন</button>
</div>

<script>
// ══════════════════════════════════════════════════════════════════
//  ⚠️  এখানে আপনার Google Apps Script Deployment URL বসান
//  Deploy করার পর পাওয়া URL টি নিচে GOOGLE_SCRIPT_URL এ দিন
// ══════════════════════════════════════════════════════════════════
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzyBma5umP09cnsj4dp0nyW53a9VlQDn8vzWbZJYIi8JzKzJVB5/exec";
// উদাহরণ:
// const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXX/exec";

// ════════════════════════════════════════════
//  QUIZ DATA — এখানে প্রশ্ন পরিবর্তন করুন
// ════════════════════════════════════════════
const QUESTIONS = [
  {id:1,q:"FMCG-তে SR-এর প্রধান কাজ কোনটি?",A:"শুধু মাল ডেলিভারি দেওয়া",B:"টার্গেট অর্জন, সম্পর্ক তৈরি ও কালেকশন করা",C:"অফিসে বসে রিপোর্ট তৈরি করা",D:"শুধু নতুন ডিলার খোঁজা",ans:"B",cat:"মূল ধারণা",exp:"SR-এর মূল দায়িত্ব হলো বিক্রয় টার্গেট অর্জন, ডিলারের সাথে সম্পর্ক তৈরি এবং সময়মতো কালেকশন নিশ্চিত করা।"},
  {id:2,q:"FMCG সেলসে 'চাপাবাজি' পদ্ধতিতে বিক্রির সমস্যা কী?",A:"বেশি পণ্য বিক্রি হয়",B:"ডিলারের সাথে দীর্ঘমেয়াদি সম্পর্ক নষ্ট হয়",C:"কোম্পানির লাভ বাড়ে",D:"কালেকশন সহজ হয়",ans:"B",cat:"বিক্রয় কৌশল",exp:"চাপে বিক্রি করলে স্বল্পমেয়াদে সেলস হয়, কিন্তু ডিলার বিশ্বাস হারায়।"},
  {id:3,q:"একজন SR কীভাবে ডিলারের সাথে সম্পর্ক উন্নত করতে পারেন?",A:"বেশি ছাড় দিয়ে",B:"নিয়মিত ভিজিট ও সমস্যা সমাধান করে",C:"শুধু ফোনে যোগাযোগ রেখে",D:"অন্য ডিলারের গল্প বলে",ans:"B",cat:"কাস্টমার রিলেশন",exp:"নিয়মিত মাঠে যাওয়া, ডিলারের সমস্যা শুনে সমাধান করা এবং বিশ্বস্ততা অর্জনই মূল চাবিকাঠি।"},
  {id:4,q:"Ahmed Halim কোন প্রতিষ্ঠানে GM, Sales & Marketing হিসেবে কর্মরত?",A:"PRAN-RFL Group",B:"Square Group",C:"Meghna Group of Industries",D:"ACI Limited",ans:"C",cat:"অতিথি পরিচয়",exp:"Ahmed Halim বর্তমানে Meghna Group of Industries-এ GM, Sales & Marketing পদে কর্মরত।"},
  {id:5,q:"FMCG সেলসে 'সেকেন্ডারি সেলস' বলতে কী বোঝায়?",A:"কোম্পানি থেকে ডিস্ট্রিবিউটরে বিক্রয়",B:"ডিস্ট্রিবিউটর থেকে রিটেইলারে বিক্রয়",C:"রিটেইলার থেকে কনজিউমারে বিক্রয়",D:"কোম্পানি থেকে সরাসরি কনজিউমারে বিক্রয়",ans:"B",cat:"FMCG ধারণা",exp:"Primary = কোম্পানি→ডিস্ট্রিবিউটর। Secondary = ডিস্ট্রিবিউটর→রিটেইলার।"},
  {id:6,q:"টার্গেট অর্জনে ব্যর্থ হলে SR-এর প্রথম করণীয় কী?",A:"পদত্যাগ করা",B:"রুট পরিবর্তন করা",C:"কারণ বিশ্লেষণ করে অ্যাকশন প্ল্যান তৈরি করা",D:"সুপারভাইজারকে দোষ দেওয়া",ans:"C",cat:"পারফরম্যান্স",exp:"ব্যর্থতার কারণ খুঁজে বের করা এবং সেই অনুযায়ী পরিকল্পনা করাই সঠিক পদক্ষেপ।"},
  {id:7,q:"FMCG সেলস ক্যারিয়ারে সফল হওয়ার জন্য সবচেয়ে জরুরি গুণ কোনটি?",A:"শুধু শিক্ষাগত যোগ্যতা",B:"পরিশ্রম, সততা ও শেখার মনোভাব",C:"ভালো পোশাক পরা",D:"উচ্চপদস্থদের সাথে পরিচয়",ans:"B",cat:"ক্যারিয়ার দক্ষতা",exp:"কঠোর পরিশ্রম, সততা এবং প্রতিনিয়ত শেখার আগ্রহই দীর্ঘমেয়াদি সাফল্যের ভিত্তি।"},
  {id:8,q:"ডিলার কালেকশনে বিলম্ব হলে SR কী করবেন?",A:"ডিলারকে নতুন মাল দেওয়া বন্ধ রাখবেন",B:"সরাসরি বাদ দিয়ে দেবেন",C:"বিনয়ের সাথে কারণ জেনে সমাধান খুঁজবেন",D:"ম্যানেজারকে না জানিয়ে নিজে সমাধান করবেন",ans:"C",cat:"কালেকশন ম্যানেজমেন্ট",exp:"কারণ বুঝে সহানুভূতির সাথে সমাধান করলে সম্পর্কও ভালো থাকে।"},
  {id:9,q:"'Route Plan' বা রুট পরিকল্পনার মূল উদ্দেশ্য কী?",A:"SR-এর যাতায়াত কমানো",B:"সব ডিলারের নিয়মিত ভিজিট নিশ্চিত করা",C:"শুধু বড় ডিলারদের দেখা করা",D:"রিপোর্ট লেখা সহজ করা",ans:"B",cat:"মাঠ কার্যক্রম",exp:"সুনির্দিষ্ট রুট প্ল্যান থাকলে প্রতিটি ডিলার নিয়মিত কভার হয়।"},
  {id:10,q:"FMCG-তে 'Numeric Distribution' বলতে কী বোঝায়?",A:"মোট বিক্রয়ের পরিমাণ",B:"মোট আউটলেটের মধ্যে পণ্য আছে এমনটির শতকরা হার",C:"পণ্যের দামের তালিকা",D:"মাসিক টার্গেটের পরিমাণ",ans:"B",cat:"FMCG ধারণা",exp:"Numeric Distribution = (পণ্য আছে এমন আউটলেট ÷ মোট আউটলেট) × ১০০।"},
  {id:11,q:"একজন নতুন SR কীভাবে দ্রুত শিখতে পারেন?",A:"শুধু বই পড়ে",B:"মাঠে অভিজ্ঞ SR-এর সাথে কাজ করে ও প্রতিদিন রিভিউ করে",C:"অফিসে বসে থেকে",D:"সোশ্যাল মিডিয়া দেখে",ans:"B",cat:"ক্যারিয়ার দক্ষতা",exp:"মাঠে অভিজ্ঞদের সাথে কাজ করাই নতুন SR-এর সবচেয়ে দ্রুত শেখার পথ।"},
  {id:12,q:"'Shelf Visibility' কেন গুরুত্বপূর্ণ?",A:"কনজিউমার পণ্য দেখে কিনার সিদ্ধান্ত নেয় বলে",B:"দামি পণ্যের জন্য শুধু প্রযোজ্য",C:"শুধু সুপারশপে কাজ করে",D:"SR-এর কাজ কমায়",ans:"A",cat:"মার্কেটিং",exp:"৭০% ক্রয় সিদ্ধান্ত শেলফের কাছে হয়। পণ্য চোখের সামনে থাকলে বিক্রয় বাড়ে।"},
  {id:13,q:"FMCG কোম্পানিতে TSO/ASM-এর প্রধান দায়িত্ব কোনটি?",A:"শুধু রিপোর্ট লেখা",B:"SR টিমকে কোচিং, মনিটরিং ও লক্ষ্য অর্জনে সহায়তা করা",C:"গুদামঘর পরিচালনা",D:"পণ্য উৎপাদন তদারক করা",ans:"B",cat:"সাংগঠনিক কাঠামো",exp:"TSO/ASM হলো মধ্যম ব্যবস্থাপক। মূল কাজ SR-দের কোচিং ও পর্যবেক্ষণ।"},
  {id:14,q:"বাজারে নতুন পণ্য লঞ্চ করার সময় SR-এর মূল কৌশল কী?",A:"সব আউটলেটে একসাথে দেওয়া",B:"Key outlet-এ আগে দিয়ে সফলতা দেখিয়ে তারপর সম্প্রসারণ করা",C:"শুধু বড় শহরে বিক্রি করা",D:"ছাড় দিয়ে জোর করে ঢোকানো",ans:"B",cat:"বিক্রয় কৌশল",exp:"Key outlet-এ সফলতার প্রমাণ তৈরি করলে অন্য ডিলারদের কাছে বিক্রি সহজ হয়।"},
  {id:15,q:"সেলস পেশায় 'Objection Handling' বলতে কী বোঝায়?",A:"কাস্টমারের আপত্তি উপেক্ষা করা",B:"কাস্টমারের আপত্তি বুঝে সমাধান দিয়ে বিক্রয় এগিয়ে নেওয়া",C:"দাম কমিয়ে দেওয়া",D:"অন্য পণ্যের সমালোচনা করা",ans:"B",cat:"বিক্রয় কৌশল",exp:"সংশয়কে তথ্য ও যুক্তি দিয়ে সমাধান করে বিক্রয়ের পথ তৈরির দক্ষতা।"},
  {id:16,q:"FMCG কোম্পানিতে 'Beat Plan' অনুসরণ না করলে কী সমস্যা হয়?",A:"বেতন কমে যায়",B:"কিছু আউটলেট ভিজিট বাদ পড়ে, বিক্রয় ও সম্পর্ক ক্ষতিগ্রস্ত হয়",C:"পণ্যের দাম বাড়ে",D:"অফিস কমে যায়",ans:"B",cat:"মাঠ কার্যক্রম",exp:"Beat Plan না মানলে আউটলেট কভার হয় না, ডিলার অসন্তুষ্ট হয়।"},
  {id:17,q:"দক্ষ FMCG সেলস লিডার হওয়ার জন্য সবচেয়ে গুরুত্বপূর্ণ নেতৃত্বের গুণ?",A:"কঠোর শাসন করা",B:"দলকে অনুপ্রাণিত করা, কোচিং দেওয়া ও উদাহরণ হওয়া",C:"শুধু নম্বর দেখা",D:"রিপোর্ট বেশি চাওয়া",ans:"B",cat:"নেতৃত্ব",exp:"সত্যিকারের নেতা নিজে উদাহরণ হন, দলকে কোচিং করেন এবং অনুপ্রেরণার উৎস হন।"},
  {id:18,q:"কোন ধরনের SR দ্রুত পদোন্নতি পান?",A:"যে শুধু টার্গেট পূরণ করেন",B:"যিনি টার্গেট পূরণের সাথে সমস্যা সমাধানে দক্ষ ও নেতৃত্বের গুণ আছেন",C:"যে বেশি দিন কাজ করেন",D:"যে ম্যানেজারের কাছের মানুষ",ans:"B",cat:"ক্যারিয়ার দক্ষতা",exp:"সমস্যা সমাধান ক্ষমতা, ইনিশিয়েটিভ এবং নেতৃত্বের সক্ষমতাই পদোন্নতির পথ।"},
  {id:19,q:"FMCG সেলসে 'কভারেজ' ও 'স্ট্রাইক রেট' এর মধ্যে পার্থক্য কী?",A:"কোনো পার্থক্য নেই",B:"Coverage = ভিজিট করা আউটলেট, Strike Rate = ভিজিটে বিক্রয়ের হার",C:"Strike Rate = মোট টার্গেট",D:"Coverage = শুধু নতুন আউটলেট",ans:"B",cat:"FMCG ধারণা",exp:"Coverage = ভিজিট সংখ্যা। Strike Rate = ভিজিটে বিক্রয়ের হার।"},
  {id:20,q:"দীর্ঘমেয়াদে FMCG সেলসে টিকে থাকতে হলে কোন বিষয়টি সবচেয়ে গুরুত্বপূর্ণ?",A:"শুধু ভালো বেতনের চাকরি খোঁজা",B:"ইন্ডাস্ট্রি জ্ঞান, আত্ম-উন্নয়ন ও নৈতিকতা বজায় রাখা",C:"প্রতিযোগীর কৌশল কপি করা",D:"শুধু কোম্পানির পরিচিতি দিয়ে বিক্রি করা",ans:"B",cat:"পেশাদারিত্ব",exp:"ইন্ডাস্ট্রির জ্ঞান, নিজেকে ক্রমাগত উন্নত করা এবং নৈতিকতার সাথে কাজ করাই দীর্ঘমেয়াদি পথ।"},
];

// ════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════
const userAnswers = {};
let submitted = false;

// ════════════════════════════════════════════
//  BUILD QUIZ
// ════════════════════════════════════════════
function buildQuiz() {
  document.getElementById('questionsArea').innerHTML =
    QUESTIONS.map((q, i) => `
      <div class="q-card" id="qc${i}">
        <div class="q-header">
          <div class="q-num" id="qn${i}">${i+1}</div>
          <div style="flex:1">
            <div class="q-text">${q.q}</div>
            <div class="q-meta"><span class="q-cat">${q.cat}</span></div>
          </div>
        </div>
        <div class="opts">
          ${['A','B','C','D'].map(k => `
            <div class="opt" id="op${i}${k}" onclick="pick(${i},'${k}')">
              <div class="opt-key">${k}</div>
              <div class="opt-text">${q[k]}</div>
            </div>`).join('')}
        </div>
        <div class="q-status" id="qs${i}"></div>
        <div class="exp-box" id="ex${i}">${q.exp}</div>
      </div>`).join('');
}

function pick(qi, key) {
  if(submitted) return;
  userAnswers[qi] = key;
  ['A','B','C','D'].forEach(k => document.getElementById('op'+qi+k).classList.remove('selected'));
  document.getElementById('op'+qi+key).classList.add('selected');
  document.getElementById('qc'+qi).classList.add('answered');
  document.getElementById('qn'+qi).classList.add('done');
  document.getElementById('qs'+qi).textContent = '✓ উত্তর নির্বাচিত হয়েছে';
  const n = Object.keys(userAnswers).length;
  document.getElementById('ansCount').textContent = n;
  document.getElementById('scorePill').textContent = n+'/20';
  document.getElementById('progFill').style.width = (n/20*100)+'%';
}

// ════════════════════════════════════════════
//  SUBMIT
// ════════════════════════════════════════════
function submitQuiz() {
  const name = document.getElementById('uName').value.trim();
  if(!name){ document.getElementById('uName').focus(); alert('অনুগ্রহ করে আপনার নাম দিন।'); return; }

  const missing = QUESTIONS.filter((_,i) => !userAnswers.hasOwnProperty(i));
  if(missing.length > 0){
    const go = confirm(missing.length+'টি প্রশ্নের উত্তর দেননি। তারপরও জমা দিতে চান?');
    if(!go){
      const idx = QUESTIONS.findIndex((_,i)=>!userAnswers.hasOwnProperty(i));
      document.getElementById('qc'+idx).scrollIntoView({behavior:'smooth',block:'center'});
      document.getElementById('qc'+idx).classList.add('warn-shake');
      setTimeout(()=>document.getElementById('qc'+idx).classList.remove('warn-shake'),400);
      return;
    }
  }

  submitted = true;
  document.getElementById('submitBtn').disabled = true;
  document.getElementById('loadingOverlay').classList.add('show');

  // Calculate result locally first
  let correct = 0;
  QUESTIONS.forEach((q,i)=>{
    if((userAnswers[i]||'') === q.ans) correct++;
  });
  const pct   = Math.round(correct/20*100);
  const grade = pct>=80?'A — চমৎকার!':pct>=60?'B — ভালো':pct>=40?'C — মধ্যম':'F — আরও পড়ুন';
  const gCls  = pct>=80?'grade-A':pct>=60?'grade-B':pct>=40?'grade-C':'grade-F';
  const emoji = pct>=80?'🏆':pct>=60?'👍':pct>=40?'📚':'💪';

  // Send to Google Sheets
  const payload = {
    name: name,
    email: document.getElementById('uEmail').value.trim() || '—',
    answers: userAnswers,
    questions: QUESTIONS.map(q=>({ans:q.ans})),
    correct: correct,
    total: 20,
    pct: pct,
    grade: grade,
    timestamp: new Date().toISOString()
  };

  // Use no-cors mode to avoid CORS issues with Google Apps Script
  const syncPromise = GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_DEPLOYMENT_URL_HERE"
    ? Promise.resolve({ok:false, _noUrl:true})
    : fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(payload)
      }).then(()=>({ok:true})).catch(e=>({ok:false, error:e.message}));

  syncPromise.then(res => {
    document.getElementById('loadingOverlay').classList.remove('show');
    showResult(correct, pct, grade, gCls, emoji, name, res);
  });
}

// ════════════════════════════════════════════
//  SHOW RESULT
// ════════════════════════════════════════════
function showResult(correct, pct, grade, gCls, emoji, name, syncRes) {
  // Reveal answers
  QUESTIONS.forEach((q,i)=>{
    const card = document.getElementById('qc'+i);
    card.classList.add('revealed');
    const given = userAnswers[i]||'';
    document.getElementById('op'+i+q.ans).classList.add('correct-ans');
    if(given && given!==q.ans) document.getElementById('op'+i+given).classList.add('wrong-ans');
    document.getElementById('ex'+i).classList.add('show');
    document.getElementById('qs'+i).textContent = given===q.ans?'✅ সঠিক':'❌ ভুল — সঠিক উত্তর: '+q.ans+') '+q[q.ans];
  });

  // Fill result screen
  document.getElementById('rIcon').textContent = emoji;
  document.getElementById('rName').textContent = name;
  const scoreEl = document.getElementById('rScore');
  scoreEl.textContent = correct+'/20';
  scoreEl.style.color = pct>=80?'#7eff8c':pct>=60?'#FFD700':pct>=40?'#FFB74D':'#FF8A80';
  document.getElementById('rPct').textContent = 'স্কোর: '+pct+'% | সঠিক: '+correct+' | ভুল: '+(20-correct);
  const gb = document.getElementById('rGrade');
  gb.textContent = grade;
  gb.className = 'grade-badge '+gCls;

  // Sync status
  const ss = document.getElementById('syncStatus');
  if(syncRes._noUrl){
    ss.textContent = '⚠️ Google Sheets URL সেটআপ করা হয়নি';
    ss.className = 'sync-status sync-err';
  } else {
    ss.textContent = '✅ ফলাফল Google Sheets-এ সংরক্ষণ হয়েছে';
    ss.className = 'sync-status sync-ok';
  }

  // Detail table
  document.getElementById('rBody').innerHTML = QUESTIONS.map((q,i)=>{
    const g=userAnswers[i]||'—'; const ok=g===q.ans;
    return `<tr>
      <td>${i+1}</td>
      <td style="font-size:11px">${q.q.length>55?q.q.substring(0,55)+'…':q.q}</td>
      <td><strong>${q.ans}) ${q[q.ans].substring(0,30)}</strong></td>
      <td>${g!=='—'?g+') '+q[g].substring(0,25):'—'}</td>
      <td class="${ok?'ok':'ng'}">${ok?'✓ সঠিক':'✗ ভুল'}</td>
    </tr>`;
  }).join('');

  document.getElementById('quizSection').style.display='none';
  document.getElementById('resultSection').classList.add('show');
  window.scrollTo({top:0,behavior:'smooth'});
}

buildQuiz();
</script>
</body>
</html>
