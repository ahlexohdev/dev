import { exercises } from "./data/exercises.js";

const STORAGE = "fisiopelvica-mvp-v1";
const initial = {
  professional:{name:"",registration:""},
  patients:[],
  selectedPatientId:null
};

let state = load();

function load(){
  try { return {...initial,...JSON.parse(localStorage.getItem(STORAGE)||"{}")}; }
  catch { return structuredClone(initial); }
}
function save(){ localStorage.setItem(STORAGE,JSON.stringify(state)); }
function esc(value=""){
  return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
}
function patient(){ return state.patients.find(p=>p.id===state.selectedPatientId); }

export function renderApp(){
  return `
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand"><div class="logo">FP</div><div><b>FisioPélvica</b><small>Assistente clínico</small></div></div>
      <nav>
        <button class="nav active" data-page="dashboard">Visão geral</button>
        <button class="nav" data-page="patient">Paciente</button>
        <button class="nav" data-page="assessment">Avaliação</button>
        <button class="nav" data-page="session">Sessão</button>
        <button class="nav" data-page="exercises">Exercícios</button>
        <button class="nav" data-page="progress">Evolução</button>
        <button class="nav" data-page="settings">Privacidade</button>
      </nav>
      <div class="side-note">MVP local • dados ficam neste navegador</div>
    </aside>
    <main class="main">
      <header class="topbar">
        <div><span class="eyebrow">FISIOTERAPIA PÉLVICA</span><h1 id="page-title">Visão geral</h1></div>
        <span class="status">● Ambiente local</span>
      </header>
      <section id="content"></section>
    </main>
  </div>`;
}

function render(page="dashboard"){
  const titles={dashboard:"Visão geral",patient:"Paciente",assessment:"Avaliação",session:"Sessão",exercises:"Exercícios",progress:"Evolução",settings:"Privacidade"};
  document.querySelector("#page-title").textContent=titles[page]||"Visão geral";
  document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
  const views={dashboard,patient:patientPage,assessment:assessmentPage,session:sessionPage,exercises:exercisePage,progress:progressPage,settings:settingsPage};
  document.querySelector("#content").innerHTML=(views[page]||dashboard)();
  bind(page);
}

function dashboard(){
  const p=patient();
  return `
  <div class="hero">
    <div><span class="eyebrow">CENTRO DE ATENDIMENTO</span><h2>Organize o atendimento sem tirar o foco do raciocínio clínico.</h2><p>Registre informações, objetivos e evolução em um fluxo simples.</p></div>
    <button class="primary" data-action="new-patient">+ Novo paciente</button>
  </div>
  <div class="stats">
    <article class="card"><span>Paciente atual</span><strong>${p?esc(p.name):"Nenhum"}</strong><small>${p?esc(p.goal||"Objetivo não definido"):"Selecione um paciente"}</small></article>
    <article class="card"><span>Total de pacientes</span><strong>${state.patients.length}</strong><small>Dados locais</small></article>
    <article class="card"><span>Sessões registradas</span><strong>${state.patients.reduce((n,x)=>n+(x.sessions?.length||0),0)}</strong><small>Histórico local</small></article>
  </div>
  <div class="panel"><h3>Fluxo recomendado</h3><div class="steps">
    <div><b>01</b><span>Triagem e consentimento</span></div>
    <div><b>02</b><span>Avaliação individual</span></div>
    <div><b>03</b><span>Objetivos e plano</span></div>
    <div><b>04</b><span>Sessão e evolução</span></div>
  </div></div>
  <div class="notice"><b>Uso profissional</b><p>O sistema não diagnostica nem prescreve automaticamente. Indicações, contraindicações, técnica e carga devem ser definidos pelo fisioterapeuta.</p></div>`;
}

