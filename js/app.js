
/* MasoMenos — Higher or Lower (ES/EN) */
const MODES = [
  { id: 'population', label: {es:'Población', en:'Population'}, question: {es:'¿En qué país hay más población?', en:'Which country has more population?'}, data: 'data/population.json', valueFmt: n => n.toLocaleString() },
  { id: 'universe', label: {es:'Universo', en:'Universe'}, question: {es:'¿Cuál es mayor?', en:'Which is bigger?'}, data: 'data/universe.json', valueFmt: n => String(n) },
  { id: 'marvel', label: {es:'Marvel', en:'Marvel'}, question: {es:'¿Qué personaje es más poderoso?', en:'Who is more powerful?'}, data: 'data/marvel.json', valueFmt: n => n },
  { id: 'bts', label: {es:'BTS', en:'BTS'}, question: {es:'¿Cuál tiene más años?', en:'Which is older?'}, data: 'data/bts.json', valueFmt: n => n + ' años' },
];

const LS_KEY = 'masomenos_best';
let lang = (localStorage.getItem('mm_lang') || 'es');
let mode = (localStorage.getItem('mm_mode') || 'population');
let dataset = [];
let score = 0;
let best = JSON.parse(localStorage.getItem(LS_KEY)||'{}'); // per-mode best

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

function setLang(next) {
  lang = next;
  localStorage.setItem('mm_lang', lang);
  renderQuestion();
  renderNav();
  renderStats();
  $("#btnContinue").textContent = lang==='es' ? "Continuar" : "Continue";
  $("#btnRestart").textContent = lang==='es' ? "Reiniciar" : "Restart";
}

function renderNav(){
  const nav = $("#modeNav");
  nav.innerHTML = "";
  MODES.forEach(m => {
    const b = document.createElement("button");
    b.textContent = m.label[lang];
    b.className = (m.id === mode ? "active" : "");
    b.onclick = () => switchMode(m.id);
    nav.appendChild(b);
  })
}

function renderQuestion(){
  const m = MODES.find(x=>x.id===mode);
  $("#question").textContent = m? m.question[lang]: "";
}

function renderStats(){
  const bestForMode = (best && best[mode]) || 0;
  $("#score").textContent = String(score);
  $("#best").textContent = (lang==='es'? "Récord: ":"Best: ") + bestForMode;
}

function shuffle(arr){
  for(let i=arr.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}

async function loadData(){
  const m = MODES.find(x=>x.id===mode);
  const res = await fetch(m.data);
  dataset = await res.json();
  shuffle(dataset);
  nextRound();
}

let currentPair = [];
function nextRound(){
  // pick 2 distinct random options
  if (dataset.length < 2) return;
  const a = dataset[Math.floor(Math.random()*dataset.length)];
  let b = dataset[Math.floor(Math.random()*dataset.length)];
  while (b.name === a.name) b = dataset[Math.floor(Math.random()*dataset.length)];
  currentPair = [a,b];
  drawCards(currentPair, false);
}

function valueOf(item){ return item.value; }

function drawCards(pair, revealed){
  const board = $("#board");
  board.innerHTML = "";
  pair.forEach((item, idx)=>{
    const card = document.createElement("div");
    card.className = "card" + (revealed ? " revealed" : "");
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.onclick = () => onPick(idx);
    card.onkeydown = (e)=>{ if(e.key==='Enter' || e.key===' ') onPick(idx); };

    const imgwrap = document.createElement("div");
    imgwrap.className = "imgwrap";
    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = item.name;
    img.src = item.image;
    imgwrap.appendChild(img);

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = item.name;

    const value = document.createElement("div");
    value.className = "value";
    const m = MODES.find(x=>x.id===mode);
    value.textContent = m.valueFmt(item.value);

    card.appendChild(imgwrap);
    card.appendChild(label);
    card.appendChild(value);
    board.appendChild(card);
  })
}

let locked = false;
function onPick(index){
  if (locked) return;
  locked = true;
  const [a,b] = currentPair;
  const correct = valueOf(a) === valueOf(b) ? -1 : (valueOf(a) > valueOf(b) ? 0 : 1);
  const cards = $$(".card");
  // reveal values
  cards.forEach(c=>c.classList.add("revealed"));
  // mark correctness
  if (index === correct){
    cards[index].classList.add("correct");
    score += 1;
  } else if (correct === -1){
    // tie: treat as correct either way
    cards[index].classList.add("correct");
    score += 1;
  } else {
    cards[index].classList.add("incorrect");
    // reset score
    score = 0;
  }
  // update best
  best = JSON.parse(localStorage.getItem(LS_KEY)||'{}');
  if (!best[mode] || score > best[mode]){
    best[mode] = score;
    localStorage.setItem(LS_KEY, JSON.stringify(best));
  }
  renderStats();
  setTimeout(()=>{ locked=false; }, 250);
}

function restart(){
  score = 0;
  renderStats();
  nextRound();
}

function switchMode(next){
  mode = next;
  localStorage.setItem('mm_mode', mode);
  renderNav();
  renderQuestion();
  score = 0;
  renderStats();
  loadData();
}

document.addEventListener("DOMContentLoaded", ()=>{
  document.title = lang==='es' ? "MasoMenos — ¿Qué tan ARMY eres?" : "MasoMenos — How ARMY are you?";
  renderNav();
  renderQuestion();
  renderStats();
  $("#btnContinue").addEventListener("click", ()=> nextRound());
  $("#btnRestart").addEventListener("click", ()=> restart());
  $("#langES").addEventListener("click", ()=> setLang('es'));
  $("#langEN").addEventListener("click", ()=> setLang('en'));
  $("#year").textContent = new Date().getFullYear();
  loadData();
});
