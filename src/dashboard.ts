export const dashboardHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>NotionOps AI — Workflow Engine</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    :root{
      --bg:#09090b;
      --s1:#131316;
      --s2:#1a1a1f;
      --s3:#222228;
      --border:rgba(255,255,255,.06);
      --bh:rgba(255,255,255,.12);
      --text:#e4e4e7;
      --muted:#71717a;
      --dim:#52525b;

      --accent:#3b82f6;
      --accent-soft:rgba(59,130,246,.1);
      --accent-border:rgba(59,130,246,.2);

      --a1:#3b82f6;--a1r:59,130,246;
      --a2:#8b5cf6;--a2r:139,92,246;
      --a3:#06b6d4;--a3r:6,182,212;
      --a4:#6366f1;--a4r:99,102,241;

      --mono:'JetBrains Mono',monospace;
      --radius:10px;
      --radius-lg:12px;
    }
    html{font-family:'Inter',system-ui,sans-serif;font-size:13px;-webkit-font-smoothing:antialiased;}
    body{background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;}

    /* layout */
    .layout{display:flex;min-height:100vh;}

    /* sidebar */
    .sidebar{
      width:220px;flex-shrink:0;
      border-right:1px solid var(--border);
      background:var(--bg);
      display:flex;flex-direction:column;
      position:fixed;top:0;left:0;bottom:0;z-index:20;
    }
    .logo{padding:20px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;}
    .logo-mark{
      width:32px;height:32px;border-radius:8px;flex-shrink:0;position:relative;overflow:hidden;
      background:linear-gradient(135deg,#1a1a2e,#000);
      border:1px solid rgba(255,255,255,.08);
    }
    .logo-mark svg{position:absolute;inset:0;width:100%;height:100%;}
    .logo-text{font-size:13px;font-weight:700;color:var(--text);line-height:1.2;}
    .logo-sub{font-size:10px;color:var(--muted);margin-top:2px;font-family:var(--mono);}

    .sb-sec{padding:12px 10px 6px;}
    .sb-label{font-size:10px;font-weight:600;color:var(--dim);text-transform:uppercase;letter-spacing:.08em;padding:0 6px;margin-bottom:4px;}
    .nav{
      display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:var(--radius);
      color:var(--muted);font-size:12px;font-weight:500;cursor:pointer;
      transition:all .15s;text-decoration:none;border:1px solid transparent;
    }
    .nav:hover{background:var(--s2);color:var(--text);}
    .nav.active{background:var(--s2);color:var(--text);border-color:var(--border);}
    .ndot{width:6px;height:6px;border-radius:50%;flex-shrink:0;opacity:.7;}

    .sb-bottom{margin-top:auto;padding:12px;border-top:1px solid var(--border);}
    .online-pill{
      display:flex;align-items:center;gap:7px;padding:8px 10px;border-radius:var(--radius);
      background:var(--s1);border:1px solid var(--border);
      font-size:10px;color:var(--muted);font-family:var(--mono);
    }
    .ldot{width:6px;height:6px;border-radius:50%;background:#22c55e;animation:pulse 2.5s ease-in-out infinite;}
    @keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}
    .sb-ts{font-size:10px;color:var(--dim);margin-top:6px;padding:0 2px;font-family:var(--mono);}

    /* main */
    .main{margin-left:220px;flex:1;display:flex;flex-direction:column;min-width:0;}

    .topbar{
      padding:14px 24px;border-bottom:1px solid var(--border);
      background:rgba(9,9,11,.85);backdrop-filter:blur(12px);
      display:flex;align-items:center;justify-content:space-between;
      position:sticky;top:0;z-index:10;
    }
    .tb-title{font-size:14px;font-weight:700;color:var(--text);}
    .tb-sub{font-size:11px;color:var(--muted);margin-top:2px;font-family:var(--mono);}
    .tb-right{display:flex;align-items:center;gap:8px;}
    .tb-sync{
      font-size:11px;color:var(--muted);background:var(--s1);
      border:1px solid var(--border);padding:6px 14px;border-radius:var(--radius);
      display:flex;align-items:center;gap:5px;cursor:pointer;transition:all .15s;font-family:var(--mono);
    }
    .tb-sync:hover{border-color:var(--bh);color:var(--text);background:var(--s2);}

    .content{padding:20px 24px;flex:1;}

    /* stat cards */
    .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:20px;}
    .sc{
      background:var(--s1);border:1px solid var(--border);border-radius:var(--radius-lg);
      padding:16px 18px;transition:all .15s;cursor:default;position:relative;overflow:hidden;
    }
    .sc:hover{border-color:var(--bh);background:var(--s2);}
    .sc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
    .sc-label{font-size:10px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;}
    .sc-icon{font-size:15px;opacity:.5;}
    .sc-val{font-size:28px;font-weight:800;line-height:1;letter-spacing:-.02em;color:var(--text);}
    .sc-bar{height:2px;background:var(--s3);border-radius:2px;margin-top:12px;overflow:hidden;}
    .sc-fill{height:100%;border-radius:2px;background:var(--nc);opacity:.6;transition:width .6s ease;}

    /* two-col */
    .two-col{display:grid;grid-template-columns:1fr 360px;gap:20px;}

    .sh{display:flex;align-items:center;gap:8px;margin-bottom:12px;}
    .sh-t{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;}
    .sh-line{flex:1;height:1px;background:var(--border);}
    .sh-act{font-size:11px;color:var(--accent);cursor:pointer;transition:color .15s;font-weight:500;}
    .sh-act:hover{color:var(--text);}

    /* agent cards */
    .agents{display:flex;flex-direction:column;gap:8px;}
    .ac{
      background:var(--s1);border:1px solid var(--border);border-radius:var(--radius-lg);
      padding:14px 16px;cursor:pointer;transition:all .15s;position:relative;overflow:hidden;
    }
    .ac::before{
      content:'';position:absolute;left:0;top:12px;bottom:12px;width:2px;
      background:var(--nc);border-radius:2px;opacity:.5;
    }
    .ac:hover{border-color:var(--bh);background:var(--s2);}
    .ac.running{border-color:rgba(var(--nr),.25);background:var(--s2);}
    .ac-row{display:flex;align-items:center;gap:12px;}
    .ac-icon{
      width:38px;height:38px;border-radius:var(--radius);display:flex;align-items:center;justify-content:center;
      font-size:17px;flex-shrink:0;background:var(--s2);border:1px solid var(--border);
    }
    .ac-name{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px;}
    .ac-desc{font-size:11px;color:var(--muted);line-height:1.4;}
    .run-btn{
      padding:6px 14px;border-radius:var(--radius);font-size:11px;font-weight:600;
      color:var(--bg);border:none;cursor:pointer;transition:all .15s;flex-shrink:0;
      background:var(--nc);font-family:var(--mono);letter-spacing:.04em;opacity:.85;
    }
    .run-btn:hover{opacity:1;}
    .run-btn:disabled{opacity:.25;cursor:not-allowed;}

    .prog{margin-top:10px;display:none;}
    .prog.show{display:block;}
    .prog-track{height:2px;background:var(--s3);border-radius:2px;overflow:hidden;}
    .prog-fill{height:100%;border-radius:2px;background:var(--nc);opacity:.7;animation:sweep 1.5s ease-in-out infinite;}
    @keyframes sweep{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}
    .prog-text{font-size:10px;margin-top:5px;color:var(--dim);font-family:var(--mono);}

    .ai-chip{margin-top:8px;padding:8px 10px;background:var(--s2);border-radius:var(--radius);border:1px solid var(--border);display:none;}
    .ai-chip.show{display:block;}
    .ai-chip-label{font-size:9px;color:var(--dim);font-family:var(--mono);margin-bottom:4px;text-transform:uppercase;letter-spacing:.06em;}
    .ai-chip-text{font-size:11px;color:var(--muted);font-family:var(--mono);line-height:1.5;word-break:break-word;}

    /* run-all button */
    .run-all{
      width:100%;padding:10px;border-radius:var(--radius);border:1px solid var(--accent-border);cursor:pointer;
      font-size:12px;font-weight:600;color:var(--accent);margin-top:10px;
      background:var(--accent-soft);
      letter-spacing:.04em;transition:all .15s;font-family:var(--mono);
    }
    .run-all:hover{background:rgba(217,119,6,.15);border-color:rgba(217,119,6,.3);}

    /* right panel */
    .right{display:flex;flex-direction:column;gap:16px;}

    .terminal{background:var(--s1);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;}
    .term-header{
      display:flex;align-items:center;gap:8px;padding:10px 14px;
      border-bottom:1px solid var(--border);
    }
    .term-dots{display:flex;gap:5px;}
    .term-dot{width:8px;height:8px;border-radius:50%;opacity:.6;}
    .term-title{font-size:10px;font-family:var(--mono);color:var(--dim);margin-left:4px;}
    .term-body{padding:10px 14px;height:190px;overflow-y:auto;font-family:var(--mono);}
    .log-row{display:flex;gap:7px;align-items:flex-start;padding:3px 0;animation:fin .15s ease;}
    @keyframes fin{from{opacity:0;transform:translateY(-2px)}to{opacity:1;transform:none}}
    .log-ts{font-size:10px;color:var(--dim);flex-shrink:0;padding-top:1px;}
    .log-agent{font-size:10px;padding:1px 6px;border-radius:4px;flex-shrink:0;font-weight:600;letter-spacing:.02em;}
    .log-msg{font-size:11px;line-height:1.5;}
    .log-empty{font-size:11px;color:var(--dim);padding:4px 0;font-family:var(--mono);}
    ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:transparent;}
    ::-webkit-scrollbar-thumb{background:rgba(255,255,255,.08);border-radius:4px;}
    ::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.14);}

    .ti{background:var(--s1);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;display:flex;align-items:center;gap:9px;transition:all .15s;}
    .ti:hover{border-color:var(--bh);background:var(--s2);}
    .ti+.ti{margin-top:6px;}
    .ti-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
    .ti-title{font-size:12px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .ti-meta{font-size:10px;color:var(--dim);margin-top:1px;font-family:var(--mono);}
    .ti-badge{font-size:10px;font-weight:600;padding:2px 8px;border-radius:20px;flex-shrink:0;border:1px solid;font-family:var(--mono);}

    /* pipeline */
    .pipe-box{background:var(--s1);border:1px solid var(--border);border-radius:var(--radius-lg);padding:14px;}
    .ps{display:flex;align-items:center;gap:10px;padding:9px 0;position:relative;transition:all .15s;}
    .ps+.ps{border-top:1px solid var(--border);}
    .ps.active .pi{border-color:var(--pc);background:rgba(var(--pr),.12);}
    .ps.active .pn{color:var(--pc);}
    .ps.done{opacity:.45;}
    .pi{width:32px;height:32px;border-radius:var(--radius);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;border:1px solid var(--border);background:var(--s2);transition:all .2s;}
    .pn{font-size:12px;font-weight:600;color:var(--text);transition:color .2s;}
    .pd{font-size:10px;color:var(--dim);margin-top:1px;font-family:var(--mono);}
    .ps-arrow{position:absolute;right:0;top:50%;transform:translateY(-50%);font-size:10px;color:var(--dim);font-family:var(--mono);}
    .ps.active .ps-arrow{color:var(--pc);}

    /* view switching */
    .view{display:none;animation:vfade .15s ease;}
    .view.active{display:block;}
    @keyframes vfade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

    /* tasks view */
    .tasks-grid{display:flex;flex-direction:column;gap:6px;}
    .task-row{
      background:var(--s1);border:1px solid var(--border);border-radius:var(--radius);
      padding:12px 16px;display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:12px;
      transition:all .15s;
    }
    .task-row:hover{border-color:var(--bh);background:var(--s2);}
    .task-row-title{font-size:13px;font-weight:600;color:var(--text);}
    .task-row-meta{font-size:10px;color:var(--dim);margin-top:2px;font-family:var(--mono);}
    .task-pill{font-size:10px;font-weight:600;padding:3px 10px;border-radius:20px;border:1px solid;font-family:var(--mono);white-space:nowrap;}
    .task-type{font-size:10px;color:var(--dim);font-family:var(--mono);white-space:nowrap;}
    .view-empty{
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      padding:60px 20px;gap:12px;text-align:center;
    }
    .view-empty-icon{font-size:36px;opacity:.2;}
    .view-empty-title{font-size:14px;font-weight:600;color:var(--muted);}
    .view-empty-sub{font-size:12px;color:var(--dim);font-family:var(--mono);max-width:340px;line-height:1.6;}
    .ve-btn{
      padding:8px 18px;border-radius:var(--radius);border:1px solid var(--accent-border);cursor:pointer;font-size:11px;font-weight:600;
      color:var(--accent);background:var(--accent-soft);font-family:var(--mono);transition:all .15s;margin-top:4px;
    }
    .ve-btn:hover{background:rgba(217,119,6,.15);border-color:rgba(217,119,6,.3);}

    /* sprint view */
    .kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
    .kb-col{background:var(--s1);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;}
    .kb-head{
      padding:10px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;
      font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-family:var(--mono);
    }
    .kb-dot{width:6px;height:6px;border-radius:50%;opacity:.7;}
    .kb-count{margin-left:auto;font-size:10px;color:var(--dim);background:var(--s2);
      padding:2px 7px;border-radius:12px;border:1px solid var(--border);}
    .kb-body{padding:8px;min-height:200px;display:flex;flex-direction:column;gap:6px;}
    .kb-card{
      background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:10px 12px;
      transition:all .15s;
    }
    .kb-card:hover{border-color:var(--bh);background:var(--s2);}
    .kb-card-title{font-size:12px;font-weight:600;color:var(--text);line-height:1.3;margin-bottom:5px;}
    .kb-card-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
    .kb-tag{font-size:9px;padding:2px 6px;border-radius:4px;border:1px solid;font-family:var(--mono);font-weight:600;}
    .kb-pts{font-size:9px;color:var(--dim);font-family:var(--mono);margin-left:auto;}
    .kb-empty{font-size:11px;color:var(--dim);font-family:var(--mono);padding:8px 4px;}

    /* reports view */
    .reports-list{display:flex;flex-direction:column;gap:8px;}
    .report-card{
      background:var(--s1);border:1px solid var(--border);border-radius:var(--radius-lg);padding:16px 18px;
      transition:all .15s;cursor:pointer;position:relative;overflow:hidden;
    }
    .report-card::before{content:'';position:absolute;left:0;top:12px;bottom:12px;width:2px;background:var(--accent);border-radius:2px;opacity:.4;}
    .report-card:hover{border-color:var(--bh);background:var(--s2);}
    .report-card-head{display:flex;align-items:center;gap:10px;margin-bottom:6px;}
    .report-card-title{font-size:13px;font-weight:600;color:var(--text);flex:1;}
    .report-card-date{font-size:10px;color:var(--dim);font-family:var(--mono);}
    .report-card-body{font-size:11px;color:var(--muted);line-height:1.6;font-family:var(--mono);}

    @media(max-width:1100px){.stats{grid-template-columns:repeat(2,1fr);}.two-col{grid-template-columns:1fr;}.kanban{grid-template-columns:1fr;}}
    @media(max-width:700px){.sidebar{display:none;}.main{margin-left:0;}}
  </style>
</head>
<body>

  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-mark">
          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#1a1a2e"/>
                <stop offset="100%" stop-color="#000"/>
              </linearGradient>
              <linearGradient id="ng" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fff"/>
                <stop offset="100%" stop-color="#ccc"/>
              </linearGradient>
              <radialGradient id="sg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#fff7a1"/>
                <stop offset="100%" stop-color="#e6b800"/>
              </radialGradient>
            </defs>
            <rect width="512" height="512" rx="88" fill="url(#bg)"/>
            <path d="M 120,400 L 120,112 L 392,400 L 392,112" stroke="url(#ng)" stroke-width="68" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            <circle cx="406" cy="106" r="42" fill="url(#sg)" opacity="0.95"/>
            <polygon points="406,76 413,96 435,97 417,110 424,130 406,118 388,130 395,110 378,97 399,96" fill="white"/>
          </svg>
        </div>
        <div>
          <div class="logo-text">NotionOps AI</div>
          <div class="logo-sub">v1.0 · Gemini + Notion</div>
        </div>
      </div>

      <div class="sb-sec">
        <div class="sb-label">Navigation</div>
        <a class="nav active" id="nav-dashboard" onclick="goTo('dashboard')"><span class="ndot" style="background:var(--a1)"></span>Dashboard</a>
        <a class="nav" id="nav-tasks" onclick="goTo('tasks')"><span class="ndot" style="background:var(--a2)"></span>Tasks</a>
        <a class="nav" id="nav-sprint" onclick="goTo('sprint')"><span class="ndot" style="background:var(--a3)"></span>Sprint Board</a>
        <a class="nav" id="nav-reports" onclick="goTo('reports')"><span class="ndot" style="background:var(--a4)"></span>Reports</a>
      </div>

      <div class="sb-sec">
        <div class="sb-label">Quick Run</div>
        <a class="nav" onclick="runAgent('triage')"><span>🔍</span>Issue Triage</a>
        <a class="nav" onclick="runAgent('pr-review')"><span>👀</span>PR Review</a>
        <a class="nav" onclick="runAgent('sprint-plan')"><span>📋</span>Sprint Planner</a>
        <a class="nav" onclick="runAgent('daily-report')"><span>📊</span>Daily Report</a>
      </div>

      <div class="sb-bottom">
        <div class="online-pill">
          <div class="ldot"></div>
          <span>System Online</span>
        </div>
        <div class="sb-ts" id="sb-ts">—</div>
      </div>
    </aside>

    <!-- Main -->
    <div class="main">
      <div class="topbar">
        <div>
          <div class="tb-title">Workflow Engine</div>
          <div class="tb-sub">GitHub → Gemini AI → Human Review → Notion</div>
        </div>
        <div class="tb-right">
          <button class="tb-sync" onclick="loadStats()">↻ <span id="tb-ts">syncing...</span></button>
          <button onclick="runAll()" class="run-all" style="width:auto;padding:7px 14px;margin:0;font-size:11px">Run All</button>
        </div>
      </div>

      <div class="content">
        <div id="view-dashboard" class="view active">

        <!-- Stats -->
        <div class="stats">
          <div class="sc" style="--nc:var(--a1);--nr:var(--a1r)">
            <div class="sc-head"><div class="sc-label">Total Tasks</div><div class="sc-icon">📋</div></div>
            <div class="sc-val" id="s-tasks">—</div>
            <div class="sc-bar"><div class="sc-fill" id="b-tasks" style="width:0%"></div></div>
          </div>
          <div class="sc" style="--nc:var(--a2);--nr:var(--a2r)">
            <div class="sc-head"><div class="sc-label">Need Approval</div><div class="sc-icon">✋</div></div>
            <div class="sc-val" id="s-approvals">—</div>
            <div class="sc-bar"><div class="sc-fill" id="b-approvals" style="width:0%"></div></div>
          </div>
          <div class="sc" style="--nc:var(--a3);--nr:var(--a3r)">
            <div class="sc-head"><div class="sc-label">Sprint Tasks</div><div class="sc-icon">🏃</div></div>
            <div class="sc-val" id="s-sprint">—</div>
            <div class="sc-bar"><div class="sc-fill" id="b-sprint" style="width:0%"></div></div>
          </div>
          <div class="sc" style="--nc:var(--a4);--nr:var(--a4r)">
            <div class="sc-head"><div class="sc-label">Reports</div><div class="sc-icon">📊</div></div>
            <div class="sc-val" id="s-reports">—</div>
            <div class="sc-bar"><div class="sc-fill" id="b-reports" style="width:0%"></div></div>
          </div>
        </div>

        <!-- Two col -->
        <div class="two-col">

          <!-- Left: Agents -->
          <div>
            <div class="sh"><div class="sh-t">AI Agents</div><div class="sh-line"></div></div>
            <div class="agents">

              <div class="ac" id="card-triage" style="--nc:var(--a1);--nr:var(--a1r)">
                <div class="ac-row">
                  <div class="ac-icon">🔍</div>
                  <div style="flex:1;min-width:0">
                    <div class="ac-name">Issue Triage Agent</div>
                    <div class="ac-desc">Fetches open GitHub issues, classifies priority & type, creates Notion tasks</div>
                  </div>
                  <button class="run-btn" onclick="event.stopPropagation();runAgent('triage')">RUN</button>
                </div>
                <div class="prog" id="prog-triage">
                  <div class="prog-track"><div class="prog-fill"></div></div>
                  <div class="prog-text" id="pt-triage">initializing...</div>
                </div>
                <div class="ai-chip" id="chip-triage">
                  <div class="ai-chip-label">AI Output</div>
                  <div class="ai-chip-text" id="chip-text-triage"></div>
                </div>
              </div>

              <div class="ac" id="card-pr" style="--nc:var(--a2);--nr:var(--a2r)">
                <div class="ac-row">
                  <div class="ac-icon">👀</div>
                  <div style="flex:1;min-width:0">
                    <div class="ac-name">PR Review Agent</div>
                    <div class="ac-desc">Reviews pull requests, scores code quality, posts GitHub comments & Notion approvals</div>
                  </div>
                  <button class="run-btn" onclick="event.stopPropagation();runAgent('pr-review')">RUN</button>
                </div>
                <div class="prog" id="prog-pr">
                  <div class="prog-track"><div class="prog-fill"></div></div>
                  <div class="prog-text" id="pt-pr">initializing...</div>
                </div>
                <div class="ai-chip" id="chip-pr">
                  <div class="ai-chip-label">AI Output</div>
                  <div class="ai-chip-text" id="chip-text-pr"></div>
                </div>
              </div>

              <div class="ac" id="card-sprint" style="--nc:var(--a3);--nr:var(--a3r)">
                <div class="ac-row">
                  <div class="ac-icon">📋</div>
                  <div style="flex:1;min-width:0">
                    <div class="ac-name">Sprint Planner Agent</div>
                    <div class="ac-desc">Selects top tasks, assigns story points, populates sprint board in Notion</div>
                  </div>
                  <button class="run-btn" onclick="event.stopPropagation();runAgent('sprint-plan')">RUN</button>
                </div>
                <div class="prog" id="prog-sprint">
                  <div class="prog-track"><div class="prog-fill"></div></div>
                  <div class="prog-text" id="pt-sprint">initializing...</div>
                </div>
                <div class="ai-chip" id="chip-sprint">
                  <div class="ai-chip-label">AI Output</div>
                  <div class="ai-chip-text" id="chip-text-sprint"></div>
                </div>
              </div>

              <div class="ac" id="card-report" style="--nc:var(--a4);--nr:var(--a4r)">
                <div class="ac-row">
                  <div class="ac-icon">📊</div>
                  <div style="flex:1;min-width:0">
                    <div class="ac-name">Daily Report Agent</div>
                    <div class="ac-desc">Aggregates sprint metrics, generates AI standup summary, saves to Notion</div>
                  </div>
                  <button class="run-btn" onclick="event.stopPropagation();runAgent('daily-report')">RUN</button>
                </div>
                <div class="prog" id="prog-report">
                  <div class="prog-track"><div class="prog-fill"></div></div>
                  <div class="prog-text" id="pt-report">initializing...</div>
                </div>
                <div class="ai-chip" id="chip-report">
                  <div class="ai-chip-label">AI Output</div>
                  <div class="ai-chip-text" id="chip-text-report"></div>
                </div>
              </div>

            </div>
            <button class="run-all" onclick="runAll()">Run Full Pipeline</button>
          </div>

          <!-- Right panel -->
          <div class="right">

            <div>
              <div class="sh"><div class="sh-t">Live Log</div><div class="sh-line"></div></div>
              <div class="terminal">
                <div class="term-header">
                  <div class="term-dots">
                    <div class="term-dot" style="background:#ef4444"></div>
                    <div class="term-dot" style="background:#f59e0b"></div>
                    <div class="term-dot" style="background:#22c55e"></div>
                  </div>
                  <div class="term-title">agent_stream.log</div>
                  <div class="ldot" style="margin-left:auto"></div>
                </div>
                <div class="term-body" id="log-body">
                  <div class="log-empty">waiting for agent events...</div>
                </div>
              </div>
            </div>

            <div>
              <div class="sh"><div class="sh-t">Recent Tasks</div><div class="sh-line"></div><div class="sh-act" onclick="loadStats()">refresh</div></div>
              <div id="tasks-list"><div class="log-empty">loading from notion...</div></div>
            </div>

            <div>
              <div class="sh"><div class="sh-t">Pipeline</div><div class="sh-line"></div></div>
              <div class="pipe-box">
                <div>
                  <div class="ps" id="pipe-0" style="--pc:var(--a1);--pr:var(--a1r)">
                    <div class="pi">🐙</div>
                    <div><div class="pn">GitHub</div><div class="pd">Issues, Pull Requests, Diffs</div></div>
                    <div class="ps-arrow">→</div>
                  </div>
                  <div class="ps" id="pipe-1" style="--pc:var(--a2);--pr:var(--a2r)">
                    <div class="pi">🤖</div>
                    <div><div class="pn">Gemini AI Agents</div><div class="pd">Triage, Review, Plan, Report</div></div>
                    <div class="ps-arrow">→</div>
                  </div>
                  <div class="ps" id="pipe-2" style="--pc:var(--a3);--pr:var(--a3r)">
                    <div class="pi">✋</div>
                    <div><div class="pn">Human Review Gate</div><div class="pd">Approve or reject in Notion</div></div>
                    <div class="ps-arrow">→</div>
                  </div>
                  <div class="ps" id="pipe-3" style="--pc:var(--a4);--pr:var(--a4r)">
                    <div class="pi">📝</div>
                    <div><div class="pn">Notion</div><div class="pd">Tasks, Sprint, Reports sync</div></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        </div><!-- /view-dashboard -->

        <!-- Tasks View -->
        <div id="view-tasks" class="view">
          <div class="sh"><div class="sh-t">All Tasks</div><div class="sh-line"></div><div class="sh-act" onclick="loadView('tasks')">refresh</div></div>
          <div id="tasks-view-body">
            <div class="view-empty">
              <div class="view-empty-icon">📋</div>
              <div class="view-empty-title">No tasks loaded</div>
              <div class="view-empty-sub">Run the Issue Triage Agent to fetch GitHub issues and create Notion tasks.</div>
              <button class="ve-btn" onclick="runAgent('triage');goTo('dashboard')">Run Triage Agent</button>
            </div>
          </div>
        </div>

        <!-- Sprint View -->
        <div id="view-sprint" class="view">
          <div class="sh"><div class="sh-t">Sprint Board</div><div class="sh-line"></div><div class="sh-act" onclick="loadView('sprint')">refresh</div></div>
          <div id="sprint-view-body">
            <div class="kanban">
              <div class="kb-col">
                <div class="kb-head"><div class="kb-dot" style="background:var(--a1)"></div><span style="color:var(--a1)">TODO</span><div class="kb-count" id="kb-count-todo">0</div></div>
                <div class="kb-body" id="kb-todo"><div class="kb-empty">No tasks</div></div>
              </div>
              <div class="kb-col">
                <div class="kb-head"><div class="kb-dot" style="background:var(--a3)"></div><span style="color:var(--a3)">IN PROGRESS</span><div class="kb-count" id="kb-count-wip">0</div></div>
                <div class="kb-body" id="kb-wip"><div class="kb-empty">No tasks</div></div>
              </div>
              <div class="kb-col">
                <div class="kb-head"><div class="kb-dot" style="background:var(--a2)"></div><span style="color:var(--a2)">DONE</span><div class="kb-count" id="kb-count-done">0</div></div>
                <div class="kb-body" id="kb-done"><div class="kb-empty">No tasks</div></div>
              </div>
            </div>
            <div style="margin-top:14px">
              <button class="ve-btn" onclick="runAgent('sprint-plan');goTo('dashboard')" style="font-size:11px">Run Sprint Planner</button>
            </div>
          </div>
        </div>

        <!-- Reports View -->
        <div id="view-reports" class="view">
          <div class="sh"><div class="sh-t">Reports</div><div class="sh-line"></div><div class="sh-act" onclick="loadView('reports')">refresh</div></div>
          <div id="reports-view-body">
            <div class="view-empty">
              <div class="view-empty-icon">📊</div>
              <div class="view-empty-title">No reports yet</div>
              <div class="view-empty-sub">Run the Daily Report Agent to generate standup summaries from sprint metrics.</div>
              <button class="ve-btn" onclick="runAgent('daily-report');goTo('dashboard')">Run Daily Report</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

<script>
var AGENTS = {
  triage:        { card:'card-triage',  prog:'prog-triage',  pt:'pt-triage',  chip:'chip-triage',  chipTxt:'chip-text-triage',  label:'IssueTriage',   color:'#3b82f6' },
  'pr-review':   { card:'card-pr',      prog:'prog-pr',      pt:'pt-pr',      chip:'chip-pr',      chipTxt:'chip-text-pr',      label:'PRReview',      color:'#8b5cf6' },
  'sprint-plan': { card:'card-sprint',  prog:'prog-sprint',  pt:'pt-sprint',  chip:'chip-sprint',  chipTxt:'chip-text-sprint',  label:'SprintPlanner', color:'#06b6d4' },
  'daily-report':{ card:'card-report',  prog:'prog-report',  pt:'pt-report',  chip:'chip-report',  chipTxt:'chip-text-report',  label:'DailyReport',   color:'#6366f1' },
};

// SSE
var sse = new EventSource('/events');
sse.onmessage = function(e) {
  try {
    var ev = JSON.parse(e.data);
    appendLog(ev);
    for (var k in AGENTS) {
      if (AGENTS[k].label === ev.agent) {
        if (ev.type === 'ai' && ev.data && ev.data.preview) showChip(AGENTS[k], String(ev.data.preview));
        updatePT(AGENTS[k], ev.msg);
        break;
      }
    }
    if (ev.type !== 'error') activatePipe(1);
    if (ev.type === 'success') activatePipe(3);
  } catch(x) {}
};
sse.onerror = function() { document.querySelector('.term-title').textContent = 'agent_stream.log — reconnecting...'; };
sse.onopen  = function() { document.querySelector('.term-title').textContent = 'agent_stream.log'; };

// Agent label -> color
var ACOLORS = { IssueTriage:'#3b82f6', PRReview:'#8b5cf6', SprintPlanner:'#06b6d4', DailyReport:'#6366f1' };
var TCOLORS = { info:'#3b82f6', success:'#22c55e', error:'#ef4444', warn:'#f59e0b', ai:'#8b5cf6' };

function appendLog(ev) {
  var body = document.getElementById('log-body');
  var empty = body.querySelector('.log-empty');
  if (empty) empty.remove();
  var tc = TCOLORS[ev.type]||'#a1a1aa';
  var ac = ACOLORS[ev.agent]||'#a1a1aa';
  var time = new Date(ev.ts).toLocaleTimeString();
  var row = document.createElement('div');
  row.className = 'log-row';
  row.innerHTML =
    '<span class="log-ts">'+time+'</span>'+
    '<span class="log-agent" style="background:'+ac+'14;color:'+ac+';border:1px solid '+ac+'22">'+ev.agent+'</span>'+
    '<span class="log-msg" style="color:'+tc+'">'+escHtml(ev.msg)+'</span>';
  body.prepend(row);
  var rows = body.querySelectorAll('.log-row');
  if (rows.length > 80) rows[rows.length-1].remove();
}
function localLog(msg, type) { appendLog({agent:'Dashboard',msg:msg,type:type||'info',ts:new Date().toISOString()}); }
function escHtml(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function showChip(a, text) { document.getElementById(a.chip).classList.add('show'); document.getElementById(a.chipTxt).textContent = text+'...'; }
function updatePT(a, msg) { var el=document.getElementById(a.pt); if(el) el.textContent=msg; }

// Pipeline
var pipeTimer = null;
function activatePipe(step) {
  for (var i=0;i<4;i++) {
    var el=document.getElementById('pipe-'+i);
    el.classList.remove('active','done');
    if (i<step) el.classList.add('done');
    if (i===step) el.classList.add('active');
  }
}
function animatePipeline() {
  var step=0; clearInterval(pipeTimer);
  pipeTimer=setInterval(function(){
    activatePipe(step); step++;
    if(step>=4){clearInterval(pipeTimer);setTimeout(function(){activatePipe(3);},800);}
  },900);
}

// Run agent
function runAgent(name) {
  var a=AGENTS[name]; if(!a) return;
  var card=document.getElementById(a.card);
  var btn=card.querySelector('.run-btn');
  var prog=document.getElementById(a.prog);
  if(btn.disabled) return;
  btn.disabled=true; prog.classList.add('show');
  document.getElementById(a.chip).classList.remove('show');
  card.classList.add('running'); activatePipe(0);
  localLog('Starting '+a.label+' agent...','info');
  fetch('/run/'+name,{method:'POST'}).then(function(){animatePipeline();}).catch(function(e){localLog('Error: '+e.message,'error');});
  setTimeout(function(){btn.disabled=false;prog.classList.remove('show');card.classList.remove('running');loadStats();},60000);
}

// Run all
async function runAll() {
  localLog('Full pipeline starting...','warn'); animatePipeline();
  var names=['triage','pr-review','sprint-plan','daily-report'];
  for(var i=0;i<names.length;i++){
    var a=AGENTS[names[i]];
    var card=document.getElementById(a.card);
    var btn=card.querySelector('.run-btn');
    var prog=document.getElementById(a.prog);
    btn.disabled=true;prog.classList.add('show');card.classList.add('running');
    try{await fetch('/run/'+names[i],{method:'POST'});}catch(e){localLog('Error: '+e.message,'error');}
    await new Promise(function(r){setTimeout(r,600);});
    btn.disabled=false;prog.classList.remove('show');card.classList.remove('running');
  }
  localLog('Pipeline complete — check live log for results','success');
  setTimeout(loadStats,5000);
}

// Stats
async function loadStats() {
  try{
    var r=await fetch('/api/stats'); var d=await r.json(); var t=new Date().toLocaleTimeString();
    animateCount('s-tasks',d.tasks||0); animateCount('s-approvals',d.approvals||0);
    animateCount('s-sprint',d.sprint||0); animateCount('s-reports',d.reports||0);
    document.getElementById('b-tasks').style.width   =Math.min((d.tasks||0)*5,100)+'%';
    document.getElementById('b-approvals').style.width=Math.min((d.approvals||0)*15,100)+'%';
    document.getElementById('b-sprint').style.width  =Math.min((d.sprint||0)*8,100)+'%';
    document.getElementById('b-reports').style.width =Math.min((d.reports||0)*10,100)+'%';
    document.getElementById('tb-ts').textContent='synced '+t;
    document.getElementById('sb-ts').textContent='last sync: '+t;
    var list=document.getElementById('tasks-list');
    if(d.recentTasks&&d.recentTasks.length>0){
      list.innerHTML=d.recentTasks.map(function(t){
        var dot={High:'#ef4444',Medium:'#3b82f6',Low:'#a1a1aa'}[t.priority]||'#3b82f6';
        var bg ={High:'rgba(239,68,68,.08)',Medium:'rgba(59,130,246,.08)',Low:'rgba(161,161,170,.08)'}[t.priority]||'rgba(59,130,246,.08)';
        var bc ={High:'rgba(239,68,68,.2)',Medium:'rgba(59,130,246,.2)',Low:'rgba(161,161,170,.2)'}[t.priority]||'rgba(59,130,246,.2)';
        return '<div class="ti">'
          +'<div class="ti-dot" style="background:'+dot+'"></div>'
          +'<div style="flex:1;min-width:0"><div class="ti-title">'+escHtml(t.title||'Untitled')+'</div>'
          +'<div class="ti-meta">'+escHtml(t.type||'')+' · '+escHtml(t.status||'')+'</div></div>'
          +'<span class="ti-badge" style="background:'+bg+';border-color:'+bc+';color:'+dot+'">'+escHtml(t.priority||'')+'</span>'
          +'</div>';
      }).join('');
    }else{
      list.innerHTML='<div class="log-empty">No tasks yet — run the triage agent</div>';
    }
  }catch(e){document.getElementById('tb-ts').textContent='sync failed';}
}
function animateCount(id,target){
  var el=document.getElementById(id),start=parseInt(el.textContent)||0,diff=target-start,steps=20,step=0;
  if(diff===0){el.textContent=target;return;}
  var tmr=setInterval(function(){step++;el.textContent=Math.round(start+diff*(step/steps));if(step>=steps){clearInterval(tmr);el.textContent=target;}},20);
}
// Navigation
var VIEWS = ['dashboard','tasks','sprint','reports'];
function goTo(name) {
  VIEWS.forEach(function(v) {
    document.getElementById('view-'+v).classList.toggle('active', v===name);
    var nav = document.getElementById('nav-'+v);
    if (nav) nav.classList.toggle('active', v===name);
  });
  var subs = {
    dashboard:'GitHub → Gemini AI → Human Review → Notion',
    tasks:'All tasks synced from Notion database',
    sprint:'Sprint board — current iteration tasks',
    reports:'AI-generated standup reports'
  };
  document.querySelector('.tb-sub').textContent = subs[name]||'';
  if (name !== 'dashboard') loadView(name);
}

async function loadView(name) {
  try {
    var r = await fetch('/api/stats'); var d = await r.json();
    if (name === 'tasks') renderTasksView(d.recentTasks||[]);
    if (name === 'sprint') renderSprintView(d.recentTasks||[]);
    if (name === 'reports') renderReportsView(d.reports||0);
  } catch(e) {}
}

function renderTasksView(tasks) {
  var el = document.getElementById('tasks-view-body');
  if (!tasks.length) {
    el.innerHTML = '<div class="view-empty"><div class="view-empty-icon">📋</div><div class="view-empty-title">No tasks loaded</div><div class="view-empty-sub">Run the Issue Triage Agent to fetch GitHub issues and create Notion tasks.</div><button class="ve-btn" onclick="runAgent(\'triage\');goTo(\'dashboard\')">Run Triage Agent</button></div>';
    return;
  }
  el.innerHTML = '<div class="tasks-grid">'+tasks.map(function(t) {
    var dot={High:'#ef4444',Medium:'#3b82f6',Low:'#a1a1aa'}[t.priority]||'#3b82f6';
    var bg ={High:'rgba(239,68,68,.08)',Medium:'rgba(59,130,246,.08)',Low:'rgba(161,161,170,.08)'}[t.priority]||'rgba(59,130,246,.08)';
    var bc ={High:'rgba(239,68,68,.2)',Medium:'rgba(59,130,246,.2)',Low:'rgba(161,161,170,.2)'}[t.priority]||'rgba(59,130,246,.2)';
    return '<div class="task-row">'
      +'<div><div class="task-row-title">'+escHtml(t.title||'Untitled')+'</div>'
      +'<div class="task-row-meta">status: '+escHtml(t.status||'—')+'</div></div>'
      +'<span class="task-type">'+escHtml(t.type||'')+'</span>'
      +'<span class="task-pill" style="background:'+bg+';border-color:'+bc+';color:'+dot+'">'+escHtml(t.priority||'—')+'</span>'
      +'</div>';
  }).join('')+'</div>';
}

function renderSprintView(tasks) {
  var cols = { todo:[], wip:[], done:[] };
  tasks.forEach(function(t) {
    var s = (t.status||'').toLowerCase();
    if (s.includes('done')||s.includes('complete')) cols.done.push(t);
    else if (s.includes('progress')||s.includes('review')||s.includes('wip')) cols.wip.push(t);
    else cols.todo.push(t);
  });
  function cards(list) {
    if (!list.length) return '<div class="kb-empty">No tasks</div>';
    return list.map(function(t) {
      var dot={High:'#ef4444',Medium:'#3b82f6',Low:'#a1a1aa'}[t.priority]||'#3b82f6';
      var bg ={High:'rgba(239,68,68,.08)',Medium:'rgba(59,130,246,.08)',Low:'rgba(161,161,170,.08)'}[t.priority]||'rgba(59,130,246,.08)';
      var bc ={High:'rgba(239,68,68,.2)',Medium:'rgba(59,130,246,.2)',Low:'rgba(161,161,170,.2)'}[t.priority]||'rgba(59,130,246,.2)';
      return '<div class="kb-card">'
        +'<div class="kb-card-title">'+escHtml(t.title||'Untitled')+'</div>'
        +'<div class="kb-card-meta">'
        +'<span class="kb-tag" style="background:'+bg+';border-color:'+bc+';color:'+dot+'">'+escHtml(t.priority||'')+'</span>'
        +(t.type?'<span class="kb-tag" style="background:rgba(255,255,255,.04);border-color:rgba(255,255,255,.06);color:#71717a">'+escHtml(t.type)+'</span>':'')
        +'</div></div>';
    }).join('');
  }
  document.getElementById('kb-todo').innerHTML = cards(cols.todo);
  document.getElementById('kb-wip').innerHTML  = cards(cols.wip);
  document.getElementById('kb-done').innerHTML = cards(cols.done);
  document.getElementById('kb-count-todo').textContent = cols.todo.length;
  document.getElementById('kb-count-wip').textContent  = cols.wip.length;
  document.getElementById('kb-count-done').textContent = cols.done.length;
}

function renderReportsView(count) {
  var el = document.getElementById('reports-view-body');
  if (!count) {
    el.innerHTML = '<div class="view-empty"><div class="view-empty-icon">📊</div><div class="view-empty-title">No reports yet</div><div class="view-empty-sub">Run the Daily Report Agent to generate standup summaries from sprint metrics.</div><button class="ve-btn" onclick="runAgent(\'daily-report\');goTo(\'dashboard\')">Run Daily Report</button></div>';
    return;
  }
  var today = new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  el.innerHTML = '<div class="reports-list">'
    + Array.from({length:Math.min(count,5)},function(_,i){
        return '<div class="report-card">'
          +'<div class="report-card-head"><div class="report-card-title">Daily Standup Report #'+(count-i)+'</div>'
          +'<div class="report-card-date">'+today+'</div></div>'
          +'<div class="report-card-body">AI-generated standup summary from sprint metrics · stored in Notion</div>'
          +'</div>';
      }).join('')
    +'</div>';
}

loadStats();
setInterval(loadStats,30000);
</script>
</body>
</html>`;

export const callbackHTML = (token: string) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Connected — NotionOps AI</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Inter',system-ui,sans-serif;background:#09090b;color:#e4e4e7;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;-webkit-font-smoothing:antialiased;}
    .card{max-width:420px;width:100%;text-align:center;}
    .check{width:64px;height:64px;border-radius:50%;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 20px;}
    h1{font-size:18px;font-weight:700;color:#e4e4e7;margin-bottom:8px;}
    p{font-size:13px;color:#71717a;line-height:1.6;margin-bottom:20px;}
    code{background:rgba(255,255,255,.06);padding:2px 6px;border-radius:4px;color:#e4e4e7;font-family:'JetBrains Mono',monospace;font-size:12px;}
    .box{background:#131316;border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px;text-align:left;margin-bottom:14px;}
    .box-label{font-size:10px;font-weight:600;color:#52525b;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;font-family:'JetBrains Mono',monospace;}
    .box-val{font-size:11px;color:#e4e4e7;word-break:break-all;line-height:1.6;font-family:'JetBrains Mono',monospace;}
    .copy{width:100%;padding:12px;border-radius:10px;border:1px solid rgba(59,130,246,.2);cursor:pointer;font-size:12px;font-weight:600;color:#3b82f6;margin-bottom:14px;background:rgba(59,130,246,.08);transition:all .15s;font-family:'JetBrains Mono',monospace;letter-spacing:.04em;}
    .copy:hover{background:rgba(59,130,246,.14);border-color:rgba(59,130,246,.3);}
    a{font-size:12px;color:#71717a;text-decoration:none;font-family:'JetBrains Mono',monospace;transition:color .15s;}
    a:hover{color:#e4e4e7;}
  </style>
</head>
<body>
  <div class="card">
    <div class="check">✓</div>
    <h1>Notion Connected</h1>
    <p>Copy the token below and add it to your <code>.env</code> as <code>NOTION_API_KEY</code></p>
    <div class="box">
      <div class="box-label">NOTION_API_KEY</div>
      <div class="box-val">${token}</div>
    </div>
    <button class="copy" onclick="navigator.clipboard.writeText('${token}').then(()=>{this.textContent='Copied to clipboard';this.style.color='#22c55e';this.style.borderColor='rgba(34,197,94,.2)';this.style.background='rgba(34,197,94,.08)'})">
      Copy Token
    </button>
    <a href="/">← Open Dashboard</a>
  </div>
</body>
</html>`;
