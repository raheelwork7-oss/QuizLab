
(function () {
  "use strict";

  
  const STORAGE_KEYS = {
    theme: "quizlab_theme",
    history: "quizlab_history",
    achievements: "quizlab_achievements"
  };

  const DIFFICULTY_CONFIG = {
    easy: { count: 10, seconds: 60, label: "Easy" },
    medium: { count: 12, seconds: 75, label: "Medium" },
    hard: { count: 15, seconds: 90, label: "Hard" },
    adaptive: { count: 12, seconds: 75, label: "Adaptive" }
  };

  const TYPE_LABELS = {
    "multiple-choice": "Multiple Choice",
    "code-output": "Code Output",
    conceptual: "Conceptual",
    scenario: "Scenario",
    debugging: "Debugging"
  };

  const ACHIEVEMENTS = [
    { id: "first", name: "First Assessment", desc: "Complete your first quiz", icon: "01" },
    { id: "perfect", name: "Perfect Score", desc: "Score 100% on any assessment", icon: "100" },
    { id: "ten", name: "Dedicated", desc: "Complete 10 assessments", icon: "10" },
    { id: "js_master", name: "JavaScript Master", desc: "Score 90%+ on a JavaScript quiz", icon: "JS" },
    { id: "speed", name: "Speed Runner", desc: "Finish with avg ≤ 20s per question", icon: "SR" },
    { id: "html_pro", name: "HTML Specialist", desc: "Score 90%+ on an HTML quiz", icon: "HT" },
    { id: "css_pro", name: "CSS Specialist", desc: "Score 90%+ on a CSS quiz", icon: "CS" },
    { id: "mixed", name: "Full Stack Challenge", desc: "Complete a Mixed assessment", icon: "FX" }
  ];

  const DEMO_LEADERBOARD = [
    { name: "A. Chen", score: 96, accuracy: 96, time: 412, demo: true },
    { name: "M. Okonkwo", score: 91, accuracy: 91, time: 498, demo: true },
    { name: "S. Patel", score: 88, accuracy: 88, time: 540, demo: true },
    { name: "J. Rivera", score: 84, accuracy: 85, time: 605, demo: true },
    { name: "L. Berg", score: 79, accuracy: 80, time: 630, demo: true },
    { name: "K. Nakamura", score: 75, accuracy: 76, time: 710, demo: true },
    { name: "T. Adeyemi", score: 71, accuracy: 72, time: 680, demo: true }
  ];

  
  const state = {
    view: "dashboard",
    setupCategory: null,
    setupDifficulty: null,
    quiz: null,
    lastResult: null,
    reviewFilter: "all",
    answeringLocked: false
  };

  
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      toast("Could not save to local storage", "error");
    }
  }

  function getHistory() {
    return loadJSON(STORAGE_KEYS.history, []);
  }

  function getUnlockedAchievements() {
    return loadJSON(STORAGE_KEYS.achievements, []);
  }

  
  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.theme);
    const theme = saved || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(STORAGE_KEYS.theme, next);
    toast(`${next === "dark" ? "Dark" : "Light"} theme enabled`);
  }

  
  function toast(message, type = "info") {
    const region = $("#toast-region");
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    region.appendChild(el);
    setTimeout(() => {
      el.style.opacity = "0";
      el.style.transition = "opacity 0.2s ease";
      setTimeout(() => el.remove(), 200);
    }, 2800);
  }

  
  function showView(name) {
    if (state.quiz && state.quiz.active && name !== "quiz") {
      openLeaveModal(() => {
        abandonQuiz();
        navigateTo(name);
      });
      return;
    }
    navigateTo(name);
  }

  function navigateTo(name) {
    state.view = name;
    $$(".view").forEach((v) => {
      const id = v.id.replace("view-", "");
      const active = id === name;
      v.hidden = !active;
      v.classList.toggle("active", active);
    });

    $$(".nav-link").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === name);
    });

    document.body.classList.toggle("quiz-active", name === "quiz");
    closeMobileNav();
    closeProfile();

    const renderers = {
      dashboard: renderDashboard,
      categories: renderCategories,
      leaderboard: renderLeaderboard,
      history: renderHistory,
      achievements: renderAchievementsPage,
      results: () => state.lastResult && renderResults(state.lastResult),
      review: () => state.lastResult && renderReview()
    };
    if (renderers[name]) renderers[name]();
    window.scrollTo(0, 0);
  }

  
  function computeStats() {
    const history = getHistory();
    const best = history.length ? Math.max(...history.map((h) => h.score)) : null;
    const avg = history.length
      ? Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)
      : null;
    const catScores = {};
    history.forEach((h) => {
      const cat = h.category;
      if (!catScores[cat]) catScores[cat] = [];
      catScores[cat].push(h.score);
    });
    let bestCategory = "—";
    let bestCatAvg = -1;
    Object.entries(catScores).forEach(([cat, scores]) => {
      const a = scores.reduce((x, y) => x + y, 0) / scores.length;
      if (a > bestCatAvg) {
        bestCatAvg = a;
        bestCategory = CATEGORY_META[cat]?.name || cat;
      }
    });
    return { history, best, avg, total: history.length, bestCategory };
  }

  function updateHeaderStats() {
    const { best, avg, total } = computeStats();
    const bestLabel = best != null ? `${best}%` : "—";
    $("#header-best-score").textContent = bestLabel;
    $("#stat-best-score").textContent = bestLabel;
    $("#profile-quizzes").textContent = String(total);
    $("#profile-best").textContent = bestLabel;
    $("#profile-avg").textContent = avg != null ? `${avg}%` : "—";
  }

  
  function renderDashboard() {
    updateHeaderStats();
    const quick = $("#quick-cats");
    quick.innerHTML = ["html", "css", "javascript", "mixed"]
      .map((id) => {
        const meta = CATEGORY_META[id];
        const count = id === "mixed" ? QUESTIONS.length : QUESTIONS.filter((q) => q.category === id).length;
        return `
          <button type="button" class="cat-card" data-start-category="${id}">
            <div class="cat-card-top">
              <span class="cat-icon">${iconLabel(id)}</span>
              <div>
                <div class="cat-name">${meta.name}</div>
                <div class="cat-subtitle">${meta.subtitle}</div>
              </div>
            </div>
            <p class="cat-desc">${meta.description}</p>
            <div class="cat-meta">
              <span>${count} questions</span>
              <span>Easy · Medium · Hard</span>
            </div>
          </button>`;
      })
      .join("");

    renderAchievementsPreview();
    renderRecentActivity();
  }

  function iconLabel(id) {
    return { html: "HT", css: "CS", javascript: "JS", mixed: "ALL" }[id] || "?";
  }

  function renderAchievementsPreview() {
    const unlocked = new Set(getUnlockedAchievements());
    const preview = ACHIEVEMENTS.slice(0, 4);
    $("#achievements-preview").innerHTML = preview
      .map(
        (a) => `
      <div class="achievement ${unlocked.has(a.id) ? "unlocked" : ""}">
        <div class="achievement-icon">${a.icon}</div>
        <div>
          <div class="achievement-name">${a.name}</div>
          <div class="achievement-desc">${a.desc}</div>
        </div>
      </div>`
      )
      .join("");
  }

  function renderRecentActivity() {
    const history = getHistory().slice(0, 5);
    const el = $("#recent-activity");
    if (!history.length) {
      el.innerHTML = `
        <div class="empty-state">
          <h3>No assessments yet</h3>
          <p>Start an assessment to see your activity here.</p>
        </div>`;
      return;
    }
    el.innerHTML = `<div class="activity-list">${history
      .map(
        (h) => `
      <div class="activity-item">
        <span>${CATEGORY_META[h.category]?.name || h.category} · ${DIFFICULTY_CONFIG[h.difficulty]?.label || h.difficulty}</span>
        <span class="score">${h.score}%</span>
        <span class="date">${formatDate(h.date)}</span>
      </div>`
      )
      .join("")}</div>`;
  }

  
  function renderCategories() {
    const grid = $("#category-grid");
    grid.innerHTML = ["html", "css", "javascript", "mixed"]
      .map((id) => {
        const meta = CATEGORY_META[id];
        const count = id === "mixed" ? QUESTIONS.length : QUESTIONS.filter((q) => q.category === id).length;
        return `
          <article class="cat-card" style="cursor:default">
            <div class="cat-card-top">
              <span class="cat-icon">${iconLabel(id)}</span>
              <div>
                <div class="cat-name">${meta.name}</div>
                <div class="cat-subtitle">${meta.subtitle}</div>
              </div>
            </div>
            <p class="cat-desc">${meta.description}</p>
            <div class="cat-meta">
              <span>${count} questions</span>
              <span>3 difficulty levels</span>
              <span>Adaptive mode</span>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" data-start-category="${id}">Start</button>
          </article>`;
      })
      .join("");
  }

  
  function openSetup(category) {
    state.setupCategory = category;
    state.setupDifficulty = null;
    const meta = CATEGORY_META[category];
    $("#setup-title").textContent = `${meta.name} Assessment`;
    $("#setup-desc").textContent = "Select a difficulty level or Adaptive Mode to begin.";
    $$(".diff-card").forEach((c) => c.classList.remove("selected"));
    $("#btn-begin-quiz").disabled = true;
    navigateTo("setup");
  }

  function selectDifficulty(diff) {
    state.setupDifficulty = diff;
    $$(".diff-card").forEach((c) => {
      c.classList.toggle("selected", c.dataset.difficulty === diff);
    });
    $("#btn-begin-quiz").disabled = false;
  }

  
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickQuestions(category, difficulty) {
    const config = DIFFICULTY_CONFIG[difficulty];
    let pool =
      category === "mixed"
        ? [...QUESTIONS]
        : QUESTIONS.filter((q) => q.category === category);

    if (difficulty === "adaptive") {
      
      const easy = shuffle(pool.filter((q) => q.difficulty === "easy"));
      const medium = shuffle(pool.filter((q) => q.difficulty === "medium"));
      const hard = shuffle(pool.filter((q) => q.difficulty === "hard"));
      const selected = [];
      const targets = [
        ...easy.slice(0, 4),
        ...medium.slice(0, 5),
        ...hard.slice(0, 3)
      ];
      
      const used = new Set(targets.map((q) => q.id));
      const rest = shuffle(pool.filter((q) => !used.has(q.id)));
      while (targets.length < config.count && rest.length) targets.push(rest.shift());
      return targets.slice(0, config.count);
    }

    const preferred = pool.filter((q) => q.difficulty === difficulty);
    const others = pool.filter((q) => q.difficulty !== difficulty);
    const selected = shuffle(preferred);
    if (selected.length < config.count) {
      selected.push(...shuffle(others).slice(0, config.count - selected.length));
    }
    return shuffle(selected).slice(0, config.count);
  }

  function adaptiveReorder(questions, answersSoFar) {
    
    if (difficultyMode() !== "adaptive") return questions;
    const answered = answersSoFar.length;
    if (answered < 2) return questions;
    const recent = answersSoFar.slice(-3);
    const correctStreak = recent.every((a) => a.status === "correct");
    if (!correctStreak) return questions;

    const remaining = questions.slice(answered);
    const hardFirst = [
      ...remaining.filter((q) => q.difficulty === "hard"),
      ...remaining.filter((q) => q.difficulty === "medium"),
      ...remaining.filter((q) => q.difficulty === "easy")
    ];
    return [...questions.slice(0, answered), ...hardFirst];
  }

  function difficultyMode() {
    return state.quiz?.difficulty;
  }

  
  function beginQuiz() {
    if (!state.setupCategory || !state.setupDifficulty) return;

    showLoading(true);
    setTimeout(() => {
      const questions = pickQuestions(state.setupCategory, state.setupDifficulty);
      const config = DIFFICULTY_CONFIG[state.setupDifficulty];

      state.quiz = {
        active: true,
        category: state.setupCategory,
        difficulty: state.setupDifficulty,
        questions,
        index: 0,
        answers: [], 
        questionStartedAt: Date.now(),
        sessionStartedAt: Date.now(),
        timerSeconds: config.seconds,
        timerId: null,
        submitted: false
      };

      showLoading(false);
      navigateTo("quiz");
      buildQuestionNav();
      startQuestionTimer();
      renderCurrentQuestion();
      toast("Assessment started");
    }, 450);
  }

  function showLoading(show) {
    $("#loading-overlay").hidden = !show;
  }

  function abandonQuiz() {
    clearTimer();
    if (state.quiz) state.quiz.active = false;
    state.quiz = null;
    state.answeringLocked = false;
  }

  function clearTimer() {
    if (state.quiz?.timerId) {
      clearInterval(state.quiz.timerId);
      state.quiz.timerId = null;
    }
  }

  function secondsForCurrentQuestion() {
    const q = state.quiz;
    if (!q) return 60;
    if (q.difficulty !== "adaptive") return DIFFICULTY_CONFIG[q.difficulty].seconds;
    const current = q.questions[q.index];
    const map = { easy: 60, medium: 75, hard: 90 };
    return map[current.difficulty] || 75;
  }

  function startQuestionTimer() {
    clearTimer();
    const q = state.quiz;
    q.timerSeconds = secondsForCurrentQuestion();
    q.questionStartedAt = Date.now();
    updateTimerUI();
    q.timerId = setInterval(() => {
      q.timerSeconds -= 1;
      updateTimerUI();
      if (q.timerSeconds <= 0) {
        clearTimer();
        handleTimeExpired();
      }
    }, 1000);
  }

  function updateTimerUI() {
    const secs = Math.max(0, state.quiz.timerSeconds);
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    const display = $("#timer-display");
    const timer = $("#quiz-timer");
    display.textContent = `${m}:${s}`;
    timer.classList.remove("warning", "critical");
    if (secs <= 10) timer.classList.add("critical");
    else if (secs <= 20) timer.classList.add("warning");
  }

  function handleTimeExpired() {
    if (!state.quiz?.active) return;
    if (state.answeringLocked) {
      goNext(true);
      return;
    }
    state.answeringLocked = true;
    $("#btn-skip").disabled = true;
    toast("Time expired — question submitted", "error");
    recordAnswer(null, "skipped");
    revealAnswer(null);
    $("#btn-next").disabled = false;
    setTimeout(() => goNext(true), 1000);
  }

  function buildQuestionNav() {
    const nav = $("#question-nav");
    const strip = $("#mobile-q-strip");
    const n = state.quiz.questions.length;
    nav.innerHTML = "";
    strip.innerHTML = "";
    for (let i = 0; i < n; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "q-nav-btn";
      btn.dataset.index = String(i);
      btn.innerHTML = `<span>${String(i + 1).padStart(2, "0")}</span><span class="q-nav-status"></span>`;
      btn.addEventListener("click", () => {
        
        const answered = state.quiz.answers[i];
        if (i === state.quiz.index || answered) {
          
        }
      });
      nav.appendChild(btn);

      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "mobile-q-dot";
      dot.textContent = String(i + 1).padStart(2, "0");
      dot.dataset.index = String(i);
      strip.appendChild(dot);
    }
    refreshNavStates();
  }

  function refreshNavStates() {
    const { index, answers, questions } = state.quiz;
    $$(".q-nav-btn").forEach((btn, i) => {
      const ans = answers[i];
      btn.classList.remove("current", "correct", "incorrect", "skipped");
      const statusEl = btn.querySelector(".q-nav-status");
      if (i === index) btn.classList.add("current");
      if (ans) {
        btn.classList.add(ans.status);
        statusEl.textContent = ans.status === "correct" ? "✓" : ans.status === "incorrect" ? "✕" : "–";
      } else if (i === index) {
        statusEl.textContent = "●";
      } else {
        statusEl.textContent = "";
      }
    });
    $$(".mobile-q-dot").forEach((dot, i) => {
      const ans = answers[i];
      dot.classList.remove("current", "correct", "incorrect", "skipped");
      if (i === index) dot.classList.add("current");
      if (ans) dot.classList.add(ans.status);
    });

    const pct = Math.round((index / questions.length) * 100);
    $("#quiz-progress-fill").style.width = `${pct}%`;
    $("#quiz-progress-bar").setAttribute("aria-valuenow", String(pct));
    $("#quiz-progress-text").textContent = `Question ${String(index + 1).padStart(2, "0")} / ${String(questions.length).padStart(2, "0")}`;
  }

  function renderCurrentQuestion() {
    const q = state.quiz.questions[state.quiz.index];
    state.answeringLocked = false;
    state.quiz.submitted = false;

    $("#quiz-category-label").textContent = CATEGORY_META[state.quiz.category].name;
    $("#quiz-difficulty-label").textContent = DIFFICULTY_CONFIG[state.quiz.difficulty].label;

    $("#q-number").textContent = `Question ${String(state.quiz.index + 1).padStart(2, "0")}`;
    $("#q-type").textContent = TYPE_LABELS[q.type] || q.type;
    $("#q-text").textContent = q.question;

    const codeBlock = $("#q-code");
    if (q.code) {
      codeBlock.hidden = false;
      $("#q-code-content").textContent = q.code;
    } else {
      codeBlock.hidden = true;
      $("#q-code-content").textContent = "";
    }

    const optionsEl = $("#q-options");
    optionsEl.innerHTML = "";
    const letters = ["A", "B", "C", "D"];
    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.setAttribute("role", "option");
      btn.dataset.index = String(i);
      btn.innerHTML = `<span class="option-key">${letters[i]}</span><span class="option-text">${escapeHtml(opt)}</span>`;
      btn.addEventListener("click", () => selectOption(i));
      optionsEl.appendChild(btn);
    });

    $("#q-explanation").hidden = true;
    $("#btn-next").disabled = true;
    $("#btn-next").textContent = state.quiz.index === state.quiz.questions.length - 1 ? "Finish" : "Next";
    $("#btn-skip").disabled = false;

    refreshNavStates();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function selectOption(index) {
    if (state.answeringLocked || !state.quiz?.active) return;
    state.answeringLocked = true;
    $("#btn-skip").disabled = true;

    const q = state.quiz.questions[state.quiz.index];
    const correct = index === q.correctAnswer;
    const status = correct ? "correct" : "incorrect";
    recordAnswer(index, status);
    revealAnswer(index);
    $("#btn-next").disabled = false;
  }

  function skipQuestion() {
    if (state.answeringLocked || !state.quiz?.active) return;
    state.answeringLocked = true;
    $("#btn-skip").disabled = true;
    recordAnswer(null, "skipped");
    revealAnswer(null);
    $("#btn-next").disabled = false;
  }

  function recordAnswer(selected, status) {
    const timeSpent = Math.round((Date.now() - state.quiz.questionStartedAt) / 1000);
    const q = state.quiz.questions[state.quiz.index];
    state.quiz.answers[state.quiz.index] = {
      questionId: q.id,
      selected,
      status,
      timeSpent,
      category: q.category
    };
    clearTimer();
    
    state.quiz.questions = adaptiveReorder(state.quiz.questions, state.quiz.answers.filter(Boolean));
  }

  function revealAnswer(selected) {
    const q = state.quiz.questions[state.quiz.index];
    $$(".option-btn").forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.correctAnswer) btn.classList.add("correct");
      if (selected != null && i === selected && selected !== q.correctAnswer) {
        btn.classList.add("incorrect");
      }
      if (selected != null && i === selected) btn.classList.add("selected");
    });
    $("#q-explanation").hidden = false;
    $("#q-explanation-text").textContent = q.explanation;
    refreshNavStates();
  }

  function goNext(fromTimer = false) {
    if (!state.quiz?.active) return;
    if (!state.answeringLocked && !fromTimer) return;

    const nextIndex = state.quiz.index + 1;
    if (nextIndex >= state.quiz.questions.length) {
      finishQuiz();
      return;
    }
    state.quiz.index = nextIndex;
    startQuestionTimer();
    renderCurrentQuestion();
  }

  
  function finishQuiz() {
    clearTimer();
    const quiz = state.quiz;
    quiz.active = false;

    const total = quiz.questions.length;
    const correct = quiz.answers.filter((a) => a?.status === "correct").length;
    const incorrect = quiz.answers.filter((a) => a?.status === "incorrect").length;
    const skipped = quiz.answers.filter((a) => a?.status === "skipped").length;
    const score = Math.round((correct / total) * 100);
    const accuracy = total - skipped > 0 ? Math.round((correct / (total - skipped)) * 100) : 0;
    const timeUsed = Math.round((Date.now() - quiz.sessionStartedAt) / 1000);
    const avgTime = Math.round(
      quiz.answers.reduce((s, a) => s + (a?.timeSpent || 0), 0) / total
    );

    const breakdown = {};
    ["html", "css", "javascript"].forEach((cat) => {
      const items = quiz.answers.filter((a) => a?.category === cat);
      if (!items.length) return;
      const c = items.filter((a) => a.status === "correct").length;
      breakdown[cat] = Math.round((c / items.length) * 100);
    });

    const analysis = buildAnalysis(quiz, breakdown, score);

    const result = {
      id: `r_${Date.now()}`,
      date: new Date().toISOString(),
      category: quiz.category,
      difficulty: quiz.difficulty,
      score,
      accuracy,
      correct,
      incorrect,
      skipped,
      total,
      timeUsed,
      avgTime,
      breakdown,
      analysis,
      questions: quiz.questions,
      answers: quiz.answers
    };

    state.lastResult = result;
    persistResult(result);
    checkAchievements(result);
    state.quiz = null;
    state.answeringLocked = false;
    updateHeaderStats();
    navigateTo("results");
    toast("Assessment completed");
  }

  function buildAnalysis(quiz, breakdown, score) {
    const topicMap = {
      html: ["Semantic HTML", "Accessibility", "Forms & attributes"],
      css: ["CSS layout", "Responsive design", "Specificity & cascade"],
      javascript: ["JavaScript logic", "Async patterns", "DOM & events"]
    };

    const strengths = [];
    const improve = [];

    Object.entries(breakdown).forEach(([cat, pct]) => {
      const topics = topicMap[cat] || [CATEGORY_META[cat]?.name];
      if (pct >= 75) strengths.push(topics[0]);
      else if (pct < 60) improve.push(topics[0]);
      else if (pct < 75) improve.push(topics[1] || topics[0]);
    });

    
    const wrongTypes = quiz.answers
      .filter((a) => a?.status === "incorrect")
      .map((a) => quiz.questions.find((q) => q.id === a.questionId)?.type);

    if (wrongTypes.includes("debugging") && !improve.includes("Debugging")) {
      improve.push("Debugging scenarios");
    }
    if (wrongTypes.includes("code-output") && !improve.includes("Code tracing")) {
      improve.push("Code tracing");
    }

    if (!strengths.length && score >= 70) strengths.push("Overall consistency");
    if (!strengths.length) strengths.push("Keep practicing — progress compounds");
    if (!improve.length && score < 100) improve.push("Edge-case questions");
    if (!improve.length) improve.push("Maintain coverage across all topics");

    let headline = "Solid performance";
    if (score >= 90) headline = "Excellent assessment result";
    else if (score >= 75) {
      const top = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0];
      headline = top
        ? `Strong ${CATEGORY_META[top[0]]?.name || top[0]} fundamentals`
        : "Strong fundamentals";
    } else if (score >= 50) headline = "Developing proficiency";
    else headline = "Foundational review recommended";

    return {
      headline,
      strengths: [...new Set(strengths)].slice(0, 3),
      improve: [...new Set(improve)].slice(0, 3)
    };
  }

  function persistResult(result) {
    const history = getHistory();
    const slim = {
      id: result.id,
      date: result.date,
      category: result.category,
      difficulty: result.difficulty,
      score: result.score,
      accuracy: result.accuracy,
      correct: result.correct,
      incorrect: result.incorrect,
      skipped: result.skipped,
      total: result.total,
      timeUsed: result.timeUsed,
      avgTime: result.avgTime,
      breakdown: result.breakdown,
      analysis: result.analysis,
      
      review: result.questions.map((q, i) => ({
        question: q,
        answer: result.answers[i]
      }))
    };
    history.unshift(slim);
    saveJSON(STORAGE_KEYS.history, history.slice(0, 50));
  }

  function checkAchievements(result) {
    const unlocked = new Set(getUnlockedAchievements());
    const history = getHistory();
    const newly = [];

    const unlock = (id) => {
      if (!unlocked.has(id)) {
        unlocked.add(id);
        newly.push(id);
      }
    };

    unlock("first");
    if (result.score === 100) unlock("perfect");
    if (history.length >= 10) unlock("ten");
    if (result.category === "javascript" && result.score >= 90) unlock("js_master");
    if (result.category === "html" && result.score >= 90) unlock("html_pro");
    if (result.category === "css" && result.score >= 90) unlock("css_pro");
    if (result.category === "mixed") unlock("mixed");
    if (result.avgTime <= 20 && result.skipped === 0) unlock("speed");

    saveJSON(STORAGE_KEYS.achievements, [...unlocked]);
    newly.forEach((id) => {
      const a = ACHIEVEMENTS.find((x) => x.id === id);
      if (a) toast(`Achievement unlocked: ${a.name}`, "success");
    });
  }

  function renderResults(result) {
    $("#result-score").textContent = `${result.score}%`;
    $("#result-headline").textContent = result.analysis.headline;
    $("#result-correct").textContent = String(result.correct);
    $("#result-wrong").textContent = String(result.incorrect);
    $("#result-skipped").textContent = String(result.skipped);
    $("#result-time").textContent = formatDuration(result.timeUsed);

    const ring = $("#score-ring-fg");
    const circumference = 2 * Math.PI * 52;
    ring.style.strokeDasharray = String(circumference);
    ring.classList.remove("high", "mid", "low");
    if (result.score >= 75) ring.classList.add("high");
    else if (result.score >= 50) ring.classList.add("mid");
    else ring.classList.add("low");

    requestAnimationFrame(() => {
      const offset = circumference - (result.score / 100) * circumference;
      ring.style.strokeDashoffset = String(offset);
    });

    const breakdownEl = $("#result-breakdown");
    const cats = Object.keys(result.breakdown);
    if (!cats.length) {
      breakdownEl.innerHTML = `<p class="page-desc">Single-category assessment — overall score ${result.score}%.</p>`;
    } else {
      breakdownEl.innerHTML = cats
        .map((cat) => {
          const pct = result.breakdown[cat];
          return `
            <div class="breakdown-row">
              <span class="breakdown-label">${CATEGORY_META[cat]?.name || cat}</span>
              <div class="breakdown-bar"><div class="breakdown-fill" data-width="${pct}"></div></div>
              <span class="breakdown-pct">${pct}%</span>
            </div>`;
        })
        .join("");
      requestAnimationFrame(() => {
        $$(".breakdown-fill").forEach((el) => {
          el.style.width = `${el.dataset.width}%`;
        });
      });
    }

    $("#result-metrics").innerHTML = `
      <div class="metric">Accuracy: <strong>${result.accuracy}%</strong></div>
      <div class="metric">Avg / question: <strong>${result.avgTime}s</strong></div>
      <div class="metric">Total questions: <strong>${result.total}</strong></div>
      <div class="metric">Difficulty: <strong>${DIFFICULTY_CONFIG[result.difficulty]?.label}</strong></div>
    `;

    $("#result-analysis").innerHTML = `
      <div class="analysis-col strengths">
        <h3>Your strengths</h3>
        <ul>${result.analysis.strengths.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      </div>
      <div class="analysis-col improve">
        <h3>Needs improvement</h3>
        <ul>${result.analysis.improve.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
      </div>
    `;
  }

  
  function renderReview() {
    const result = state.lastResult;
    if (!result) return;
    const filter = state.reviewFilter;
    $$(".filter-btn").forEach((b) => {
      const on = b.dataset.filter === filter;
      b.classList.toggle("active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
    });

    const items = result.questions
      .map((q, i) => ({ q, a: result.answers[i] }))
      .filter(({ a }) => {
        if (filter === "all") return true;
        return a?.status === filter;
      });

    const list = $("#review-list");
    if (!items.length) {
      list.innerHTML = `<div class="empty-state"><h3>No questions in this filter</h3></div>`;
      return;
    }

    list.innerHTML = items
      .map(({ q, a }) => {
        const status = a?.status || "skipped";
        const userAns =
          a?.selected == null ? "Skipped" : q.options[a.selected];
        const correctAns = q.options[q.correctAnswer];
        return `
          <article class="review-item ${status}">
            <div class="review-status">${status}</div>
            <h3 class="review-q">${escapeHtml(q.question)}</h3>
            ${q.code ? `<pre class="code-block"><code>${escapeHtml(q.code)}</code></pre>` : ""}
            <div class="review-answers">
              <div>Your answer: <strong>${escapeHtml(userAns)}</strong></div>
              <div>Correct answer: <strong>${escapeHtml(correctAns)}</strong></div>
            </div>
            <div class="explanation">
              <p class="explanation-label">Explanation</p>
              <p class="explanation-text">${escapeHtml(q.explanation)}</p>
            </div>
          </article>`;
      })
      .join("");
  }

  
  function renderHistory() {
    const { history, best, avg, total, bestCategory } = computeStats();
    $("#history-summary").innerHTML = `
      <div class="summary-card"><div class="label">Personal Best</div><div class="value">${best != null ? best + "%" : "—"}</div></div>
      <div class="summary-card"><div class="label">Average Score</div><div class="value">${avg != null ? avg + "%" : "—"}</div></div>
      <div class="summary-card"><div class="label">Total Quizzes</div><div class="value">${total}</div></div>
      <div class="summary-card"><div class="label">Best Category</div><div class="value" style="font-size:1.1rem">${escapeHtml(bestCategory)}</div></div>
    `;

    const wrap = $("#history-table-wrap");
    if (!history.length) {
      wrap.innerHTML = `<div class="empty-state"><h3>No history yet</h3><p>Completed assessments will appear here.</p></div>`;
      return;
    }

    wrap.innerHTML = `
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Difficulty</th>
              <th>Score</th>
              <th>Accuracy</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${history
              .map(
                (h) => `
              <tr>
                <td>${formatDate(h.date)}</td>
                <td>${CATEGORY_META[h.category]?.name || h.category}</td>
                <td>${DIFFICULTY_CONFIG[h.difficulty]?.label || h.difficulty}</td>
                <td>${h.score}%</td>
                <td>${h.accuracy}%</td>
                <td>${formatDuration(h.timeUsed)}</td>
                <td><button type="button" class="btn btn-ghost btn-sm" data-open-result="${h.id}">Open</button></td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
      </div>`;
  }

  function openHistoryResult(id) {
    const entry = getHistory().find((h) => h.id === id);
    if (!entry || !entry.review) {
      toast("This attempt cannot be reviewed", "error");
      return;
    }
    state.lastResult = {
      ...entry,
      questions: entry.review.map((r) => r.question),
      answers: entry.review.map((r) => r.answer),
      analysis: entry.analysis
    };
    navigateTo("results");
  }

  
  function renderLeaderboard() {
    const { best, history } = computeStats();
    const rows = [...DEMO_LEADERBOARD];
    if (best != null && history[0]) {
      const bestEntry = [...history].sort((a, b) => b.score - a.score)[0];
      rows.push({
        name: "You",
        score: bestEntry.score,
        accuracy: bestEntry.accuracy,
        time: bestEntry.timeUsed,
        demo: false
      });
    }
    rows.sort((a, b) => b.score - a.score || a.time - b.time);

    $("#leaderboard-body").innerHTML = rows
      .map(
        (r, i) => `
      <tr class="${r.demo ? "" : "you"}">
        <td>${i + 1}</td>
        <td>${escapeHtml(r.name)}${r.demo ? ' <span style="color:var(--text-muted);font-size:11px">(demo)</span>' : ""}</td>
        <td>${r.score}%</td>
        <td>${r.accuracy}%</td>
        <td>${formatDuration(r.time)}</td>
      </tr>`
      )
      .join("");
  }

  
  function renderAchievementsPage() {
    const unlocked = new Set(getUnlockedAchievements());
    $("#achievements-grid").innerHTML = ACHIEVEMENTS.map(
      (a) => `
      <div class="achievement ${unlocked.has(a.id) ? "unlocked" : ""}">
        <div class="achievement-icon">${a.icon}</div>
        <div>
          <div class="achievement-name">${a.name}</div>
          <div class="achievement-desc">${a.desc}</div>
        </div>
      </div>`
    ).join("");
  }

  
  let leaveConfirmCallback = null;

  function openLeaveModal(onConfirm) {
    leaveConfirmCallback = onConfirm;
    $("#leave-modal").hidden = false;
    $("#btn-continue-quiz").focus();
  }

  function closeLeaveModal() {
    $("#leave-modal").hidden = true;
    leaveConfirmCallback = null;
  }

  
  function toggleProfile() {
    const pop = $("#profile-popover");
    updateHeaderStats();
    pop.hidden = !pop.hidden;
  }

  function closeProfile() {
    $("#profile-popover").hidden = true;
  }

  function toggleMobileNav() {
    const nav = $("#mobile-nav");
    const btn = $("#mobile-menu-btn");
    const open = nav.hidden;
    nav.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function closeMobileNav() {
    $("#mobile-nav").hidden = true;
    $("#mobile-menu-btn").setAttribute("aria-expanded", "false");
  }

  
  function formatDuration(secs) {
    const s = Math.max(0, Math.round(secs || 0));
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const r = String(s % 60).padStart(2, "0");
    return `${m}:${r}`;
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return iso;
    }
  }

  
  function tryAgain() {
    if (!state.lastResult) {
      showView("categories");
      return;
    }
    state.setupCategory = state.lastResult.category;
    state.setupDifficulty = state.lastResult.difficulty;
    beginQuiz();
  }

  
  function onKeyDown(e) {
    const tag = e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA") return;

    if (e.key === "Escape") {
      if (!$("#leave-modal").hidden) {
        closeLeaveModal();
        return;
      }
      if (!$("#profile-popover").hidden) {
        closeProfile();
        return;
      }
      if (state.view === "quiz" && state.quiz?.active) {
        openLeaveModal(() => {
          abandonQuiz();
          navigateTo("dashboard");
        });
      }
      return;
    }

    if (state.view !== "quiz" || !state.quiz?.active) return;

    if (["1", "2", "3", "4"].includes(e.key) && !state.answeringLocked) {
      e.preventDefault();
      selectOption(Number(e.key) - 1);
    }
    if (e.key === "Enter" && state.answeringLocked) {
      e.preventDefault();
      goNext();
    }
  }

  
  function bindEvents() {
    document.addEventListener("click", (e) => {
      const nav = e.target.closest("[data-nav]");
      if (nav) {
        e.preventDefault();
        const dest = nav.dataset.nav;
        if (dest === "results" && !state.lastResult) {
          toast("Complete an assessment to view results");
          return;
        }
        showView(dest);
        return;
      }

      const startCat = e.target.closest("[data-start-category]");
      if (startCat) {
        openSetup(startCat.dataset.startCategory);
        return;
      }

      const openRes = e.target.closest("[data-open-result]");
      if (openRes) {
        openHistoryResult(openRes.dataset.openResult);
        return;
      }

      if (!e.target.closest("#profile-popover") && !e.target.closest("#profile-btn")) {
        closeProfile();
      }
    });

    $("#theme-toggle").addEventListener("click", toggleTheme);
    $("#profile-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      toggleProfile();
    });
    $("#mobile-menu-btn").addEventListener("click", toggleMobileNav);

    $("#btn-start-assessment").addEventListener("click", () => showView("categories"));

    $$(".diff-card").forEach((card) => {
      card.addEventListener("click", () => selectDifficulty(card.dataset.difficulty));
    });

    $("#btn-begin-quiz").addEventListener("click", beginQuiz);
    $("#btn-exit-quiz").addEventListener("click", () => {
      openLeaveModal(() => {
        abandonQuiz();
        navigateTo("dashboard");
      });
    });
    $("#btn-continue-quiz").addEventListener("click", closeLeaveModal);
    $("#btn-leave-quiz").addEventListener("click", () => {
      const cb = leaveConfirmCallback;
      closeLeaveModal();
      if (cb) cb();
    });

    $("#btn-skip").addEventListener("click", skipQuestion);
    $("#btn-next").addEventListener("click", () => goNext());
    $("#btn-review").addEventListener("click", () => {
      state.reviewFilter = "all";
      navigateTo("review");
    });
    $("#btn-try-again").addEventListener("click", tryAgain);

    $$(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.reviewFilter = btn.dataset.filter;
        renderReview();
      });
    });

    document.addEventListener("keydown", onKeyDown);

    $("#leave-modal").addEventListener("click", (e) => {
      if (e.target.id === "leave-modal") closeLeaveModal();
    });
  }

  
  function init() {
    if (typeof QUESTIONS === "undefined") {
      console.error("questions.js failed to load");
      return;
    }
    initTheme();
    bindEvents();
    updateHeaderStats();
    navigateTo("dashboard");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