function patientPage(){
  const p=patient()||{};
  return `
  <div class="panel"><h3>Cadastro do paciente</h3><p class="muted">Use somente os dados necessários para o atendimento.</p>
  <form id="patient-form" class="form">
    <input type="hidden" name="id" value="${esc(p.id||"")}">
    <label>Nome<input name="name" required value="${esc(p.name||"")}" placeholder="Nome do paciente"></label>
    <div class="two"><label>Data de nascimento<input name="birth" type="date" value="${esc(p.birth||"")}"></label><label>Telefone<input name="phone" value="${esc(p.phone||"")}" placeholder="Opcional"></label></div>
    <label>Queixa/objetivo principal<textarea name="goal" placeholder="Resumo informado pelo paciente">${esc(p.goal||"")}</textarea></label>
    <label class="check"><input type="checkbox" name="consent" ${p.consent?"checked":""}> Consentimento registrado conforme o procedimento da clínica</label>
    <button class="primary">Salvar paciente</button>
  </form></div>
  <div class="panel"><h3>Pacientes</h3>${state.patients.length?state.patients.map(x=>`<button class="patient-row ${x.id===state.selectedPatientId?"selected":""}" data-patient="${x.id}"><b>${esc(x.name)}</b><small>${esc(x.goal||"Sem objetivo definido")}</small></button>`).join(""):"<p class='muted'>Nenhum paciente cadastrado.</p>"}</div>`;
}

function assessmentPage(){
  const p=patient(); if(!p)return empty("Selecione um paciente antes de registrar a avaliação.");
  const a=p.assessment||{};
  return `
  <div class="panel"><h3>Avaliação funcional</h3><p class="muted">Registre achados. O aplicativo não interpreta os dados automaticamente.</p>
  <form id="assessment-form" class="form">
    <label>Sintomas e história relevante<textarea name="symptoms">${esc(a.symptoms||"")}</textarea></label>
    <div class="two"><label>Desconforto (0–10)<input name="pain" type="number" min="0" max="10" value="${esc(a.pain||"")}"></label><label>Impacto funcional<textarea name="impact">${esc(a.impact||"")}</textarea></label></div>
    <label>Achados da avaliação<textarea name="findings" placeholder="Registre achados pertinentes à avaliação profissional.">${esc(a.findings||"")}</textarea></label>
    <label>Alertas/encaminhamentos considerados<textarea name="alerts">${esc(a.alerts||"")}</textarea></label>
    <label>Objetivos terapêuticos<textarea name="objectives">${esc(a.objectives||"")}</textarea></label>
    <button class="primary">Salvar avaliação</button>
  </form></div>`;
}

function sessionPage(){
  const p=patient(); if(!p)return empty("Selecione um paciente antes de registrar uma sessão.");
  return `
  <div class="panel"><h3>Registro da sessão</h3>
  <form id="session-form" class="form">
    <div class="two"><label>Data<input name="date" type="date" value="${new Date().toISOString().slice(0,10)}"></label><label>Duração (min)<input name="duration" type="number" min="1" value="50"></label></div>
    <label>Tipo<select name="type"><option>Avaliação</option><option>Tratamento</option><option>Reavaliação</option><option>Orientação</option></select></label>
    <label>Intervenções realizadas<textarea name="interventions"></textarea></label>
    <label>Resposta/tolerância<textarea name="response"></textarea></label>
    <label>Plano para próxima sessão<textarea name="next"></textarea></label>
    <button class="primary">Salvar evolução</button>
  </form></div>`;
}

function exercisePage(){
  return `
  <div class="toolbar"><input id="exercise-search" placeholder="Buscar exercício..."><span class="muted">${exercises.length} opções iniciais</span></div>
  <div id="exercise-list" class="exercise-grid">${exerciseCards(exercises)}</div>`;
}
function exerciseCards(list){
  return list.map(e=>`<article class="card exercise"><span class="tag">${esc(e.category)}</span><h3>${esc(e.name)}</h3><p><b>Objetivo:</b> ${esc(e.goal)}</p><p><b>Dosagem:</b> ${esc(e.dosage)}</p><small>⚠ ${esc(e.caution)}</small><button class="secondary" data-exercise="${e.id}">Selecionar para o plano</button></article>`).join("")||"<p class='muted'>Nenhum exercício encontrado.</p>";
}

function progressPage(){
  const p=patient(); if(!p)return empty("Selecione um paciente para visualizar a evolução.");
  const sessions=p.sessions||[];
  return `
  <div class="panel"><h3>Evolução — ${esc(p.name)}</h3><p class="muted">Histórico das sessões registradas neste navegador.</p></div>
  <div class="timeline">${sessions.length?sessions.slice().reverse().map(s=>`<article class="timeline-item"><div><b>${esc(s.date)}</b><span>${esc(s.type)} • ${esc(s.duration)} min</span></div><p>${esc(s.interventions||"Sem intervenção descrita.")}</p><small>Resposta: ${esc(s.response||"—")}</small></article>`).join(""):"<div class='panel'><p>Nenhuma sessão registrada.</p></div>"}</div>`;
}

