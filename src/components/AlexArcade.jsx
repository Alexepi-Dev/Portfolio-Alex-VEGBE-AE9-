import { useCallback, useEffect, useRef, useState } from "react";
import "./AlexArcade.css";

const QUESTIONS = [
  { category: "HTML", question: "Quelle balise représente le contenu principal d’une page HTML ?", answers: ["<section>", "<main>", "<header>", "<article>"], correct: 1, explanation: "<main> identifie le contenu principal de la page." },
  { category: "CSS", question: "Quelle déclaration active une mise en page CSS Grid ?", answers: ["display: grid", "position: grid", "layout: grid", "grid: display"], correct: 0, explanation: "display: grid active le modèle de mise en page CSS Grid." },
  { category: "JavaScript", question: "Quelle méthode crée un tableau en transformant chaque élément ?", answers: ["filter()", "find()", "map()", "reduce()"], correct: 2, explanation: "map() renvoie un nouveau tableau issu de la transformation de chaque élément." },
  { category: "React", question: "Quel hook permet de gérer un état local dans un composant fonctionnel ?", answers: ["useRoute()", "useState()", "useClass()", "useStyle()"], correct: 1, explanation: "useState() fournit une valeur d’état et une fonction pour la mettre à jour." },
  { category: "Web", question: "Que signifie le sigle API ?", answers: ["Application Programming Interface", "Automated Program Internet", "Applied Protocol Integration", "Application Process Indicator"], correct: 0, explanation: "Une API définit comment des logiciels ou services communiquent entre eux." },
  { category: "JavaScript", question: "Quel opérateur compare la valeur et le type sans conversion implicite ?", answers: ["==", "=", "===", "!="], correct: 2, explanation: "L’opérateur === réalise une comparaison stricte de la valeur et du type." },
  { category: "CSS", question: "Quelle unité est relative à la taille de police de l’élément racine ?", answers: ["em", "rem", "vh", "px"], correct: 1, explanation: "rem se base sur la taille de police de l’élément racine, généralement html." },
  { category: "React", question: "À quoi sert la prop key dans une liste React ?", answers: ["À styliser un élément", "À déclencher un clic", "À identifier les éléments entre les rendus", "À rendre le composant privé"], correct: 2, explanation: "key aide React à identifier les éléments et à suivre leurs changements entre les rendus." },
  { category: "Accessibilité", question: "À quoi sert principalement l’attribut alt d’une image informative ?", answers: ["À réduire son poids", "À fournir un texte de remplacement", "À la centrer", "À accélérer le chargement"], correct: 1, explanation: "Le texte alternatif transmet l’information de l’image, notamment aux lecteurs d’écran." },
  { category: "Web", question: "Quel protocole protège généralement les échanges web avec TLS ?", answers: ["FTP", "HTTP seul", "HTTPS", "SMTP"], correct: 2, explanation: "HTTPS utilise TLS pour protéger les échanges entre le navigateur et le serveur." },
  { category: "JavaScript", question: "Quelle déclaration convient à une variable réassignable limitée à un bloc ?", answers: ["const", "let", "static", "fixed"], correct: 1, explanation: "let déclare une variable réassignable dont la portée est limitée au bloc." },
  { category: "Git", question: "Quelle commande crée un commit à partir des changements indexés ?", answers: ["git push", "git status", "git commit", "git clone"], correct: 2, explanation: "git commit enregistre les changements indexés dans l’historique local." },
];
const COUNT = 10;
const SECONDS = 15;
const BEST_KEY = "alex-arcade-best-score-v1";
const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
};
function loadBest() { try { return Math.max(0, Number(localStorage.getItem(BEST_KEY)) || 0); } catch { return 0; } }

