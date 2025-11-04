
(function(){
  const modes = [
    {id:'poblacion', name:'Población', href:'index.html'},
    {id:'universo',  name:'Universo',  href:'universe.html'},
    {id:'marvel',    name:'Marvel',    href:'marvel.html'},
    {id:'bts',       name:'BTS',       href:'bts.html'},
  ];
  const current = document.body?.dataset?.mode || 'poblacion';
  const el = document.createElement('header');
  el.className = 'header';
  el.innerHTML = `
    <div class="wrap">
      <div class="brand"><div class="ball"></div> <div>MasoMenos</div></div>
      <nav class="nav">
        ${modes.map(m=>`<a data-id="${m.id}" href="${m.href}">${m.name}</a>`).join('')}
      </nav>
    </div>`;
  document.body.prepend(el);
  el.querySelectorAll('.nav a').forEach(a=>{
    if(a.dataset.id === current) a.classList.add('active');
  });
})();