function settingsPage(){
  return `
  <div class="panel"><h3>Dados do profissional</h3><form id="professional-form" class="form"><label>Nome<input name="name" value="${esc(state.professional.name)}"></label><label>Registro profissional<input name="registration" value="${esc(state.professional.registration)}"></label><button class="primary">Salvar</button></form></div>
  <div class="panel"><h3>Dados e privacidade</h3><p>O MVP armazena dados no navegador. Isso não é suficiente para uso clínico de produção.</p><div class="actions"><button class="secondary" data-action="export">Exportar backup JSON</button><button class="secondary" data-action="import">Importar JSON</button><button class="danger" data-action="clear">Apagar dados locais</button></div><input id="import-file" type="file" accept=".json,application/json" hidden></div>
  <div class="notice"><b>Antes de produção</b><p>Precisaremos implementar autenticação, permissões, criptografia, auditoria, retenção/eliminação e adequação à LGPD.</p></div>`;
}

function empty(message){return `<div class="empty"><h2>Próximo passo</h2><p>${esc(message)}</p><button class="primary" data-page="patient">Ir para paciente</button></div>`;}

function bind(){
  document.querySelectorAll(".nav").forEach(b=>b.onclick=()=>render(b.dataset.page));
  document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>render(b.dataset.page));
  document.querySelectorAll("[data-patient]").forEach(b=>b.onclick=()=>{state.selectedPatientId=b.dataset.patient;save();render("patient");});

  const form=document.querySelector("#patient-form");
  if(form)form.onsubmit=e=>{
    e.preventDefault();
    const d=Object.fromEntries(new FormData(form));
    let p=state.patients.find(x=>x.id===d.id);
    if(!p){p={id:crypto.randomUUID(),sessions:[]};state.patients.push(p);}
    Object.assign(p,{name:d.name,birth:d.birth,phone:d.phone,goal:d.goal,consent:form.consent.checked});
    state.selectedPatientId=p.id;save();render("patient");
  };

  const assessment=document.querySelector("#assessment-form");
  if(assessment)assessment.onsubmit=e=>{e.preventDefault();const p=patient();p.assessment=Object.fromEntries(new FormData(assessment));save();alert("Avaliação salva.");};

  const session=document.querySelector("#session-form");
  if(session)session.onsubmit=e=>{
    e.preventDefault();
    const p=patient(),d=Object.fromEntries(new FormData(session));
    p.sessions=p.sessions||[];p.sessions.push({...d,createdAt:new Date().toISOString()});
    save();render("progress");
  };

  const search=document.querySelector("#exercise-search");
  if(search)search.oninput=()=>{const q=search.value.toLowerCase();document.querySelector("#exercise-list").innerHTML=exerciseCards(exercises.filter(e=>(e.name+" "+e.category+" "+e.goal).toLowerCase().includes(q)));bindExerciseButtons();};
  bindExerciseButtons();

  document.querySelector("[data-action='new-patient']")?.addEventListener("click",()=>{state.selectedPatientId=null;render("patient");});
  document.querySelector("[data-action='export']")?.addEventListener("click",exportData);
  document.querySelector("[data-action='import']")?.addEventListener("click",()=>document.querySelector("#import-file").click());
  document.querySelector("#import-file")?.addEventListener("change",importData);
  document.querySelector("[data-action='clear']")?.addEventListener("click",()=>{if(confirm("Apagar todos os dados locais?")){localStorage.removeItem(STORAGE);state=load();render("dashboard");}});
  const professional=document.querySelector("#professional-form");
  if(professional)professional.onsubmit=e=>{e.preventDefault();state.professional=Object.fromEntries(new FormData(professional));save();alert("Dados salvos.");};
}
function bindExerciseButtons(){document.querySelectorAll("[data-exercise]").forEach(b=>b.onclick=()=>alert("Exercício selecionado. A indicação e dosagem final devem ser validadas pelo fisioterapeuta."));}
function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="fisiopelvica-backup.json";a.click();URL.revokeObjectURL(a.href);}
function importData(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{state=JSON.parse(reader.result);save();render("dashboard");alert("Backup importado.");}catch{alert("JSON inválido.");}};reader.readAsText(file);}

render("dashboard");
