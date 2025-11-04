
async function loadData(mode){
  const url = `data/${mode}.json`;
  const res = await fetch(url);
  if(!res.ok) throw new Error('No se pudo cargar el dataset: '+mode);
  return res.json();
}
function pickTwo(arr){
  if(arr.length < 2) return [null,null];
  const i = Math.floor(Math.random()*arr.length);
  let j = Math.floor(Math.random()*arr.length);
  while(j === i) j = Math.floor(Math.random()*arr.length);
  return [arr[i], arr[j]];
}
function formatValue(x){
  if(typeof x !== 'number') return x;
  const abs = Math.abs(x);
  if(abs >= 1e12) return (x/1e12).toFixed(2)+' T';
  if(abs >= 1e9)  return (x/1e9).toFixed(2)+' B';
  if(abs >= 1e6)  return (x/1e6).toFixed(2)+' M';
  if(abs >= 1e3)  return (x/1e3).toFixed(2)+' k';
  return x.toLocaleString('es-ES');
}
function cardHTML(item, reveal=false){
  return `
    <div class="card">
      <div class="emoji">${item.emoji||'🃏'}</div>
      <div class="title">${item.name}</div>
      <div class="meta">${item.subtitle||''}</div>
      <div class="value">${reveal ? formatValue(item.value) : '—'}</div>
    </div>
  `;
}
function renderBoard(state){
  const board = document.getElementById('board');
  board.innerHTML = `
    <div class="banner">${state.question}</div>
    <div class="score"><div>Puntuación: <b>${state.score}</b></div><div class="small">${state.unitNote||''}</div></div>
    <div class="vs"><span>¿Cuál es MAYOR?</span></div>
    <div class="grid">${cardHTML(state.a,false)}${cardHTML(state.b,false)}</div>
    <div class="actions">
      <button id="btnA">${state.a.name}</button>
      <button id="btnB" class="secondary">${state.b.name}</button>
    </div>
  `;
  // Insert cards into grid element
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fit,minmax(280px,1fr))';
  grid.style.gap = '22px';
  const temp = document.createElement('div');
  temp.innerHTML = `${cardHTML(state.a,false)}${cardHTML(state.b,false)}`;
  const cards = temp.querySelectorAll('.card');
  cards.forEach(c=>grid.appendChild(c));
  const boardEl = document.getElementById('board');
  const vsEl = boardEl.querySelector('.vs');
  boardEl.insertBefore(grid, vsEl.nextSibling);

  document.getElementById('btnA').onclick = ()=>evaluate('A', state);
  document.getElementById('btnB').onclick = ()=>evaluate('B', state);
}
function reveal(state, correct){
  const board = document.getElementById('board');
  const cards = board.querySelectorAll('.card');
  cards[0].querySelector('.value').textContent = formatValue(state.a.value);
  cards[1].querySelector('.value').textContent = formatValue(state.b.value);
  // flash feedback
  cards[0].style.boxShadow = (correct==='A')?'0 0 0 3px var(--ok) inset, var(--shadow)':'0 0 0 3px var(--bad) inset, var(--shadow)';
  cards[1].style.boxShadow = (correct==='B')?'0 0 0 3px var(--ok) inset, var(--shadow)':'0 0 0 3px var(--bad) inset, var(--shadow)';
}
function nextRound(state, dataset){
  const [a,b] = pickTwo(dataset);
  state.a = a; state.b = b;
  renderBoard(state);
}
function evaluate(choice, state){
  const correct = state.a.value === state.b.value ? 'A' : (state.a.value > state.b.value ? 'A':'B');
  reveal(state, correct);
  const picked = choice;
  if(picked === correct) state.score += 1; else state.score = 0;
  setTimeout(()=>{
    nextRound(state, state._dataset);
  }, 900);
}
async function initGame(){
  const mode = document.body.dataset.mode;
  const dataset = await loadData(mode);
  const state = {
    question: dataset.question,
    unitNote: dataset.unitNote || '',
    score: 0,
    a: null, b: null,
    _dataset: dataset.items
  };
  nextRound(state, dataset.items);
}
document.addEventListener('DOMContentLoaded', initGame);