export default function AlexArcade() {
  const [screen, setScreen] = useState("intro");
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(SECONDS);
  const [best, setBest] = useState(0);
  const [sound, setSound] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const audioRef = useRef(null);
  const advanceRef = useRef(null);
  const current = questions[index];

  useEffect(() => { setBest(loadBest()); return () => clearTimeout(advanceRef.current); }, []);

  const tone = useCallback((frequency = 440, duration = 0.1) => {
    if (!sound) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioRef.current) audioRef.current = new AudioCtx();
      const ctx = audioRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = "triangle"; osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + duration + 0.02);
    } catch { /* Le jeu reste utilisable si l’audio est indisponible. */ }
  }, [sound]);

  const finish = useCallback((finalScore) => {
    setScreen("result");
    setBest((old) => {
      const next = Math.max(old, finalScore);
      try { localStorage.setItem(BEST_KEY, String(next)); } catch { /* stockage indisponible */ }
      return next;
    });
    tone(finalScore >= 700 ? 660 : 280, 0.22);
  }, [tone]);

  const nextQuestion = useCallback((nextScore) => {
    if (index + 1 >= questions.length) { finish(nextScore); return; }
    setIndex((i) => i + 1); setSelected(null); setTime(SECONDS); setScreen("playing");
  }, [finish, index, questions.length]);

  const answer = useCallback((answerIndex) => {
    if (screen !== "playing" || selected !== null || !current) return;
    const timedOut = answerIndex < 0;
    const isCorrect = answerIndex === current.correct;
    const nextScore = score + (isCorrect ? Math.max(10, time * 10) : 0);
    if (!timedOut) setSelected(answerIndex);
    setCorrectAnswer(isCorrect); setScore(nextScore); setScreen("feedback");
    tone(isCorrect ? 720 : 190, 0.13);
    advanceRef.current = window.setTimeout(() => nextQuestion(nextScore), 1450);
  }, [current, nextQuestion, score, screen, selected, time, tone]);

  const start = useCallback(() => {
    clearTimeout(advanceRef.current);
    const picked = shuffle(QUESTIONS).slice(0, COUNT).map((q) => {
      const order = shuffle(q.answers.map((_, i) => i));
      return { ...q, answers: order.map((i) => q.answers[i]), correct: order.indexOf(q.correct) };
    });
    setQuestions(picked); setIndex(0); setSelected(null); setScore(0); setTime(SECONDS); setScreen("playing"); tone(520, 0.1);
  }, [tone]);

  useEffect(() => {
    if (screen !== "playing") return undefined;
    if (time <= 0) { answer(-1); return undefined; }
    const timer = window.setTimeout(() => setTime((t) => t - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [answer, screen, time]);

  useEffect(() => () => { if (audioRef.current && audioRef.current.state !== "closed") audioRef.current.close(); }, []);

  return <section className="alex-arcade" aria-label="Alex Arcade — quiz de développement web">
    <div className="aa-glow aa-glow-left" aria-hidden="true" /><div className="aa-glow aa-glow-right" aria-hidden="true" />
    <div className="aa-shell">
      <header className="aa-header">
        <div className="aa-brand"><span className="aa-logo">ϟ</span><span><strong>ALEX<span>ARCADE</span></strong><small>LE LABORATOIRE DU CODE</small></span></div>
        <div className="aa-header-right"><span className="aa-live"><i /> ARCADE EN LIGNE</span><button className="aa-sound" type="button" onClick={() => setSound(v => !v)} aria-label={sound ? "Désactiver le son" : "Activer le son"} title={sound ? "Désactiver le son" : "Activer le son"}>{sound ? "♫" : "♩̸"}</button></div>
      </header>

      {screen === "intro" && <div className="aa-intro">
        <div className="aa-kicker">✦ MINI-JEU INTERACTIF <span>V. 1.0</span></div>
        <div className="aa-hero">
          <div className="aa-copy"><h2>Teste ton<br /><span>niveau de code.</span></h2><p>10 questions. 15 secondes par réponse. Un seul objectif : battre ton record.</p>
            <div className="aa-features"><span>◷ 15 s / question</span><span>♜ Record personnel</span></div>
            <button className="aa-primary" onClick={start} type="button">Lancer le défi <span>↗</span></button><p className="aa-note">Aucun compte requis · Record conservé sur cet appareil</p>
          </div>
          <div className="aa-art" aria-hidden="true"><div className="aa-ring aa-ring-a"/><div className="aa-ring aa-ring-b"/><div className="aa-core">ϟ</div><span className="aa-float aa-float-a">&lt;/&gt;</span><span className="aa-float aa-float-b">JS</span><span className="aa-float aa-float-c">01</span><small>READY PLAYER 01</small></div>
        </div>
        <div className="aa-stats"><div><span>QUESTIONS</span><strong>10</strong><small>sélection aléatoire</small></div><div><span>THÈMES</span><strong>06</strong><small>web & développement</small></div><div><span>TON RECORD</span><strong>{best}<em> pts</em></strong><small>sur cet appareil</small></div></div>
      </div>}

      {(screen === "playing" || screen === "feedback") && current && <div className="aa-game">
        <div className="aa-game-heading"><div><span className="aa-eyebrow">ÉPREUVE EN COURS</span><h2>Défi <span>code.</span></h2></div><div className={`aa-timer ${time <= 5 ? "urgent" : ""}`}>◷ <strong>00:{String(time).padStart(2, "0")}</strong></div></div>
        <div className="aa-progress-label"><span>QUESTION {String(index + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</span><span>{score} PTS</span></div>
        <div className="aa-progress"><span style={{ width: `${(index / questions.length) * 100}%` }} /></div>
        <article className="aa-question-card"><div className="aa-question-meta"><span className="aa-category">{current.category}</span><span>JUSQU’À +150 PTS</span></div><h3>{current.question}</h3>
          <div className="aa-answers">{current.answers.map((choice, i) => { const chosen = selected === i; const right = i === current.correct; let cls = ""; if (screen === "feedback" && right) cls = "right"; else if (screen === "feedback" && chosen && !right) cls = "wrong"; return <button key={choice} type="button" className={`aa-answer ${cls}`} onClick={() => answer(i)} disabled={screen !== "playing"}><span className="aa-letter">{String.fromCharCode(65 + i)}</span><span>{choice}</span><span className="aa-answer-mark">{screen === "feedback" && right ? "✓" : screen === "feedback" && chosen ? "×" : ""}</span></button>; })}</div>
          {screen === "feedback" && <div className={`aa-explanation ${correctAnswer ? "good" : "bad"}`}><strong>{correctAnswer ? "Bien joué !" : selected === null ? "Temps écoulé !" : "Pas cette fois."}</strong><span>{current.explanation}</span></div>}
        </article><div className="aa-game-footer"><span><i /> MODE SOLO</span><span>MEILLEUR SCORE <strong>{best} PTS</strong></span></div>
      </div>}

      {screen === "result" && <div className="aa-result"><div className="aa-trophy">♜</div><span className="aa-eyebrow">SESSION TERMINÉE</span><h2>{score >= 900 ? "Niveau supérieur." : score >= 500 ? "Bien joué, développeur." : "Le prochain run sera meilleur."}</h2><p>Tu as terminé le défi Alex Arcade.</p><div className="aa-final-score"><span>SCORE FINAL</span><strong>{score.toLocaleString("fr-FR")}</strong><small>POINTS</small></div><div className="aa-result-stats"><div><span>RECORD PERSONNEL</span><strong>♜ {best} pts</strong></div><div><span>QUESTIONS JOUÉES</span><strong>{questions.length}</strong></div><div><span>MAX / QUESTION</span><strong>150 pts</strong></div></div><button className="aa-primary" type="button" onClick={start}>Rejouer <span>↻</span></button><button className="aa-secondary" type="button" onClick={() => setScreen("intro")}>Retour à l’accueil</button><p className="aa-note">Le meilleur score est enregistré localement dans ton navigateur.</p></div>}

    </div>
  </section>;
}
