import { useState, useRef, useEffect } from "react";

// ── CONFIG ────────────────────────────────────────────────────────
const SUPABASE_URL = "https://odcmxytazbtwbdjqbosc.supabase.co";
const SUPABASE_KEY = "sb_publishable_HbzbOANXyabiwQ7bEjJB3w_X3CxAYkH";

async function verificarSenha(senha) {
  if (senha.toUpperCase() === "DEMO-2026") return { ok: true };
  if (!SUPABASE_URL.includes("supabase")) return { ok: false, erro: "config" };
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/pdi_senhas?senha=eq.${senha.toUpperCase()}&select=*`,
    { headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` } }
  );
  if (!res.ok) return { ok: false, erro: "network" };
  const data = await res.json();
  if (!data.length) return { ok: false, erro: "invalida" };
  if (new Date(data[0].expira_em) < new Date()) return { ok: false, erro: "expirada" };
  return { ok: true };
}

// ── CORES ─────────────────────────────────────────────────────────
const C = {
  navy:"#0F1D3A", navyMid:"#1A3160", navyLight:"#234080",
  amber:"#F5A623", slate:"#EEF2FA", slateDeep:"#C5D0E6",
  white:"#FFFFFF", green:"#1DB87A", red:"#E05252",
  text:"#0F1D3A", textMid:"#4A5A7A", textLight:"#8A9BBB",
  teal:"#0891B2", purple:"#7C3AED", orange:"#EA580C",
  gold:"#F5C518", silver:"#C0C0C0", bronze:"#CD7F32",
};


// ── PALETAS PARA O POWERPOINT (personalização do participante) ─────
// A cor de destaque (hoje âmbar) é trocada em todo o PPTX pela cor escolhida.
const PALETAS = [
  { id:"amber",  nome:"Âmbar",     cor:"F5A623" },
  { id:"teal",   nome:"Turquesa",  cor:"0891B2" },
  { id:"purple", nome:"Roxo",      cor:"7C3AED" },
  { id:"green",  nome:"Verde",     cor:"1DB87A" },
  { id:"rose",   nome:"Rosê",      cor:"EC4899" },
  { id:"coral",  nome:"Coral",     cor:"E05252" },
];

// ── DADOS ESTÁTICOS ───────────────────────────────────────────────
const ETAPAS = [
  { id:"senha",     icon:"🔑", titulo:"Acesso" },
  { id:"lgpd",      icon:"🔒", titulo:"Privacidade" },
  { id:"inicio",    icon:"✨", titulo:"Ponto de Partida" },
  { id:"sobre",     icon:"👤", titulo:"Sobre Mim" },
  { id:"conquistas",icon:"🏆", titulo:"Conquistas" },
  { id:"jornada",   icon:"🗺️", titulo:"Jornada" },
  { id:"objetivos", icon:"⭐", titulo:"Objetivos" },
  { id:"swot",      icon:"🧩", titulo:"SWOT" },
  { id:"habilidades",icon:"💡",titulo:"Habilidades" },
  { id:"roda",       icon:"🎡", titulo:"Roda da Vida" },
  { id:"sabotador", icon:"🛡️", titulo:"Sabotador" },
  { id:"sabresult", icon:"🔍", titulo:"Seu Perfil" },
  { id:"plano",     icon:"📋", titulo:"Plano de Ação" },
  { id:"compromisso",icon:"📅",titulo:"Compromisso" },
  { id:"conclusao", icon:"🎉", titulo:"Conclusão" },
];

const INSPIRACOES = ["Família","Propósito","Impacto","Crescimento","Liberdade","Autonomia","Reconhecimento","Saúde"];
const AREAS_RODA = ["Saúde & Bem-estar","Família","Relacionamentos","Carreira","Finanças","Desenvolvimento Pessoal","Lazer & Hobbies","Espiritualidade"];

const CARGOS_CHIPS = ["Analista","Especialista","Supervisor(a)","Coordenador(a)","Gerente","Diretor(a)","CEO / Sócio(a)","Autônomo(a)","Empreendedor(a)"];

const FORCAS_CHIPS = ["Comunicação","Liderança","Organização","Criatividade","Empatia","Resiliência","Análise de dados","Proatividade","Relacionamento","Planejamento"];
const FRAQUEZAS_CHIPS = ["Gestão do tempo","Comunicação assertiva","Delegação","Foco","Autoconfiança","Planejamento","Dizer não","Networking","Disciplina"];
const OPORT_CHIPS = ["Mercado em crescimento","Apoio da liderança","Acesso a cursos","Rede de contatos","Momento de transição","Tecnologia disponível"];
const AMEACAS_CHIPS = ["Mercado competitivo","Mudanças tecnológicas","Falta de tempo","Instabilidade econômica","Concorrência interna","Excesso de demandas"];

const HABILIDADES = [
  { id:"ia",   nome:"IA & Digital",          desc:"Usar IA no trabalho", grupo:"Digital" },
  { id:"dados",nome:"Análise de Dados",       desc:"Extrair insights",    grupo:"Digital" },
  { id:"auto", nome:"Automação",              desc:"Automatizar tarefas", grupo:"Digital" },
  { id:"crit", nome:"Pensamento Crítico",     desc:"Decidir com evidências",grupo:"Cognitiva" },
  { id:"apre", nome:"Aprendizagem Contínua",  desc:"Aprender sempre",    grupo:"Cognitiva" },
  { id:"ie",   nome:"Int. Emocional",         desc:"Gerenciar emoções",  grupo:"Humana" },
  { id:"lide", nome:"Liderança",              desc:"Inspirar pessoas",   grupo:"Humana" },
  { id:"adap", nome:"Adaptabilidade",         desc:"Navegar mudanças",   grupo:"Humana" },
];

const QUIZ_SABOTADORES = [
  { sab:"Insistente",      emoji:"⚖️", pergunta:"Você se critica muito quando comete erros ou entrega algo imperfeito?" },
  { sab:"Prestativo",      emoji:"🤝", pergunta:"Você tem dificuldade de dizer não e sente culpa ao priorizar você mesmo(a)?" },
  { sab:"Vítima",          emoji:"😔", pergunta:"Você sente com frequência que as situações são injustas com você?" },
  { sab:"Hipervigilante",  emoji:"👁️", pergunta:"Você vive preocupado(a) com coisas que ainda não aconteceram?" },
  { sab:"Hiper-racional",  emoji:"🧠", pergunta:"Você tende a minimizar emoções e prefere resolver tudo pela lógica?" },
  { sab:"Hiper-realizador",emoji:"🏆", pergunta:"Você só se sente bem quando está sendo produtivo(a) e entregando resultados?" },
  { sab:"Controlador",     emoji:"🎮", pergunta:"Você tem dificuldade de delegar porque acredita que fará melhor?" },
  { sab:"Esquivo",         emoji:"🦅", pergunta:"Você costuma adiar conversas difíceis ou tarefas desconfortáveis?" },
  { sab:"Inquieto",        emoji:"⚡", pergunta:"Você começa muitos projetos mas tem dificuldade de terminar?" },
];

const SABOTADORES_INFO = {
  "Insistente":       { frase:'"Não foi bom o suficiente."',       tracos:"Autocrítica, perfeccionismo" },
  "Prestativo":       { frase:'"Não posso decepcionar ninguém."',   tracos:"Dificuldade de dizer não" },
  "Vítima":           { frase:'"Ninguém entende o quanto é difícil."', tracos:"Dramatização, injustiça" },
  "Hipervigilante":   { frase:'"Preciso estar sempre preparado(a)."',  tracos:"Ansiedade crônica" },
  "Hiper-racional":   { frase:'"Emoções não resolvem problemas."',  tracos:"Paralisia por análise" },
  "Hiper-realizador": { frase:'"Meu valor está no que conquisto."', tracos:"Workaholic, burnout" },
  "Controlador":      { frase:'"Se eu não fizer, não sai certo."',  tracos:"Dificuldade de delegar" },
  "Esquivo":          { frase:'"Vou fazer isso depois."',           tracos:"Procrastinação" },
  "Inquieto":         { frase:'"Preciso de algo novo."',            tracos:"Projetos inacabados" },
};

const MSGS = [
  "Incrível! Você está construindo algo poderoso. Continue! 💪",
  "Cada resposta honesta aqui vale ouro. Você está no caminho certo! ✨",
  "Que reflexão profunda! Poucas pessoas param para pensar assim. 🌟",
  "Mais da metade! Você está indo muito bem! 🚀",
];

const INICIAL = {
  nome:"", apelido:"", cargo:"", data:"", vontade:7,
  intencao:"", energia:{corpo:3,mente:3,emocao:3},
  sobreMim:{ frase:"", inspiracoes:[] },
  conquistas:{ c1:"", c2:"", c3:"" },
  jornada:{ formacoes:"", marcos:[{ano:"",titulo:""}] },
  objetivos:{ legado:"", cargoShort:"", cargoShortText:"", cargoMid:"", cargoMidText:"", cargoLong:"", cargoLongText:"", realidade:"" },
  swot:{ forcas:[], forcasOutros:"", fraquezas:[], fraquezasOutros:"", oportunidades:[], oportunidadesOutros:"", ameacas:[], ameacasOutros:"", estrategia:"" },
  habilidades:{},
  rodaVida: AREAS_RODA.reduce((a,r)=>({...a,[r]:{nota:5,melhorar:""}}),{}),
  quizRespostas: {},
  sabotadorPrincipal:"", sabotadorSecundario:"",
  sabMeta:"", sabComo:"", sabQuando:"", sabComQuem:"",
  compromisso7dias:"",
  plano30:{ oq:"", resultado:"" },
  plano60:{ oq:"", resultado:"" },
  plano90:{ oq:"", resultado:"" },
  gestor:"", gestorData:"",
  medida1:"", medida2:"", medida3:"",
  fraseF:"",
  paletaCor:"F5A623",
};

// ── UI HELPERS ────────────────────────────────────────────────────
function Card({children,style}){return <div style={{background:C.white,borderRadius:14,padding:16,boxShadow:"0 2px 8px rgba(15,29,58,.07)",marginBottom:12,...style}}>{children}</div>;}
function Titulo({children,cor}){return <div style={{fontWeight:700,fontSize:14,color:cor||C.navy,marginBottom:10}}>{children}</div>;}
function Campo({label,value,onChange,placeholder,multi,type}){
  const s={width:"100%",padding:"9px 11px",border:`1.5px solid ${C.slateDeep}`,borderRadius:9,fontSize:12,outline:"none",background:C.slate,fontFamily:"inherit",resize:"vertical"};
  return <div style={{marginBottom:10}}>
    {label&&<div style={{fontSize:10,fontWeight:700,color:C.textMid,marginBottom:4,textTransform:"uppercase",letterSpacing:.8}}>{label}</div>}
    {multi?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{...s,minHeight:65}}/>
          :<input type={type||"text"} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={s}/>}
  </div>;
}
function Nav({prev,next,nextLabel,disabled}){
  return <div style={{display:"flex",gap:8,marginTop:4}}>
    {prev&&<button onClick={prev} style={{flex:1,padding:12,background:C.white,color:C.navy,border:`1.5px solid ${C.slateDeep}`,borderRadius:10,fontWeight:700,fontSize:13,cursor:"pointer"}}>← Voltar</button>}
    {next&&<button onClick={next} disabled={disabled} style={{flex:2,padding:12,background:disabled?C.slateDeep:C.navy,color:disabled?C.textMid:C.white,border:"none",borderRadius:10,fontWeight:700,fontSize:13,cursor:disabled?"default":"pointer"}}>{nextLabel||"Próximo →"}</button>}
  </div>;
}
function Chips({opcoes,selecionados,onToggle,cor}){
  return <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
    {opcoes.map(op=>{
      const sel=selecionados.includes(op);
      return <button key={op} onClick={()=>onToggle(op)} style={{padding:"7px 14px",borderRadius:99,border:`2px solid ${sel?(cor||C.navy):C.slateDeep}`,background:sel?(cor||C.navy):C.white,color:sel?C.white:C.textMid,fontWeight:sel?700:400,fontSize:12,cursor:"pointer",transition:"all .15s"}}>
        {sel?"✓ ":""}{op}
      </button>;
    })}
  </div>;
}

// ── TELA SENHA ────────────────────────────────────────────────────

// ── ACESSO DOS PARTICIPANTES ──────────────────────────────────────
// Último dia em que o app fica aberto para as pessoas preencherem (formato AAAA-MM-DD).
// Depois dessa data o link mostra "treinamento encerrado" sozinho.
// Ranking, Dashboard RH e Controle do Ritmo ficam em arquivos separados
// (ranking.html, rh-dashboard.html, controle.html) e continuam funcionando sempre.
// Deixe "" (vazio) para nunca expirar.
const ACESSO_ATE = "";

// Quem a pessoa procura para tirar dúvidas ou pedir exclusão dos dados (aviso de privacidade).
const CONTATO_LGPD = "a área de RH responsável pelo treinamento";

// ── RASCUNHO NO PRÓPRIO APARELHO ──────────────────────────────────
// Guarda o preenchimento em andamento SOMENTE no navegador da pessoa.
// Nada é enviado para servidor. Usa localStorage (mais resistente que
// sessionStorage a recarregamentos acidentais, "puxar para atualizar" no
// celular e navegadores in-app) com validade de 12h para não sobrar
// rascunho de outra pessoa num aparelho compartilhado. Se o navegador
// bloquear storage (ex: aba anônima), cai num fallback em memória —
// não protege contra fechar a aba, mas protege contra reload acidental.
const RASCUNHO_KEY = "pdi_rascunho_v2";
const RASCUNHO_VALIDADE_MS = 12*60*60*1000; // 12 horas
let _rascunhoMemoria = null; // fallback quando storage não está disponível

function lerRascunho(){
  try{
    const s = localStorage.getItem(RASCUNHO_KEY);
    if(!s) return _rascunhoMemoria;
    const r = JSON.parse(s);
    if(!r || typeof r.salvoEm!=="number" || (Date.now()-r.salvoEm)>RASCUNHO_VALIDADE_MS){
      localStorage.removeItem(RASCUNHO_KEY);
      return _rascunhoMemoria;
    }
    return r;
  }catch(e){ return _rascunhoMemoria; }
}
function salvarRascunho(etapa,dados){
  const r = {etapa,dados,salvoEm:Date.now()};
  _rascunhoMemoria = r;
  try{ localStorage.setItem(RASCUNHO_KEY, JSON.stringify(r)); }catch(e){}
}
function limparRascunho(){
  _rascunhoMemoria = null;
  try{ localStorage.removeItem(RASCUNHO_KEY); }catch(e){}
}

async function dbSalvar(d, pts) {
  if (!SUPABASE_URL.includes("supabase")) return false;
  const gaps = HABILIDADES.filter(h=>(d.habilidades[h.id]||0)<=2).map(h=>h.nome).slice(0,3).join(",");
  const areas = Object.entries(d.rodaVida)
    .filter(([,v])=>(v.nota??5)<=4).map(([k])=>k).join(",");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pdi_ranking`,{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,
      "Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"resolution=merge-duplicates"},
    body:JSON.stringify({
      id:d._sid,
      apelido:(d.apelido||"").trim().slice(0,24),
      pontos_total:pts.total, pontos_completude:pts.completude,
      pontos_qualidade:pts.qualidade, pontos_vontade:pts.vontade,
      nivel_vontade:d.vontade, energia_corpo:d.energia.corpo,
      energia_mente:d.energia.mente, energia_emocao:d.energia.emocao,
      sabotador:d.sabotadorPrincipal||"",
      cargo_pretendido:d.objetivos.cargoShort||"",
      gaps_habilidades:gaps, areas_baixas_roda:areas,
      atualizado_em:new Date().toISOString(),
    })
  });
  return res.ok;
}

// ── RITMO GUIADO (controle da facilitadora) ───────────────────────
// Lê até qual etapa está liberada nesta turma. Se a tabela ainda não existir
// ou a consulta falhar por qualquer motivo, retorna 0 (sem bloqueio) — o app
// nunca trava por causa dessa função, mesmo antes de você configurar o recurso.
async function dbBuscarControle() {
  try{
    if (!SUPABASE_URL.includes("supabase")) return 0;
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/pdi_controle?id=eq.1&select=etapa_liberada`,
      {headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}}
    );
    if(!res.ok) return 0;
    const rows = await res.json();
    return rows?.[0]?.etapa_liberada || 0;
  }catch(e){ return 0; }
}

// ── PONTUAÇÃO ────────────────────────────────────────────────────
function calcPontos(d){
  let c=0,q=0;
  const add=(v,n)=>{if(v)c+=n;};
  add(d.nome,10);add(d.intencao,15);add(d.sobreMim.frase,15);
  add(d.sobreMim.inspiracoes?.length>0,15);
  add(d.conquistas.c1,15);add(d.conquistas.c2,15);add(d.conquistas.c3,15);
  add(d.jornada.formacoes,15);add(d.jornada.marcos?.some(m=>m.titulo),15);
  add(d.objetivos.cargoShort,10);add(d.objetivos.legado,20);add(d.objetivos.realidade,15);
  if(d.swot.forcas.length&&d.swot.fraquezas.length&&d.swot.oportunidades.length&&d.swot.ameacas.length)c+=30;
  add(d.swot.estrategia,20);
  c+=Math.min(Object.values(d.habilidades).filter(v=>v>0).length*2,20);
  c+=Math.min(Object.values(d.rodaVida).filter(r=>r.melhorar?.length>2).length*3,24);
  add(d.sabotadorPrincipal,10);
  c+=Math.min([d.plano30,d.plano60,d.plano90].filter(p=>p.oq).length*8,24);
  add(d.sabotadorPrincipal,15);add(d.sabMeta,15);
  add(d.medida1,10);add(d.fraseF?.length>10,15);
  c=Math.min(c,300);
  [d.intencao,d.sobreMim.frase,
   d.conquistas.c1,d.conquistas.c2,d.conquistas.c3,d.jornada.formacoes,
   d.objetivos.legado,d.objetivos.realidade,
   d.swot.forcasOutros,d.swot.fraquezasOutros,d.swot.estrategia,d.sabComo,
   d.medida1,d.medida2,d.medida3,
  ].forEach(t=>{if(!t)return;if(t.length>150)q+=18;else if(t.length>80)q+=10;else if(t.length>30)q+=5;});
  q=Math.min(q,300);
  const v=Math.round(d.vontade*10);
  const minutos=d._inicio?Math.min((Date.now()-d._inicio)/60000,20):0;
  const dedicacao=Math.round(Math.min(minutos*1.5,30));
  return{total:c+q+v+dedicacao,completude:c,qualidade:q,vontade:v,dedicacao};
}

// ── UI HELPERS ────────────────────────────────────────────────────
function PBar({value,max,cor,h=6}){
  const p=max>0?Math.min(100,Math.round(value/max*100)):0;
  return <div style={{background:C.slateDeep,borderRadius:99,height:h,overflow:"hidden"}}>
    <div style={{width:`${p}%`,height:"100%",background:cor||C.amber,borderRadius:99,transition:"width .4s"}}/>
  </div>;
}


// ── TELA SENHA (acesso da turma) ────────────────────────────────────
function TelaSenha({next}){
  const [senha,setSenha]=useState("");
  const [carregando,setCarregando]=useState(false);
  const [erro,setErro]=useState("");

  const MENSAGENS_ERRO = {
    invalida: "Senha incorreta. Confira com a facilitadora do treinamento.",
    expirada: "Essa senha não vale mais para esta turma. Peça a senha atualizada.",
    network: "Não conseguimos verificar agora. Confira sua internet e tente de novo.",
    config: "Estamos com um problema técnico. Tente novamente em instantes.",
  };

  async function validar(){
    if(!senha.trim())return;
    setCarregando(true);setErro("");
    try{
      const r = await verificarSenha(senha.trim());
      if(r.ok) next();
      else setErro(MENSAGENS_ERRO[r.erro]||MENSAGENS_ERRO.invalida);
    }catch(e){ setErro(MENSAGENS_ERRO.network); }
    setCarregando(false);
  }

  return <div style={{minHeight:"100dvh",background:`linear-gradient(160deg,${C.navy} 0%,${C.navyLight} 100%)`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',sans-serif"}}>
    <div style={{width:"100%",maxWidth:340}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{width:58,height:58,borderRadius:"50%",background:`${C.amber}1F`,border:`2px solid ${C.amber}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:26}}>🔑</div>
        <div style={{fontWeight:800,fontSize:22,color:C.white}}>PDI na Prática</div>
        <div style={{fontSize:12,color:C.slateDeep,marginTop:6,lineHeight:1.5}}>Digite a senha desta turma, informada pela facilitadora.</div>
      </div>
      <input value={senha} onChange={e=>{setSenha(e.target.value);setErro("");}} onKeyDown={e=>e.key==="Enter"&&validar()}
        placeholder="Senha da turma" autoCapitalize="characters"
        style={{width:"100%",padding:"14px 16px",border:`2px solid ${erro?C.red:C.navyLight}`,borderRadius:12,fontSize:16,textAlign:"center",letterSpacing:2,outline:"none",background:C.navyMid,color:C.white,fontFamily:"inherit",marginBottom:10}}/>
      {erro&&<div style={{fontSize:11.5,color:C.red,background:`${C.red}18`,borderRadius:9,padding:"9px 12px",marginBottom:10,lineHeight:1.5}}>⚠️ {erro}</div>}
      <button onClick={validar} disabled={carregando||!senha.trim()} style={{width:"100%",padding:14,background:carregando||!senha.trim()?C.navyMid:C.amber,color:carregando||!senha.trim()?C.slateDeep:C.navy,border:"none",borderRadius:12,fontWeight:800,fontSize:14.5,cursor:carregando?"default":"pointer"}}>
        {carregando?"Verificando...":"Entrar →"}
      </button>
    </div>
  </div>;
}

// ── TELA LGPD ─────────────────────────────────────────────────────
function TelaLGPD({next}){
  const [ok,setOk]=useState(false);
  const [verMais,setVerMais]=useState(false);
  return <div style={{minHeight:"100dvh",background:`linear-gradient(160deg,${C.navy} 0%,${C.navyLight} 100%)`,padding:"20px 20px 24px",fontFamily:"'Inter',sans-serif"}}>

    <div style={{textAlign:"center",marginBottom:16}}>
      <div style={{width:54,height:54,borderRadius:"50%",background:`${C.amber}1F`,border:`2px solid ${C.amber}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 10px",fontSize:25}}>🎯</div>
      <div style={{fontWeight:800,fontSize:24,color:C.white,letterSpacing:-.3,lineHeight:1.1}}>PDI na Prática</div>
      <div style={{fontSize:9,color:C.amber,fontWeight:700,letterSpacing:1.8,textTransform:"uppercase",marginTop:5,lineHeight:1.35}}>Plano de Desenvolvimento Individual</div>
      <div style={{fontSize:11,color:C.slateDeep,marginTop:8}}>⏱️ 20 a 30 minutos · no seu ritmo</div>
    </div>

    <div style={{background:C.navyMid,borderRadius:14,padding:"14px 14px",marginBottom:10,border:`1px solid ${C.navyLight}`}}>
      <div style={{fontSize:9,color:C.amber,fontWeight:800,letterSpacing:1.3,textTransform:"uppercase",marginBottom:11,textAlign:"center"}}>O que você vai construir aqui</div>
      {[["🧭","Clareza sobre o seu momento","forças, pontos de atenção e travas"],
        ["🎯","Aonde você quer chegar","metas de curto, médio e longo prazo"],
        ["🗓️","Um plano com prazos reais","os primeiros 7 dias, 30, 60 e 90"],
        ["📊","Uma apresentação pronta","PowerPoint editável pro seu gestor"],
      ].map(([ic,t,sub],i)=>(
        <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:i<3?10:0}}>
          <span style={{fontSize:17,flexShrink:0,lineHeight:1.15}}>{ic}</span>
          <div>
            <div style={{fontSize:12.5,color:C.white,fontWeight:700,lineHeight:1.25}}>{t}</div>
            <div style={{fontSize:10.5,color:C.slateDeep,lineHeight:1.35,marginTop:1}}>{sub}</div>
          </div>
        </div>
      ))}
    </div>

    <div style={{background:C.navyMid,borderRadius:12,padding:"11px 13px",marginBottom:11,borderLeft:`3px solid ${C.green}`}}>
      <div style={{fontSize:10.5,fontWeight:800,color:C.white,marginBottom:6}}>🔒 Privacidade & LGPD</div>
      <div style={{fontSize:10.5,color:C.slateDeep,lineHeight:1.55}}>
        Seu nome e suas respostas ficam somente no seu aparelho · para o servidor vão apenas o apelido que você escolher e estatísticas do grupo · você pode encerrar a qualquer momento.
      </div>
      <div onClick={()=>setVerMais(!verMais)} style={{fontSize:10,color:C.amber,fontWeight:700,marginTop:7,cursor:"pointer"}}>{verMais?"− ocultar detalhes":"+ ver detalhes"}</div>
      {verMais&&<div style={{fontSize:10,color:C.slateDeep,lineHeight:1.6,marginTop:8,borderTop:`1px solid ${C.navyLight}`,paddingTop:8}}>
        <strong style={{color:C.white}}>Para que serve:</strong> suas respostas montam o seu PDI em PowerPoint e um painel com números do grupo, usado só para conduzir o treinamento.<br/><br/>
        <strong style={{color:C.white}}>Fica no seu aparelho:</strong> seu nome e todas as respostas. O PowerPoint é gerado no próprio celular/computador e não é enviado para lugar nenhum. Enquanto você preenche, um rascunho fica guardado no navegador e é apagado ao baixar o arquivo ou ao fechar a aba.<br/><br/>
        <strong style={{color:C.white}}>Vai para o servidor:</strong> o apelido que você escolher para o ranking e dados do grupo — pontuação, nível de energia e de vontade, sabotador e temas de desenvolvimento. <strong style={{color:C.white}}>Seu nome nunca é enviado.</strong> O apelido é escolhido por você: use algo que só o seu time reconheça, não o nome completo. Se deixar em branco, você aparece apenas como “Participante”.<br/><br/>
        <strong style={{color:C.white}}>Por quanto tempo:</strong> os números do grupo são apagados ao final do treinamento.<br/><br/>
        <strong style={{color:C.white}}>Seus direitos:</strong> você pode não preencher qualquer campo, encerrar quando quiser e pedir a exclusão dos dados do grupo falando com {CONTATO_LGPD}.<br/><br/>
        <strong style={{color:C.white}}>Importante:</strong> não escreva sobrenome, CPF, matrícula, e-mail, telefone ou informações confidenciais em nenhum campo.
      </div>}
    </div>

    <div onClick={()=>setOk(!ok)} style={{display:"flex",alignItems:"center",gap:11,padding:"12px 14px",background:ok?`${C.green}22`:C.navyMid,borderRadius:12,cursor:"pointer",border:`2px solid ${ok?C.green:C.navyLight}`,marginBottom:11}}>
      <div style={{width:21,height:21,borderRadius:6,border:`2px solid ${ok?C.green:C.slateDeep}`,background:ok?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        {ok&&<span style={{color:C.white,fontSize:12,fontWeight:800}}>✓</span>}
      </div>
      <span style={{fontSize:11.5,color:ok?C.green:C.slateDeep,fontWeight:ok?700:400,lineHeight:1.35}}>Li e concordo com os termos de privacidade</span>
    </div>

    <button onClick={next} disabled={!ok} style={{width:"100%",padding:14,background:ok?C.amber:C.navyMid,color:ok?C.navy:C.slateDeep,border:"none",borderRadius:12,fontWeight:800,fontSize:14.5,cursor:ok?"pointer":"default",boxShadow:ok?`0 6px 18px ${C.amber}44`:"none"}}>
      Começar meu PDI →
    </button>
  </div>;
}

// ── TELA INÍCIO ───────────────────────────────────────────────────
function TelaInicio({d,set,next,prev}){
  const upd=(k,v)=>set({...d,energia:{...d.energia,[k]:v}});
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:6}}>✨</div>
      <div style={{fontWeight:800,fontSize:16}}>Ponto de Partida</div>
      <div style={{color:C.slateDeep,fontSize:12,marginTop:4}}>Conecte-se com o momento presente.</div>
    </Card>

    <Card>
      <Titulo>👤 Seus dados</Titulo>
      <Campo label="Primeiro nome *" value={d.nome} onChange={v=>set({...d,nome:v})} placeholder="Ex: Ana"/>
      <div style={{fontSize:10.5,color:C.textMid,marginTop:-6,marginBottom:12,lineHeight:1.5,background:C.slate,borderRadius:8,padding:"8px 10px"}}>
        💡 Só o primeiro nome, para personalizar o seu PowerPoint. Não preencha sobrenome, CPF, matrícula, e-mail ou qualquer dado confidencial em nenhuma etapa.
      </div>
      <Campo label="Apelido para o ranking" value={d.apelido} onChange={v=>set({...d,apelido:v})} placeholder="Ex: Aninha, Foguete, Time Custos..."/>
      <div style={{fontSize:10.5,color:C.textMid,marginTop:-6,marginBottom:12,lineHeight:1.5,background:C.slate,borderRadius:8,padding:"8px 10px"}}>
        🏆 É assim que você vai aparecer no ranking do telão. Escolha algo que só você e o time reconheçam — evite nome completo. Se deixar em branco, aparece como “Participante”.
      </div>
      <Campo label="Cargo / Área" value={d.cargo} onChange={v=>set({...d,cargo:v})} placeholder="Ex: Analista Financeiro"/>
      <Campo label="Data de hoje" value={d.data} onChange={v=>set({...d,data:v})} type="date"/>
    </Card>

    <Card>
      <Titulo>🎯 Minha intenção hoje</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:8,fontStyle:"italic",borderLeft:`3px solid ${C.amber}`,paddingLeft:10,lineHeight:1.6}}>
        "Com que intenção você está aqui? O que quer levar desse momento para a sua vida?"
      </div>
      <textarea value={d.intencao} onChange={e=>set({...d,intencao:e.target.value})} placeholder='"Estou aqui para..."'
        style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${C.amber}`,borderRadius:10,fontSize:13,outline:"none",background:C.slate,fontFamily:"inherit",resize:"vertical",minHeight:65,fontStyle:"italic"}}/>
    </Card>

    <Card>
      <Titulo>🌡️ Como estou chegando hoje?</Titulo>
      {[{k:"corpo",l:"💪 Corpo",c:C.green},{k:"mente",l:"🧠 Mente",c:C.teal},{k:"emocao",l:"❤️ Emoção",c:C.purple}].map(dim=>(
        <div key={dim.k} style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
            <span style={{fontWeight:600,fontSize:13}}>{dim.l}</span>
            <span style={{fontWeight:800,color:dim.c,fontSize:15}}>{d.energia[dim.k]}/5</span>
          </div>
          <div style={{display:"flex",gap:8}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>upd(dim.k,n)} style={{flex:1,padding:"8px 0",borderRadius:9,border:`2px solid ${d.energia[dim.k]>=n?dim.c:C.slateDeep}`,background:d.energia[dim.k]>=n?dim.c:C.white,color:d.energia[dim.k]>=n?C.white:C.textMid,fontWeight:700,fontSize:13,cursor:"pointer"}}>{n}</button>
            ))}
          </div>
        </div>
      ))}
    </Card>

    <Card>
      <Titulo>🔥 Nível de Vontade</Titulo>
      <div style={{textAlign:"center",marginBottom:12}}>
        <div style={{fontSize:56,fontWeight:800,color:C.amber,lineHeight:1}}>{d.vontade}</div>
        <div style={{fontSize:12,color:C.textMid}}>de 10</div>
      </div>
      <input type="range" min={0} max={10} value={d.vontade} onChange={e=>set({...d,vontade:Number(e.target.value)})} style={{width:"100%",accentColor:C.amber}}/>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.textLight,marginTop:4}}><span>0</span><span>5</span><span>10</span></div>
    </Card>

    <Nav prev={prev} next={next} disabled={!d.nome.trim()}/>
  </div>;
}

// ── TELA SOBRE MIM ────────────────────────────────────────────────
function TelaSobre({d,set,next,prev}){
  const s=d.sobreMim;
  const toggleInsp=v=>{const arr=s.inspiracoes.includes(v)?s.inspiracoes.filter(x=>x!==v):[...s.inspiracoes,v];set({...d,sobreMim:{...s,inspiracoes:arr}});};
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>👤</div>
      <div style={{fontWeight:800,fontSize:16}}>Sobre Mim</div>
      <div style={{color:C.slateDeep,fontSize:11,marginTop:4}}>Quanto mais genuíno, mais poderoso o seu PDI!</div>
    </Card>
    <Card>
      <Campo label="Uma frase que te representa" value={s.frase} onChange={v=>set({...d,sobreMim:{...s,frase:v}})} placeholder='"Acredito que cada pessoa tem o poder de..."'/>
    </Card>
    <Card>
      <Titulo>✨ O que me inspira</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:10}}>Selecione tudo que faz sentido para você:</div>
      <Chips opcoes={INSPIRACOES} selecionados={s.inspiracoes} onToggle={toggleInsp} cor={C.teal}/>
    </Card>
    <Nav prev={prev} next={next}/>
  </div>;
}

// ── TELA CONQUISTAS ───────────────────────────────────────────────
function TelaConquistas({d,set,next,prev}){
  const c=d.conquistas;const upd=obj=>set({...d,conquistas:{...c,...obj}});
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>🏆</div>
      <div style={{fontWeight:800,fontSize:16}}>Minhas Conquistas</div>
      <div style={{color:C.slateDeep,fontSize:11,marginTop:4,lineHeight:1.5}}>
        Antes de olhar para o futuro, celebre o que você já construiu! 💛
      </div>
    </Card>
    <Card style={{background:C.slate,borderLeft:`3px solid ${C.amber}`}}>
      <div style={{fontSize:12,color:C.textMid,lineHeight:1.6,fontStyle:"italic"}}>
        "Independente de onde você está hoje, existe uma trajetória de esforço e superação que merece ser reconhecida."
      </div>
    </Card>
    {[{k:"c1",n:1,l:"Uma conquista profissional",ph:"Ex: Liderei um projeto que impactou toda a equipe..."},
      {k:"c2",n:2,l:"Uma conquista pessoal",ph:"Ex: Superei um medo que me limitava há anos..."},
      {k:"c3",n:3,l:"Uma habilidade que desenvolvi com esforço",ph:"Ex: Aprendi a me comunicar melhor..."},
    ].map(item=>(
      <Card key={item.k} style={{borderLeft:`4px solid ${C.green}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:30,height:30,borderRadius:"50%",background:C.green,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:C.white,flexShrink:0}}>{item.n}</div>
          <div style={{fontSize:12,fontWeight:700,color:C.navy}}>{item.l}</div>
        </div>
        <textarea value={c[item.k]} onChange={e=>upd({[item.k]:e.target.value})} placeholder={item.ph}
          style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.slateDeep}`,borderRadius:9,fontSize:12,outline:"none",background:C.slate,fontFamily:"inherit",resize:"vertical",minHeight:55}}/>
      </Card>
    ))}
    <Nav prev={prev} next={next}/>
  </div>;
}

// ── TELA JORNADA ──────────────────────────────────────────────────
const MARCOS_MAX = 10;
function TelaJornada({d,set,next,prev}){
  const j=d.jornada;const upd=obj=>set({...d,jornada:{...j,...obj}});
  const addM=()=>set({...d,jornada:{...j,marcos:[...j.marcos,{ano:"",titulo:""}]}});
  const updM=(i,obj)=>{const m=[...j.marcos];m[i]={...m[i],...obj};set({...d,jornada:{...j,marcos:m}});};
  const rmM=(i)=>{const m=j.marcos.filter((_,idx)=>idx!==i);set({...d,jornada:{...j,marcos:m.length?m:[{ano:"",titulo:""}]}});};
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>🗺️</div>
      <div style={{fontWeight:800,fontSize:16}}>Minha Jornada</div>
    </Card>
    <Card>
      <Titulo>📚 Formações</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:10}}>Cursos, graduações, certificações — o que você estudou ao longo da carreira.</div>
      <Campo value={j.formacoes} onChange={v=>upd({formacoes:v})} placeholder="Ex: Graduação em Administração — FGV (2018)" multi/>
    </Card>
    <Card>
      <Titulo>📍 Marcos Profissionais <span style={{fontWeight:400,color:C.textMid}}>({j.marcos.filter(m=>m.ano||m.titulo).length}/{MARCOS_MAX})</span></Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:10}}>Os momentos que definiram sua trajetória. No PowerPoint eles viram uma linha do tempo horizontal.</div>
      {j.marcos.map((m,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"24px 72px 1fr auto",gap:8,marginBottom:8,background:C.slate,borderRadius:10,padding:10,alignItems:"center"}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:C.teal,color:C.white,fontWeight:800,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center"}}>{i+1}</div>
          <input value={m.ano} onChange={e=>updM(i,{ano:e.target.value})} placeholder="Ano" style={{padding:"7px 8px",border:`1.5px solid ${C.slateDeep}`,borderRadius:8,fontSize:12,outline:"none",background:C.white,fontFamily:"inherit",minWidth:0}}/>
          <input value={m.titulo} onChange={e=>updM(i,{titulo:e.target.value})} placeholder="O que aconteceu?" style={{padding:"7px 9px",border:`1.5px solid ${C.slateDeep}`,borderRadius:8,fontSize:12,outline:"none",background:C.white,fontFamily:"inherit",minWidth:0}}/>
          {j.marcos.length>1&&<button onClick={()=>rmM(i)} aria-label="Remover marco" style={{width:26,height:26,border:"none",borderRadius:8,background:`${C.red}18`,color:C.red,fontWeight:800,fontSize:13,cursor:"pointer",flexShrink:0}}>✕</button>}
        </div>
      ))}
      {j.marcos.length>=6&&<div style={{fontSize:10,color:C.textLight,marginBottom:8,lineHeight:1.5}}>💡 A ordem aqui não precisa ser cronológica — no PowerPoint dá pra reorganizar como quiser.</div>}
      {j.marcos.length<MARCOS_MAX&&<button onClick={addM} style={{width:"100%",padding:8,background:`${C.teal}15`,color:C.teal,border:`1.5px solid ${C.teal}44`,borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Adicionar marco</button>}
    </Card>
    <Nav prev={prev} next={next}/>
  </div>;
}

// ── TELA OBJETIVOS ────────────────────────────────────────────────
function TelaObjetivos({d,set,next,prev}){
  const o=d.objetivos;const upd=obj=>set({...d,objetivos:{...o,...obj}});
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>⭐</div>
      <div style={{fontWeight:800,fontSize:16}}>Meus Objetivos</div>
    </Card>
    <Card>
      <Titulo>🌟 Legado</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:8,fontStyle:"italic",borderLeft:`3px solid ${C.amber}`,paddingLeft:10,lineHeight:1.6}}>
        "O que você quer deixar como legado? O que as pessoas vão dizer sobre você?"
      </div>
      <Campo value={o.legado} onChange={v=>upd({legado:v})} placeholder='"Quero ser lembrado(a) como alguém que..."' multi/>
    </Card>
    {[{prazo:"Short",label:"⚡ Curto prazo",sub:"2-3 anos",cor:C.teal},
      {prazo:"Mid",  label:"📅 Médio prazo",sub:"3-5 anos",cor:C.purple},
      {prazo:"Long", label:"🚀 Longo prazo",sub:"5-10 anos",cor:C.orange},
    ].map(p=>(
      <Card key={p.prazo} style={{borderLeft:`4px solid ${p.cor}`}}>
        <Titulo cor={p.cor}>{p.label} <span style={{fontWeight:400,fontSize:11,color:C.textMid}}>({p.sub})</span></Titulo>
        <div style={{fontSize:11,color:C.textMid,marginBottom:8}}>Selecione ou escreva o cargo/objetivo:</div>
        <Chips opcoes={CARGOS_CHIPS} selecionados={o[`cargo${p.prazo}`]?[o[`cargo${p.prazo}`]]:[]} onToggle={v=>upd({[`cargo${p.prazo}`]:o[`cargo${p.prazo}`]===v?"":v})} cor={p.cor}/>
        <Campo value={o[`cargo${p.prazo}Text`]} onChange={v=>upd({[`cargo${p.prazo}Text`]:v})} placeholder="Descreva sua meta ou objetivo específico..."/>
      </Card>
    ))}
    <Card style={{borderLeft:`4px solid ${C.amber}`}}>
      <Titulo>🔎 Esse caminho é realista?</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:8,lineHeight:1.6}}>
        Olhe para os cargos que você escolheu e faça uma checagem honesta: o que você já tem a favor e o que ainda falta para chegar lá?
      </div>
      <Campo value={d.objetivos.realidade} onChange={v=>upd({realidade:v})} placeholder="Ex: já tenho experiência em análise e boa relação com a área. Falta desenvolver liderança e entender melhor a estratégia da empresa." multi/>
    </Card>
    <Nav prev={prev} next={next}/>
  </div>;
}

// ── TELA SWOT ─────────────────────────────────────────────────────
function TelaSwot({d,set,next,prev}){
  const s=d.swot;
  const toggle=(campo,v)=>{const arr=s[campo].includes(v)?s[campo].filter(x=>x!==v):[...s[campo],v];set({...d,swot:{...s,[campo]:arr}});};
  const secoes=[
    {k:"forcas",    label:"💪 Forças",       cor:C.green,  chips:FORCAS_CHIPS,   ph:"Outras forças..."},
    {k:"oportunidades",label:"🎯 Oportunidades",cor:C.teal, chips:OPORT_CHIPS,    ph:"Outras oportunidades..."},
    {k:"fraquezas", label:"⚠️ Pontos de desenvolvimento",cor:C.red,chips:FRAQUEZAS_CHIPS,ph:"Outros pontos..."},
    {k:"ameacas",   label:"🔴 Ameaças",      cor:C.orange, chips:AMEACAS_CHIPS,  ph:"Outras ameaças..."},
  ];
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>🧩</div>
      <div style={{fontWeight:800,fontSize:16}}>SWOT Pessoal</div>
      <div style={{color:C.slateDeep,fontSize:11,marginTop:4}}>Selecione os chips que fazem sentido + escreva outros.</div>
    </Card>
    {secoes.map(sec=>(
      <Card key={sec.k} style={{borderLeft:`4px solid ${sec.cor}`}}>
        <Titulo cor={sec.cor}>{sec.label}</Titulo>
        <Chips opcoes={sec.chips} selecionados={s[sec.k]} onToggle={v=>toggle(sec.k,v)} cor={sec.cor}/>
        <Campo value={s[`${sec.k}Outros`]} onChange={v=>set({...d,swot:{...s,[`${sec.k}Outros`]:v}})} placeholder={sec.ph}/>
      </Card>
    ))}
    <Card style={{borderLeft:`4px solid ${C.amber}`}}>
      <Titulo>🎯 Como vou usar meu SWOT a meu favor</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:10,lineHeight:1.6}}>
        Olhe para o que você marcou acima e conecte: <strong>qual força sua pode aproveitar qual oportunidade?</strong> E o que você vai fazer para que um ponto de desenvolvimento não te atrapalhe nesse caminho?
      </div>
      <Campo value={s.estrategia} onChange={v=>set({...d,swot:{...s,estrategia:v}})} placeholder="Ex: vou usar minha facilidade com dados para assumir a análise do novo projeto, que a liderança já sinalizou apoiar. Para não travar por insegurança, combino uma revisão rápida com a minha gestora em vez de refazer sozinha várias vezes." multi/>
    </Card>
    <Nav prev={prev} next={next}/>
  </div>;
}

// ── TELA HABILIDADES ──────────────────────────────────────────────
function TelaHabilidades({d,set,next,prev}){
  const hab=d.habilidades;
  const upd=(id,val)=>set({...d,habilidades:{...hab,[id]:val}});
  const cores={Digital:C.teal,Cognitiva:C.purple,Humana:C.green};
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>💡</div>
      <div style={{fontWeight:800,fontSize:16}}>Habilidades do Futuro</div>
      <div style={{color:C.slateDeep,fontSize:11,marginTop:4}}>WEF 2025 — Avalie de 1 a 5.</div>
    </Card>
    <Card>
      {HABILIDADES.map(item=>{
        const nota=hab[item.id]||0;
        const cor=cores[item.grupo]||C.teal;
        return <div key={item.id} style={{marginBottom:14}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <div>
              <div style={{fontWeight:600,fontSize:13}}>{item.nome}</div>
              <div style={{fontSize:10,color:C.textMid}}>{item.desc}</div>
            </div>
            <div style={{fontWeight:800,color:cor,fontSize:15,minWidth:28,textAlign:"right"}}>{nota||"–"}</div>
          </div>
          <div style={{display:"flex",gap:6}}>
            {[1,2,3,4,5].map(n=>(
              <button key={n} onClick={()=>upd(item.id,n)} style={{flex:1,padding:"7px 0",borderRadius:8,border:`2px solid ${nota>=n?cor:C.slateDeep}`,background:nota>=n?cor:C.white,color:nota>=n?C.white:C.textMid,fontWeight:700,fontSize:12,cursor:"pointer"}}>{n}</button>
            ))}
          </div>
        </div>;
      })}
    </Card>
    <Nav prev={prev} next={next}/>
  </div>;
}

// ── TELA RODA DA VIDA ─────────────────────────────────────────────
function TelaRoda({d,set,next,prev}){
  const roda=d.rodaVida;
  const updNota=(area,nota)=>set({...d,rodaVida:{...roda,[area]:{...roda[area],nota}}});
  const updMelhorar=(area,melhorar)=>set({...d,rodaVida:{...roda,[area]:{...roda[area],melhorar}}});
  const baixas=Object.entries(roda).sort((a,b)=>(a[1].nota||0)-(b[1].nota||0)).slice(0,2).map(([area])=>area);
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>🎡</div>
      <div style={{fontWeight:800,fontSize:16}}>Roda da Vida</div>
      <div style={{color:C.slateDeep,fontSize:11,marginTop:4}}>Avalie de 0 a 10 o quanto você está satisfeita(o) com cada área hoje.</div>
    </Card>
    <Card>
      {AREAS_RODA.map(area=>{
        const nota=roda[area]?.nota??5;
        return <div key={area} style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
            <div style={{fontWeight:600,fontSize:13}}>{area}</div>
            <div style={{fontWeight:800,color:C.amber,fontSize:15,minWidth:24,textAlign:"right"}}>{nota}</div>
          </div>
          <input type="range" min={0} max={10} value={nota} onChange={e=>updNota(area,Number(e.target.value))} style={{width:"100%",accentColor:C.amber}}/>
        </div>;
      })}
    </Card>
    <Card style={{borderLeft:`4px solid ${C.amber}`}}>
      <Titulo>💡 O que fazer com isso</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:12,lineHeight:1.6}}>Quanto menor a nota, mais aquela área pede atenção. Escolha uma ação para as áreas mais baixas.</div>
      {baixas.map(area=>(
        <div key={area} style={{marginBottom:10}}>
          <div style={{fontSize:11,fontWeight:700,color:C.navy,marginBottom:4}}>{area} — nota {roda[area]?.nota??5}</div>
          <input value={roda[area]?.melhorar||""} onChange={e=>updMelhorar(area,e.target.value)} placeholder="O que você vai fazer para melhorar essa área?"
            style={{width:"100%",padding:"9px 11px",border:`1.5px solid ${C.slateDeep}`,borderRadius:9,fontSize:12,outline:"none",background:C.slate,fontFamily:"inherit"}}/>
        </div>
      ))}
    </Card>
    <Nav prev={prev} next={next}/>
  </div>;
}

// ── TELA SABOTADOR (quiz) ─────────────────────────────────────────
function TelaSabotador({d,set,next,prev}){
  const respostas=d.quizRespostas;
  const setResp=(sab,val)=>set({...d,quizRespostas:{...respostas,[sab]:val}});
  const totalRespondidas=Object.keys(respostas).length;
  const concluido=totalRespondidas===QUIZ_SABOTADORES.length;

  function calcularSabotadores(){
    const pontos={};
    QUIZ_SABOTADORES.forEach(q=>{
      const r=respostas[q.sab];
      pontos[q.sab]=r==="Sim"?3:r==="Às vezes"?1:0;
    });
    const sorted=Object.entries(pontos).sort((a,b)=>b[1]-a[1]);
    return {principal:sorted[0][0],secundario:sorted[1][0]};
  }

  function avancar(){
    const {principal,secundario}=calcularSabotadores();
    set({...d,sabotadorPrincipal:principal,sabotadorSecundario:secundario});
    next();
  }

  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>🛡️</div>
      <div style={{fontWeight:800,fontSize:16}}>Descubra seu Sabotador</div>
      <div style={{color:C.slateDeep,fontSize:11,marginTop:4}}>Responda com honestidade. O app revela o resultado! ({totalRespondidas}/{QUIZ_SABOTADORES.length})</div>
    </Card>
    {QUIZ_SABOTADORES.map((q,i)=>(
      <Card key={q.sab}>
        <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:10,lineHeight:1.5}}>
          <span style={{fontSize:16,marginRight:8}}>{q.emoji}</span>{q.pergunta}
        </div>
        <div style={{display:"flex",gap:8}}>
          {["Sim","Às vezes","Não"].map(op=>{
            const sel=respostas[q.sab]===op;
            const cor=op==="Sim"?C.red:op==="Às vezes"?C.amber:C.green;
            return <button key={op} onClick={()=>setResp(q.sab,op)} style={{flex:1,padding:"10px 0",borderRadius:9,border:`2px solid ${sel?cor:C.slateDeep}`,background:sel?cor:C.white,color:sel?C.white:C.textMid,fontWeight:sel?700:400,fontSize:12,cursor:"pointer",transition:"all .15s"}}>{op}</button>;
          })}
        </div>
      </Card>
    ))}
    {concluido&&<Card style={{background:`${C.amber}15`,borderLeft:`4px solid ${C.amber}`}}>
      <div style={{fontSize:12,color:C.textMid,lineHeight:1.6}}>✅ Todas as perguntas respondidas! Clique em próximo para ver o resultado.</div>
    </Card>}
    <Nav prev={prev} next={avancar} disabled={!concluido} nextLabel="Ver meu resultado →"/>
  </div>;
}

// ── TELA PLANO DE AÇÃO ────────────────────────────────────────────
function TelaPlano({d,set,next,prev}){
  const p=d;
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>📋</div>
      <div style={{fontWeight:800,fontSize:16}}>Plano de Ação</div>
      <div style={{color:C.slateDeep,fontSize:11,marginTop:4}}>⚡ Compromisso + 30/60/90 dias</div>
    </Card>

    {/* Compromisso 7 dias */}
    <Card style={{borderLeft:`4px solid ${C.amber}`,background:`${C.amber}08`}}>
      <Titulo cor={C.amber}>⚡ Compromisso de 7 dias</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:10,lineHeight:1.6}}>
        Uma ação pequena e específica para fazer <strong>essa semana</strong>.
      </div>
      <Campo value={p.compromisso7dias} onChange={v=>set({...p,compromisso7dias:v})} placeholder="Ex: Pesquisar 3 cursos de IA e assistir a primeira aula" multi/>
    </Card>

    {/* 30/60/90 dias */}
    {[
      {prazo:"30",label:"📅 30 dias",cor:C.teal,  oqKey:"plano30",field:"plano30"},
      {prazo:"60",label:"📅 60 dias",cor:C.purple,oqKey:"plano60",field:"plano60"},
      {prazo:"90",label:"🎯 90 dias",cor:C.green, oqKey:"plano90",field:"plano90"},
    ].map(({prazo,label,cor,field})=>(
      <Card key={prazo} style={{borderLeft:`4px solid ${cor}`}}>
        <Titulo cor={cor}>{label}</Titulo>
        <Campo label="O que fazer?" value={p[field].oq} onChange={v=>set({...p,[field]:{...p[field],oq:v}})} placeholder="Ação principal desse período..."/>
        <Campo label="Resultado esperado" value={p[field].resultado} onChange={v=>set({...p,[field]:{...p[field],resultado:v}})} placeholder="O que muda quando eu fizer isso?"/>
      </Card>
    ))}

    <Card style={{background:C.slate,borderLeft:`3px solid ${C.navyMid}`}}>
      <div style={{fontSize:11,color:C.textMid,lineHeight:1.7}}>
        💡 O <strong>5W2H detalhado</strong> (O quê, Por quê, Onde, Quando, Quem, Como, Quanto) já está no seu PowerPoint para você completar com calma após o treinamento.
      </div>
    </Card>
    <Nav prev={prev} next={next}/>
  </div>;
}

// ── TELA SABOTADOR RESULTADO + PLANO ─────────────────────────────
function TelaSabResult({d,set,next,prev}){
  const sab=d.sabotadorPrincipal;
  const sab2=d.sabotadorSecundario;
  const info=SABOTADORES_INFO[sab]||{};
  const info2=SABOTADORES_INFO[sab2]||{};
  const emoji=QUIZ_SABOTADORES.find(q=>q.sab===sab)?.emoji||"🛡️";
  const emoji2=QUIZ_SABOTADORES.find(q=>q.sab===sab2)?.emoji||"";
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:36,marginBottom:4,textAlign:"center"}}>{emoji}</div>
      <div style={{fontWeight:800,fontSize:18,color:C.amber,textAlign:"center"}}>{sab}</div>
      <div style={{fontSize:11,color:C.slateDeep,textAlign:"center",marginTop:4}}>Seu sabotador principal</div>
    </Card>
    <Card style={{borderLeft:`4px solid ${C.amber}`}}>
      <div style={{fontSize:12,color:C.navy,fontStyle:"italic",padding:"10px 12px",background:C.slate,borderRadius:8,marginBottom:10}}>{info.frase}</div>
      <div style={{fontSize:11,color:C.textMid}}>Traços: {info.tracos}</div>
      {sab2&&<div style={{marginTop:10,fontSize:11,color:C.textMid}}>Traços secundários: {emoji2} {sab2} — {info2.tracos}</div>}
      <div style={{marginTop:10,fontSize:10,color:C.textLight,lineHeight:1.5,fontStyle:"italic"}}>
        ℹ️ Este é um quiz rápido de referência inicial e não substitui o teste completo de Sabotadores (Positive Intelligence), desenvolvido por Shirzad Chamine.
      </div>
    </Card>
    <Card>
      <Titulo>Meu plano contra o {sab}</Titulo>
      <Campo label="Meta" value={d.sabMeta} onChange={v=>set({...d,sabMeta:v})} placeholder="Qual meta quero alcançar?" multi/>
      <Campo label="Como superar" value={d.sabComo} onChange={v=>set({...d,sabComo:v})} placeholder="Qual é a minha estratégia?" multi/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Campo label="Quando" value={d.sabQuando} onChange={v=>set({...d,sabQuando:v})} placeholder="Data/frequência"/>
        <Campo label="Com quem" value={d.sabComQuem} onChange={v=>set({...d,sabComQuem:v})} placeholder="Quem me apoia?"/>
      </div>
    </Card>
    <Nav prev={prev} next={next} nextLabel="Plano de Ação →"/>
  </div>;
}

// ── TELA COMPROMISSO ──────────────────────────────────────────────
function TelaCompromisso({d,set,next,prev}){
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>📅</div>
      <div style={{fontWeight:800,fontSize:16}}>Compromisso & Medida de Sucesso</div>
    </Card>
    <Card style={{borderLeft:`4px solid ${C.teal}`}}>
      <Titulo cor={C.teal}>📅 Apresentar para</Titulo>
      <Campo label="Gestor, mentor ou para si mesmo(a)" value={d.gestor} onChange={v=>set({...d,gestor:v})} placeholder="Ex: Marina (só o primeiro nome)"/>
      <Campo label="Data da apresentação" value={d.gestorData} onChange={v=>set({...d,gestorData:v})} type="date"/>
    </Card>
    <Card style={{borderLeft:`4px solid ${C.amber}`}}>
      <Titulo>🎯 O que precisa acontecer em 90 dias?</Titulo>
      <div style={{background:C.navy,borderRadius:10,padding:12,marginBottom:12,fontSize:12,color:C.amber,fontStyle:"italic",lineHeight:1.6}}>
        "O que precisa acontecer nos próximos 90 dias para esse PDI ter valido a pena?"
      </div>
      <Campo label="Na minha vida pessoal" value={d.medida1} onChange={v=>set({...d,medida1:v})} placeholder="Ex: Retomar hábitos de saúde..." multi/>
      <Campo label="Na minha carreira" value={d.medida2} onChange={v=>set({...d,medida2:v})} placeholder="Ex: Conquistar promoção..." multi/>
      <Campo label="No meu desenvolvimento" value={d.medida3} onChange={v=>set({...d,medida3:v})} placeholder="Ex: Superar meu sabotador..." multi/>
    </Card>
    <Nav prev={prev} next={next} nextLabel="Finalizar 🎉"/>
  </div>;
}

// ── TELA CONCLUSÃO ────────────────────────────────────────────────
function TelaConclusao({d,set}){
  const [dlLoad,setDlLoad]=useState(false);
  const [dlMsg,setDlMsg]=useState("");
  async function baixar(){
    setDlLoad(true);setDlMsg("");
    // Salvar no ranking ao baixar o PPTX
    try{ const pts=calcPontos(d); await dbSalvar(d,pts); }catch(e){};
    try{
      if(!window.PptxGenJS){await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js";s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
      const prs=new window.PptxGenJS();prs.defineLayout({name:"CUSTOM",width:13.333,height:7.5});prs.layout="CUSTOM";
      const N="0F1D3A",NM="1A3160",NL="234080",AM=d.paletaCor||"F5A623",WH="FFFFFF",SL="EEF2FA",SD="C5D0E6";
      const GR="1DB87A",TL="0891B2",PU="7C3AED",OR="EA580C",RE="E05252",PI="EC4899";
      const hoje=d.data?new Date(d.data+"T12:00:00").toLocaleDateString("pt-BR"):new Date().toLocaleDateString("pt-BR");

      // ── S1 CAPA ───────────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:7.5,fill:{color:N},line:{color:N}});
      sl.addText("PLANO DE DESENVOLVIMENTO INDIVIDUAL",{x:.55,y:.6,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("PDI",{x:.5,y:1.5,w:9.333,h:2.8,fontSize:130,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.RECTANGLE,{x:.5,y:5.35,w:12.333,h:.04,fill:{color:AM},line:{color:AM}});
      sl.addText(d.nome||"[Nome]",{x:.55,y:5.5,w:11.733,h:.7,fontSize:28,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addText(d.cargo||"",{x:.55,y:6.25,w:11.733,h:.4,fontSize:15,color:SD,fontFace:"Calibri",margin:0});
      sl.addText(hoje,{x:.55,y:.3,w:10.667,h:.26,fontSize:9,color:"607090",fontFace:"Calibri",margin:0});}

      // ── S1.5 COMO APRESENTAR (oculto) ─────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:.83,fill:{color:NM},line:{color:NM}});
      sl.addText("SÓ PARA VOCÊ · NÃO APRESENTE ESTE SLIDE",{x:.45,y:.1,w:10.4,h:.25,fontSize:8,bold:true,color:AM,fontFace:"Calibri",margin:0});
      sl.addText("📌  Como apresentar — e o que ocultar antes",{x:.45,y:.33,w:11.867,h:.43,fontSize:15,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.38,y:.87,w:12.333,h:1.49,fill:{color:AM},rectRadius:.1});
      sl.addShape(prs.shapes.RECTANGLE,{x:7.733,y:1.03,w:.02,h:1.17,fill:{color:"B8861B"}});
      sl.addText("⚠️  Oculte ESTE slide antes de apresentar (leva 5 segundos):",{x:.65,y:1.0,w:6.8,h:.26,fontSize:10,bold:true,color:N,fontFace:"Calibri",margin:0});
      [["1.  ","Na lista de slides (à esquerda), clique com o botão direito neste slide."],
       ["2.  ","Clique em \u201cOcultar Slide\u201d."],
       ["3.  ","O número do slide fica riscado — ele não aparece na hora de apresentar."]
      ].forEach((s,i)=>{
        sl.addText([{text:s[0],options:{bold:true,color:N}},{text:s[1],options:{bold:false,color:"24324F"}}],
          {x:.67,y:1.38+i*.245,w:6.667,h:.22,fontSize:9,fontFace:"Calibri",margin:0});
      });
      sl.addText("Para reexibir depois: botão direito → \u201cOcultar Slide\u201d de novo.",{x:.67,y:2.15,w:6.667,h:.21,fontSize:8,italic:true,color:"4A3A12",fontFace:"Calibri",margin:0});
      sl.addText("📌  São 4 slides pra ocultar:",{x:7.96,y:1.0,w:4.653,h:.26,fontSize:10,bold:true,color:N,fontFace:"Calibri",margin:0});
      sl.addText("Repita os passos ao lado para estes 4 slides de uso pessoal: Ponto de Partida, Roda da Vida, Compromisso e este aqui (Como apresentar). Nenhum vem oculto automaticamente.",
        {x:7.96,y:1.33,w:4.653,h:.9,fontSize:8,color:"24324F",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.38,y:2.5,w:6.453,h:4.35,fill:{color:NL},rectRadius:.12});
      sl.addText("📋  Sequência para apresentar",{x:.62,y:2.72,w:5.8,h:.3,fontSize:12,bold:true,color:AM,fontFace:"Calibri",margin:0});
      [[TL,"Abra com sua intenção  ","por que você está ali e o que quer crescer."],
       [AM,"Conte quem você é  ","conquistas, jornada e o que te move."],
       [PU,"Mostre aonde quer chegar  ","legado e metas de curto, médio e longo prazo."],
       [GR,"Revele seu autoconhecimento  ","SWOT e habilidades: forças e como agiu."],
       [OR,"Detalhe o plano de ação  ","compromisso de 7 dias, 5W2H e cronograma."],
       ["0EA5E9","Faça um pedido claro  ","o apoio que precisa e o próximo passo."],
      ].forEach((p,i)=>{
        const y=3.28+i*.575;
        sl.addShape(prs.shapes.OVAL,{x:.65,y,w:.4,h:.4,fill:{color:p[0]},line:{color:p[0]}});
        sl.addText(`${i+1}`,{x:.65,y,w:.4,h:.4,fontSize:11,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText([{text:p[1],options:{bold:true,color:WH}},{text:p[2],options:{bold:false,color:SD}}],
          {x:1.5,y:y-.04,w:5.2,h:.48,fontSize:10,fontFace:"Calibri",margin:0,valign:"middle"});
      });
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:7.107,y:2.5,w:5.72,h:4.35,fill:{color:NL},rectRadius:.12});
      sl.addText("💬  Frases que ajudam",{x:7.44,y:2.72,w:5.067,h:.3,fontSize:12,bold:true,color:AM,fontFace:"Calibri",margin:0});
      [[TL,"ABERTURA","\u201cObrigada pelo seu tempo. Quero compartilhar meu plano de desenvolvimento e como pretendo evoluir.\u201d"],
       [PU,"TRANSIÇÃO","\u201cAgora que você me conhece um pouco melhor, deixa eu mostrar para onde quero ir.\u201d"],
       [GR,"FECHAMENTO","\u201cMeu pedido é [apoio específico]. Podemos combinar um acompanhamento mensal?\u201d"],
      ].forEach(([cor,label,frase],i)=>{
        const y=3.3+i*1.16;
        sl.addText(label,{x:7.44,y,w:5.067,h:.25,fontSize:9,bold:true,color:cor,fontFace:"Calibri",margin:0});
        sl.addText(frase,{x:7.44,y:y+.3,w:5.067,h:.72,fontSize:10,italic:true,color:"E9EEFB",fontFace:"Calibri",margin:6,valign:"top"});
      });}

      // ── S2 PONTO DE PARTIDA (oculto) ─────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.15,fill:{color:NM},line:{color:NM}});
      sl.addText("PONTO DE PARTIDA",{x:.6,y:.08,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Intenção & Como estou chegando hoje",{x:.6,y:.4,w:10.667,h:.6,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.35,w:8,h:3.05,fill:{color:NL},rectRadius:.1});
      sl.addText("🎯  MINHA INTENÇÃO",{x:.65,y:1.52,w:7.467,h:.3,fontSize:11,bold:true,color:AM,fontFace:"Calibri",margin:0});
      sl.addText(d.intencao||"–",{x:.65,y:1.95,w:7.467,h:2.3,fontSize:15,color:WH,fontFace:"Calibri",italic:true,valign:"top",margin:4});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:8.8,y:1.35,w:4.133,h:3.05,fill:{color:NL},rectRadius:.1});
      sl.addText("🌡️  COMO ESTOU",{x:9.05,y:1.52,w:3.6,h:.3,fontSize:11,bold:true,color:AM,fontFace:"Calibri",margin:0});
      [{k:"corpo",l:"💪 Corpo"},{k:"mente",l:"🧠 Mente"},{k:"emocao",l:"❤️ Emoção"}].forEach((dim,i)=>{
        const y=2.05+i*.72;
        sl.addText(`${dim.l}  ${d.energia[dim.k]}/5`,{x:9.05,y,w:3.63,h:.32,fontSize:12,color:WH,fontFace:"Calibri",margin:0,valign:"middle"});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:9.05,y:y+.36,w:3.63,h:.13,fill:{color:SD},rectRadius:.04});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:9.05,y:y+.36,w:Math.max(3.63*(d.energia[dim.k]/5),0.08),h:.13,fill:{color:AM},rectRadius:.04});});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:4.65,w:12.533,h:1.55,fill:{color:AM},rectRadius:.12});
      sl.addText("🔥  Nível de Vontade",{x:.85,y:4.85,w:9.333,h:.4,fontSize:15,bold:true,color:N,fontFace:"Calibri",margin:0});
      sl.addText("O quanto quero me mover pelo meu desenvolvimento agora",{x:.85,y:5.3,w:9.333,h:.35,fontSize:10,color:"6B5310",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.OVAL,{x:11.25,y:4.79,w:1.27,h:1.27,fill:{color:N},line:{color:N}});
      sl.addText(`${d.vontade}`,{x:11.25,y:4.79,w:1.27,h:1.27,fontSize:38,bold:true,color:AM,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      sl.addText("🔒  Uso pessoal · para sua autoavaliação (não apresentar)",{x:.4,y:6.55,w:12.533,h:.35,fontSize:9,color:"607090",italic:true,fontFace:"Calibri",margin:0,align:"center"});}

      // ── S3 SOBRE MIM ─────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.5,fill:{color:N},line:{color:N}});
      sl.addText("SOBRE MIM",{x:.6,y:.1,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText(d.nome||"[Nome]",{x:.6,y:.42,w:10.667,h:.85,fontSize:28,bold:true,color:WH,fontFace:"Calibri",margin:0});
      if(d.sobreMim.frase){sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.62,w:12.267,h:.88,fill:{color:N},rectRadius:.1});sl.addText(`❝  ${d.sobreMim.frase}  ❞`,{x:.4,y:1.62,w:12.267,h:.88,fontSize:13,color:AM,italic:true,align:"center",valign:"middle",fontFace:"Calibri",margin:12});}
      // Foto placeholder
      sl.addText("📷  Quem eu sou além do trabalho",{x:.4,y:2.65,w:6.933,h:.32,fontSize:11,bold:true,color:"4A5A7A",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:3.02,w:4.533,h:3.9,fill:{color:"C5D0E6"},rectRadius:.15});
      sl.addText("📷\nAdicione sua\nfoto principal",{x:.4,y:3.02,w:4.533,h:3.9,fontSize:13,color:"607090",align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:5.267,y:3.02,w:2.067,h:1.87,fill:{color:"D5DFF0"},rectRadius:.1});
      sl.addText("🌟\nUm momento\nmarcante",{x:5.267,y:3.02,w:2.067,h:1.87,fontSize:10,color:"607090",align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:5.267,y:5.05,w:2.067,h:1.87,fill:{color:"D5DFF0"},rectRadius:.1});
      sl.addText("❤️\nO que eu amo",{x:5.267,y:5.05,w:2.067,h:1.87,fontSize:10,color:"607090",align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      // Inspirações
      sl.addText("✨  O que me inspira",{x:7.6,y:2.65,w:5.2,h:.32,fontSize:11,bold:true,color:"4A5A7A",fontFace:"Calibri",margin:0});
      const insp=d.sobreMim.inspiracoes.length>0?d.sobreMim.inspiracoes:["Família","Propósito","Crescimento"];
      const inspCores=[GR,TL,PU,AM,OR,RE,PI,"028090"];
      insp.slice(0,5).forEach((item,i)=>{
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:7.6,y:3.05+i*.78,w:5.2,h:.66,fill:{color:inspCores[i]||GR},rectRadius:.12});
        sl.addText(item,{x:7.6,y:3.05+i*.78,w:5.2,h:.66,fontSize:15,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});});}

      // ── S4 CONQUISTAS ─────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.3,fill:{color:N},line:{color:N}});
      sl.addText("MINHAS CONQUISTAS",{x:.6,y:.1,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("O que já construí que me orgulha",{x:.6,y:.42,w:10.667,h:.7,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      const cores3=[GR,TL,PU];
      [{n:1,v:d.conquistas.c1||"[Conquista 1]"},{n:2,v:d.conquistas.c2||"[Conquista 2]"},{n:3,v:d.conquistas.c3||"[Conquista 3]"}].forEach((c,i)=>{
        const y=1.5+i*1.85;const cor=cores3[i];
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y,w:12.533,h:1.68,fill:{color:WH},rectRadius:.14});
        sl.addShape(prs.shapes.OVAL,{x:.62,y:y+.44,w:.8,h:.8,fill:{color:cor},line:{color:cor}});
        sl.addText(`${c.n}`,{x:.62,y:y+.44,w:.8,h:.8,fontSize:21,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(c.v,{x:2.05,y:y+.14,w:10.7,h:1.4,fontSize:15,color:N,fontFace:"Calibri",valign:"middle",margin:6});});}

      // ── S5 JORNADA ────────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.3,fill:{color:N},line:{color:N}});
      sl.addText("MINHA JORNADA",{x:.6,y:.1,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Formações & Marcos Profissionais",{x:.6,y:.42,w:10.667,h:.7,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      // Formações (faixa superior, largura total)
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.4,w:12.533,h:1.55,fill:{color:NM},rectRadius:.12});
      sl.addText("📚  Formações",{x:.65,y:1.53,w:12.03,h:.34,fontSize:13,bold:true,color:AM,fontFace:"Calibri",margin:0});
      sl.addText(d.jornada.formacoes||"[Suas formações]",{x:.65,y:1.9,w:12.03,h:.98,fontSize:12,color:WH,fontFace:"Calibri",valign:"top",margin:4});
      // Marcos — linha do tempo horizontal (até 10), com cartões conectados à linha
      sl.addText("📍  Marcos Profissionais",{x:.65,y:3.2,w:8,h:.35,fontSize:14,bold:true,color:N,fontFace:"Calibri",margin:0});
      const marcos=d.jornada.marcos.filter(m=>m.ano||m.titulo).slice(0,MARCOS_MAX);
      if(marcos.length){
        const dotR=.09,stemLen=.16,cardH=1.02,pad=.09,margemSlide=.5;
        // largura do cartão pretendida, decrescendo conforme aumenta a quantidade de marcos
        const candCardW=marcos.length<=3?2.4:marcos.length<=6?1.7:marcos.length<=8?1.3:1.05;
        // a linha do tempo reserva espaço nas pontas do tamanho de meio cartão + margem,
        // assim os cartões das extremidades nunca ultrapassam a borda do slide
        const tlY=5.15,tlX0=margemSlide+candCardW/2,tlX1=13.333-margemSlide-candCardW/2;
        const span=marcos.length>1?(tlX1-tlX0)/(marcos.length-1):0;
        const cardW=marcos.length>1?Math.min(candCardW,Math.max(span*0.92,.85)):candCardW;
        const [anoFS,tituloFS,maxChars]=marcos.length<=3?[13,10.5,70]:marcos.length<=6?[12,9.5,50]:[10.5,8,32];
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:tlX0,y:tlY-.022,w:tlX1-tlX0,h:.044,fill:{color:AM},line:{color:AM},rectRadius:.02});
        marcos.forEach((m,i)=>{
          const cx=marcos.length>1?tlX0+i*span:(tlX0+tlX1)/2;
          const acima=i%2===0;
          const tituloTxt=(m.titulo||"").length>maxChars?`${m.titulo.slice(0,maxChars-2)}…`:(m.titulo||"");
          const cardY=acima?tlY-dotR-stemLen-cardH:tlY+dotR+stemLen;
          const stemY=acima?cardY+cardH:tlY+dotR;
          sl.addShape(prs.shapes.RECTANGLE,{x:cx-.011,y:stemY,w:.022,h:stemLen,fill:{color:AM},line:{color:AM}});
          sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:cx-cardW/2,y:cardY,w:cardW,h:cardH,fill:{color:WH},line:{color:AM,width:.75},rectRadius:.09});
          sl.addText(m.ano||"",{x:cx-cardW/2+pad,y:cardY+.08,w:cardW-2*pad,h:.3,fontSize:anoFS,bold:true,color:AM,align:"center",fontFace:"Calibri",margin:0});
          sl.addText(tituloTxt,{x:cx-cardW/2+pad,y:cardY+.4,w:cardW-2*pad,h:cardH-.48,fontSize:tituloFS,color:N,align:"center",valign:"top",fontFace:"Calibri",margin:0,shrinkText:true});
          sl.addShape(prs.shapes.OVAL,{x:cx-dotR,y:tlY-dotR,w:dotR*2,h:dotR*2,fill:{color:AM},line:{color:WH,width:1.5}});
        });
        sl.addText("💡  Ajuste marcos, datas e textos diretamente no PowerPoint conforme sua trajetória.",
          {x:.4,y:7.05,w:12.533,h:.3,fontSize:9,italic:true,color:"7A8AAF",align:"center",fontFace:"Calibri",margin:0});
      }else{
        sl.addText("Adicione seus marcos profissionais na próxima edição do seu PDI.",{x:.9,y:4.95,w:11.533,h:.4,fontSize:11,italic:true,color:"7A8AAF",align:"center",fontFace:"Calibri",margin:0});
      }}

      // ── S6 OBJETIVOS ──────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.3,fill:{color:N},line:{color:N}});
      sl.addText("MEUS OBJETIVOS",{x:.6,y:.1,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Legado & Onde Quero Chegar",{x:.6,y:.42,w:10.667,h:.7,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.42,w:12.267,h:1.12,fill:{color:NM},rectRadius:.1});
      sl.addText("🌟",{x:.55,y:1.55,w:.7,h:.78,fontSize:22,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(d.objetivos.legado||"[Seu legado]",{x:1.667,y:1.5,w:10.933,h:1.0,fontSize:13,color:WH,fontFace:"Calibri",italic:true,valign:"middle",margin:6});
      const objPrazos=[
        {prazo:"Curto",sub:"2-3 anos",cargo:d.objetivos.cargoShort,txt:d.objetivos.cargoShortText,cor:TL},
        {prazo:"Médio",sub:"3-5 anos",cargo:d.objetivos.cargoMid,txt:d.objetivos.cargoMidText,cor:PU},
        {prazo:"Longo",sub:"5-10 anos",cargo:d.objetivos.cargoLong,txt:d.objetivos.cargoLongText,cor:OR},
      ];
      objPrazos.forEach((o,i)=>{
        const x=0.533+i*4.267;
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x,y:2.68,w:4.067,h:3.75,fill:{color:o.cor},rectRadius:.12});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x,y:2.68,w:4.067,h:.55,fill:{color:o.cor},rectRadius:.12});
        sl.addText(`${o.prazo}`,{x,y:2.68,w:4.067,h:.55,fontSize:14,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(o.sub,{x,y:3.25,w:4.067,h:.35,fontSize:10,color:WH,align:"center",italic:true,fontFace:"Calibri",margin:0});
        sl.addText(o.cargo||"[cargo/objetivo]",{x:x+0.16,y:3.65,w:3.76,h:.55,fontSize:15,bold:true,color:WH,align:"center",fontFace:"Calibri",margin:0});
        sl.addText(o.txt||"[descrição]",{x:x+0.16,y:4.3,w:3.76,h:2.0,fontSize:12,color:WH,align:"center",valign:"top",fontFace:"Calibri",italic:true,margin:6});});
      if(d.objetivos.realidade){
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:6.55,w:12.533,h:.82,fill:{color:"E8EEF7"},rectRadius:.1});
        sl.addText([{text:"🔎  Checagem de realidade:  ",options:{bold:true,color:N}},{text:d.objetivos.realidade,options:{bold:false,color:"24324F"}}],
          {x:.65,y:6.62,w:12.03,h:.7,fontSize:10,fontFace:"Calibri",valign:"middle",margin:2});
      }}

      // ── S7 SWOT + HABILIDADES ─────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.1,fill:{color:N},line:{color:N}});
      sl.addText("AUTOCONHECIMENTO PROFISSIONAL",{x:.6,y:.08,w:12,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("SWOT & Habilidades do Futuro",{x:.6,y:.38,w:12,h:.55,fontSize:20,bold:true,color:WH,fontFace:"Calibri",margin:0});
      // SWOT 2x2
      const swotItems=[
        {l:"💪 FORÇAS",cor:GR,itens:[...d.swot.forcas,d.swot.forcasOutros].filter(Boolean)},
        {l:"🎯 OPORTUNIDADES",cor:TL,itens:[...d.swot.oportunidades,d.swot.oportunidadesOutros].filter(Boolean)},
        {l:"⚠️ PONTOS DE DESENVOLVIMENTO",cor:RE,itens:[...d.swot.fraquezas,d.swot.fraquezasOutros].filter(Boolean)},
        {l:"🔴 AMEAÇAS",cor:OR,itens:[...d.swot.ameacas,d.swot.ameacasOutros].filter(Boolean)},
      ];
      swotItems.forEach((q,i)=>{
        const col=i%2,row=Math.floor(i/2),x=0.467+col*3.84,y=1.22+row*2.5;
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x,y,w:3.627,h:2.35,fill:{color:WH},rectRadius:.1});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x,y,w:3.627,h:.42,fill:{color:q.cor},rectRadius:.1});
        sl.addText(q.l,{x,y,w:3.627,h:.42,fontSize:8,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        // Sem cortar itens: a fonte diminui conforme a pessoa marca mais chips + escreve "outros",
        // pra tudo que ela preencheu aparecer no PowerPoint (antes, o 6º item em diante sumia sem aviso).
        const itensFS = q.itens.length<=5?10:q.itens.length<=8?9:8;
        sl.addText(q.itens.map(v=>`• ${v}`).join("\n")||"–",{x:x+0.133,y:y+.48,w:3.36,h:1.8,fontSize:itensFS,color:N,fontFace:"Calibri",valign:"top",margin:2,shrinkText:true});});
      // Habilidades radar (barras à direita)
      sl.addText("🎯  Habilidades do Futuro",{x:8,y:1.22,w:4.8,h:.38,fontSize:12,bold:true,color:N,fontFace:"Calibri",margin:0});
      HABILIDADES.forEach((h,i)=>{
        const y=1.68+i*.55;const nota=d.habilidades[h.id]||0;
        const cor=h.grupo==="Digital"?TL:h.grupo==="Cognitiva"?PU:GR;
        sl.addText(h.nome,{x:8,y,w:3.2,h:.36,fontSize:9,color:N,fontFace:"Calibri",margin:0,valign:"middle"});
        sl.addText(`${nota}`,{x:11.133,y,w:.4,h:.36,fontSize:10,bold:true,color:cor,align:"right",fontFace:"Calibri",margin:0});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:11.667,y:y+.1,w:.9,h:.14,fill:{color:SD},rectRadius:.04});
        if(nota>0)sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:11.667,y:y+.1,w:Math.max(1.2*(nota/5),0.053),h:.14,fill:{color:cor},rectRadius:.04});});
      // Estratégia SWOT
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.35,y:6.25,w:12.4,h:1.05,fill:{color:N},rectRadius:.1});
      sl.addText("🎯  Como vou usar meu SWOT a meu favor",{x:.55,y:6.33,w:11.867,h:.28,fontSize:10,bold:true,color:AM,fontFace:"Calibri",margin:0});
      const estrategia=d.swot.estrategia||"[Escreva aqui como você vai usar suas forças para aproveitar suas oportunidades]";
      sl.addText(estrategia,{x:.55,y:6.64,w:11.867,h:.62,fontSize:10,color:WH,fontFace:"Calibri",margin:0});}

      // ── S7.5 RODA DA VIDA (oculto) ────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.15,fill:{color:NM},line:{color:NM}});
      sl.addText("MINHA RODA DA VIDA",{x:.6,y:.08,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Equilíbrio nas áreas da minha vida",{x:.6,y:.4,w:10.667,h:.6,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      const labelsRoda=AREAS_RODA;
      const valoresRoda=AREAS_RODA.map(a=>d.rodaVida[a]?.nota||0);
      sl.addChart(prs.charts.RADAR,[{name:"Nível atual",labels:labelsRoda,values:valoresRoda}],{
        x:.3,y:1.3,w:7.733,h:4.9,chartColors:[AM],radarStyle:"filled",showLegend:false,showTitle:false,
        catAxisLabelColor:WH,catAxisLabelFontSize:9,catAxisLabelFontFace:"Calibri",
        valAxisLabelColor:"7A8AAF",valAxisLabelFontSize:7,valAxisMinVal:0,valAxisMaxVal:10,valAxisMajorUnit:2,
        valGridLine:{color:"2A3F6A",size:1},catGridLine:{color:"2A3F6A",size:1},
        chartArea:{fill:{color:N}},plotArea:{fill:{color:N}},dataLabelColor:WH,showValue:false});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:8.4,y:1.3,w:4.533,h:4.9,fill:{color:NL},rectRadius:.1});
      sl.addText("💡  O que fazer com isso",{x:8.8,y:1.48,w:3.8,h:.32,fontSize:11,bold:true,color:AM,fontFace:"Calibri",margin:0});
      sl.addText("Quanto menor a nota, mais aquela área pede atenção. Escolha 1 ou 2 áreas para investir agora.",
        {x:8.8,y:1.86,w:3.8,h:.62,fontSize:8,color:SD,fontFace:"Calibri",margin:0});
      const baixasRoda=Object.entries(d.rodaVida).sort((a,b)=>(a[1].nota||0)-(b[1].nota||0)).slice(0,3);
      const coresBaixasRoda=[RE,OR,AM];
      baixasRoda.forEach(([area,v],i)=>{
        const y=2.62+i*.85;
        sl.addShape(prs.shapes.OVAL,{x:8.8,y,w:.32,h:.32,fill:{color:coresBaixasRoda[i]}});
        sl.addText(`${v.nota||0}`,{x:8.8,y:y-.02,w:.32,h:.36,fontSize:10,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(area,{x:9.36,y,w:3.2,h:.3,fontSize:10,bold:true,color:WH,fontFace:"Calibri",margin:0});
        sl.addText(v.melhorar||"Defina uma ação para essa área…",{x:9.36,y:y+.28,w:3.4,h:.5,fontSize:8,italic:!v.melhorar,color:v.melhorar?SD:"6E83B5",fontFace:"Calibri",margin:0});});
      sl.addText("🔒  Uso pessoal · esta página é só sua — use para se conhecer melhor (não apresentar)",{x:.4,y:6.9,w:12.267,h:.35,fontSize:9,color:"607090",italic:true,fontFace:"Calibri",margin:0});}

      // ── S8 SABOTADOR ──────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.3,fill:{color:N},line:{color:N}});
      sl.addText("ANTI-AUTOSSABOTAGEM",{x:.6,y:.1,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Meu Perfil & Plano para Superar Bloqueios",{x:.6,y:.42,w:10.667,h:.7,fontSize:20,bold:true,color:WH,fontFace:"Calibri",margin:0});
      const sabInfo=SABOTADORES_INFO[d.sabotadorPrincipal]||{frase:'""',tracos:""};
      const sabEmoji=QUIZ_SABOTADORES.find(q=>q.sab===d.sabotadorPrincipal)?.emoji||"🛡️";
      const sabEmoji2=QUIZ_SABOTADORES.find(q=>q.sab===d.sabotadorSecundario)?.emoji||"";
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.42,w:5.067,h:5.55,fill:{color:NM},rectRadius:.12});
      sl.addText(sabEmoji,{x:.4,y:1.6,w:5.067,h:.9,fontSize:40,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(d.sabotadorPrincipal||"[Sabotador]",{x:.5,y:2.52,w:4.8,h:.55,fontSize:18,bold:true,color:AM,align:"center",fontFace:"Calibri",margin:0});
      sl.addText("Sabotador Principal",{x:.5,y:3.08,w:4.8,h:.3,fontSize:9,color:SD,align:"center",italic:true,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.RECTANGLE,{x:1.333,y:3.45,w:3.333,h:.04,fill:{color:AM},line:{color:AM}});
      sl.addText(sabInfo.frase,{x:.55,y:3.58,w:4.667,h:1.0,fontSize:11,color:SD,italic:true,align:"center",fontFace:"Calibri",margin:0});
      sl.addText("Traços secundários",{x:.5,y:4.68,w:4.8,h:.3,fontSize:9,color:AM,bold:true,fontFace:"Calibri",margin:0,align:"center"});
      sl.addText(`${sabEmoji2} ${d.sabotadorSecundario||"–"}`,{x:.5,y:5.0,w:4.8,h:.3,fontSize:11,color:WH,align:"center",fontFace:"Calibri",margin:0});
      [{l:"🎯 Meta",v:d.sabMeta},{l:"🛡️ Como superar",v:d.sabComo},{l:"📅 Quando",v:d.sabQuando},{l:"🤝 Com quem",v:d.sabComQuem}].forEach((it,i)=>{
        const y=1.42+i*1.45;
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:5.867,y,w:6.933,h:1.32,fill:{color:WH},rectRadius:.1});
        sl.addText(it.l,{x:6.107,y:y+.1,w:6.453,h:.3,fontSize:10,bold:true,color:TL,fontFace:"Calibri",margin:0});
        sl.addText(it.v||"[preencher]",{x:6.107,y:y+.42,w:6.453,h:.82,fontSize:12,color:N,fontFace:"Calibri",margin:0,valign:"top"});});
      sl.addText("ℹ️ Quiz de referência inicial — não substitui o teste completo de Sabotadores (Positive Intelligence), de Shirzad Chamine.",
        {x:.4,y:7.14,w:12.533,h:.3,fontSize:8,italic:true,color:"7A8AAF",align:"center",fontFace:"Calibri",margin:0});}

      // ── S9 COMPROMISSO 7 DIAS ─────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.3,fill:{color:NM},line:{color:NM}});
      sl.addText("⚡ COMPROMISSO DE 7 DIAS",{x:.6,y:.1,w:12,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Minha Primeira Ação — Começa Hoje",{x:.6,y:.42,w:12,h:.7,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:1.6,y:1.5,w:10.133,h:5.0,fill:{color:AM},rectRadius:.2});
      sl.addText("🤝",{x:1.6,y:1.75,w:10.133,h:1.05,fontSize:50,align:"center",fontFace:"Calibri",margin:0});
      sl.addText("Nos próximos 7 dias, eu vou:",{x:1.867,y:2.95,w:9.6,h:.5,fontSize:15,color:N,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(d.compromisso7dias||"[Sua ação de 7 dias]",{x:1.867,y:3.55,w:9.6,h:1.25,fontSize:21,bold:true,color:N,align:"center",valign:"middle",fontFace:"Calibri",margin:8});
      sl.addShape(prs.shapes.RECTANGLE,{x:2.933,y:4.92,w:7.467,h:.04,fill:{color:N},line:{color:N}});
      sl.addText("Esta é a minha promessa.",{x:1.867,y:5.06,w:9.6,h:.42,fontSize:13,color:NM,italic:true,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(`${d.nome||"[Nome]"}  ·  ${hoje}`,{x:1.867,y:5.58,w:9.6,h:.45,fontSize:15,bold:true,color:NM,align:"center",fontFace:"Calibri",margin:0});
      sl.addText("Lembre-se: uma ação pequena hoje vale mais do que um plano perfeito para amanhã. ✨",{x:.5,y:6.72,w:12.333,h:.42,fontSize:11,color:SD,italic:true,align:"center",fontFace:"Calibri",margin:0});}

      // ── S10 5W2H ──────────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.1,fill:{color:N},line:{color:N}});
      sl.addText("PLANO DE AÇÃO",{x:.6,y:.08,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Método 5W2H — Plano para até 4 ações",{x:.6,y:.38,w:10.667,h:.55,fontSize:18,bold:true,color:WH,fontFace:"Calibri",margin:0});
      // Cabeçalho colunas
      const colW=2.45;
      ["Ação 1","Ação 2","Ação 3","Ação 4"].forEach((ac,i)=>{
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:3+i*colW,y:1.15,w:colW-0.107,h:.42,fill:{color:NM},rectRadius:.06});
        sl.addText(ac,{x:3+i*colW,y:1.15,w:colW-0.107,h:.42,fontSize:11,bold:true,color:AM,align:"center",valign:"middle",fontFace:"Calibri",margin:0});});
      // Linhas 5W2H
      const rows=[
        {l:"O QUÊ?",sl:"Qual ação?",cor:TL},
        {l:"POR QUÊ?",sl:"Por que importa?",cor:AM},
        {l:"ONDE?",sl:"Onde será feito?",cor:PU},
        {l:"QUANDO?",sl:"Prazo / data",cor:GR},
        {l:"QUEM?",sl:"Responsável / apoio",cor:OR},
        {l:"COMO?",sl:"Como executar?",cor:"0891B2"},
        {l:"QUANTO?",sl:"Custo / recursos",cor:PI},
      ];
      rows.forEach((row,ri)=>{
        const y=1.65+ri*.76;
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.25,y,w:2.56,h:.68,fill:{color:row.cor},rectRadius:.08});
        sl.addText(row.l,{x:.25,y,w:2.56,h:.38,fontSize:10,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(row.sl,{x:.25,y:y+.36,w:2.56,h:.3,fontSize:8,color:WH,align:"center",italic:true,fontFace:"Calibri",margin:0});
        for(let ci=0;ci<4;ci++){
          sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:3+ci*colW,y,w:colW-0.107,h:.68,fill:{color:ri%2===0?NM:NL},rectRadius:.06});
          sl.addText("✏️",{x:3.133+ci*colW,y:y+.18,w:colW-0.373,h:.32,fontSize:13,align:"center",fontFace:"Calibri",margin:0});}});}

      // ── S11 CRONOGRAMA ANUAL ──────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.1,fill:{color:N},line:{color:N}});
      sl.addText("🗓️ CRONOGRAMA ANUAL",{x:.6,y:.08,w:12,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText(`Linha do Tempo das Minhas Ações — ${new Date().getFullYear()}/${new Date().getFullYear()+1}`,{x:.6,y:.38,w:12,h:.55,fontSize:18,bold:true,color:WH,fontFace:"Calibri",margin:0});
      const meses=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
      const cw=12.267/12;
      meses.forEach((m,i)=>{
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:0.533+i*cw,y:1.15,w:cw-0.053,h:.45,fill:{color:i%2===0?NM:NL},rectRadius:.05});
        sl.addText(m,{x:0.533+i*cw,y:1.15,w:cw-0.053,h:.45,fontSize:9,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});});
      // Ações baseadas no plano
      const acoesPlano=[
        {nome:d.plano30.oq||"Ação 30 dias",inicio:1,dur:1,cor:TL,y:1.95},
        {nome:d.plano60.oq||"Ação 60 dias",inicio:2,dur:2,cor:PU,y:3.0},
        {nome:d.plano90.oq||"Ação 90 dias",inicio:3,dur:3,cor:GR,y:4.05},
        {nome:d.compromisso7dias||"Compromisso 7 dias",inicio:0,dur:1,cor:AM,y:5.1},
      ];
      acoesPlano.forEach(a=>{
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:0.533+a.inicio*cw,y:a.y,w:a.dur*cw-0.053,h:.78,fill:{color:a.cor},rectRadius:.1});
        sl.addText(a.nome.substring(0,30),{x:.65+a.inicio*cw,y:a.y+.1,w:a.dur*cw-0.29,h:.58,fontSize:11,bold:true,color:WH,fontFace:"Calibri",valign:"middle",margin:2});});
      // Marcos 30/60/90
      [{d:1,l:"30 dias",c:AM},{d:2,l:"60 dias",c:GR},{d:3,l:"90 dias",c:TL}].forEach(m=>{
        sl.addShape(prs.shapes.RECTANGLE,{x:0.533+m.d*cw,y:1.15,w:.06,h:4.85,fill:{color:m.c},line:{color:m.c}});
        sl.addText(m.l,{x:0.533+m.d*cw-0.4,y:6.08,w:1.6,h:.3,fontSize:10,bold:true,color:m.c,fontFace:"Calibri",align:"center",margin:0});});
      sl.addText("💡 Edite este cronograma no PowerPoint conforme seu ritmo — arraste as barras para ajustar os prazos.",{x:.4,y:6.65,w:12.533,h:.35,fontSize:10,color:"4A5A7A",italic:true,align:"center",fontFace:"Calibri",margin:0});}

      // ── S12 COMPROMISSO (oculto) ──────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:13.333,h:1.3,fill:{color:NM},line:{color:NM}});
      sl.addText("MEU COMPROMISSO",{x:.6,y:.1,w:10.667,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Apresentar meu PDI & Medida de Sucesso",{x:.6,y:.42,w:10.667,h:.7,fontSize:20,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.42,w:12.267,h:.88,fill:{color:AM},rectRadius:.1});
      sl.addText(`📅  Vou apresentar para: ${d.gestor||"[gestor, mentor ou eu mesmo(a)]"}   ·   Data: ${d.gestorData?new Date(d.gestorData+"T12:00:00").toLocaleDateString("pt-BR"):"[DD/MM/AAAA]"}`,{x:.6,y:1.42,w:11.733,h:.88,fontSize:14,bold:true,color:N,fontFace:"Calibri",valign:"middle",margin:10});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:2.42,w:12.267,h:4.1,fill:{color:NL},rectRadius:.12});
      sl.addText("O que precisa acontecer nos próximos 90 dias para esse PDI valer a pena?",{x:.6,y:2.55,w:11.733,h:.52,fontSize:12,bold:true,color:AM,fontFace:"Calibri",margin:0});
      [{n:1,v:d.medida1||"[Vida pessoal]"},{n:2,v:d.medida2||"[Carreira]"},{n:3,v:d.medida3||"[Desenvolvimento]"}].forEach((m,i)=>{
        const y=3.18+i*.95;
        sl.addShape(prs.shapes.OVAL,{x:.58,y:y+.08,w:.56,h:.56,fill:{color:AM},line:{color:AM}});
        sl.addText(`${m.n}`,{x:.58,y:y+.08,w:.56,h:.56,fontSize:15,bold:true,color:N,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(m.v,{x:1.733,y,w:10.8,h:.7,fontSize:13,color:WH,fontFace:"Calibri",valign:"middle",margin:3});});
      sl.addText("🔒  Uso pessoal · não apresentar",{x:.4,y:6.62,w:12.267,h:.3,fontSize:9,color:"607090",italic:true,fontFace:"Calibri",margin:0,align:"center"});}

      // ── S14 FRASE FINAL ───────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.OVAL,{x:-1.6,y:-1.6,w:6.8,h:6.8,fill:{color:NM,transparency:55},line:{color:NM,transparency:55}});
      sl.addShape(prs.shapes.OVAL,{x:9.2,y:2.9,w:5.8,h:5.8,fill:{color:NL,transparency:65},line:{color:NL,transparency:65}});
      sl.addText("\u201C",{x:.8,y:.9,w:11.733,h:1.2,fontSize:80,bold:true,color:AM,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(d.fraseF||"Meu desenvolvimento começa com uma decisão:\na de agir.",{x:1.6,y:2.15,w:10.133,h:2.4,fontSize:24,color:WH,italic:true,align:"center",valign:"middle",fontFace:"Calibri",margin:16});
      sl.addText("\u201D",{x:.8,y:4.5,w:11.733,h:1.0,fontSize:80,bold:true,color:AM,align:"center",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.RECTANGLE,{x:4.133,y:5.95,w:5.067,h:.05,fill:{color:AM},line:{color:AM}});
      sl.addText(d.nome||"[Nome]",{x:.8,y:6.08,w:11.733,h:.5,fontSize:18,bold:true,color:AM,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(hoje,{x:.8,y:6.63,w:11.733,h:.3,fontSize:10,color:"607090",align:"center",fontFace:"Calibri",margin:0});}

      await prs.writeFile({fileName:`PDI_${(d.nome||"meu").replace(/ /g,"_")}.pptx`});
      setDlMsg("✅ PowerPoint baixado! Abra e personalize como quiser.");
      limparRascunho(); // termina aqui: apaga o rascunho deste aparelho
    }catch(e){setDlMsg("❌ Erro ao gerar. Tente novamente.");console.error(e);}
    setDlLoad(false);
  }

  return <div>
    <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,borderRadius:16,padding:24,textAlign:"center",color:C.white,marginBottom:12}}>
      <div style={{fontSize:48,marginBottom:8}}>🎉</div>
      <div style={{fontWeight:800,fontSize:20,marginBottom:4}}>Seu PDI está pronto!</div>
      <div style={{color:C.slateDeep,fontSize:12}}>Parabéns, {d.nome}! Agora baixe seu PowerPoint personalizado.</div>
    </div>

    <Card style={{borderLeft:`4px solid ${C.amber}`}}>
      <Titulo>✍️ Sua frase de encerramento</Titulo>
      <textarea value={d.fraseF||""} onChange={e=>set({...d,fraseF:e.target.value})} placeholder='"Meu desenvolvimento começa com uma decisão: a de agir."'
        style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${C.amber}`,borderRadius:10,fontSize:13,outline:"none",background:C.slate,fontFamily:"inherit",resize:"vertical",minHeight:65,fontStyle:"italic"}}/>
    </Card>

    <Card>
      <Titulo>🎨 Cor de destaque do seu PowerPoint</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:10,lineHeight:1.6}}>
        Escolha a cor que vai aparecer nos títulos e destaques do seu PDI, para deixar do seu jeito.
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
        {PALETAS.map(p=>{
          const sel=(d.paletaCor||"F5A623")===p.cor;
          return <button key={p.id} onClick={()=>set({...d,paletaCor:p.cor})} title={p.nome}
            style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,padding:"6px 4px",border:`2px solid ${sel?`#${p.cor}`:C.slateDeep}`,borderRadius:12,background:sel?`#${p.cor}12`:C.white,cursor:"pointer",width:64}}>
            <span style={{width:26,height:26,borderRadius:"50%",background:`#${p.cor}`,border:`2px solid ${C.white}`,boxShadow:"0 0 0 1px "+C.slateDeep}}/>
            <span style={{fontSize:9.5,fontWeight:sel?800:600,color:sel?C.navy:C.textMid}}>{p.nome}</span>
          </button>;
        })}
      </div>
    </Card>

    <Card>
      <Titulo>📥 Baixar seu PDI em PowerPoint</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:12,lineHeight:1.6}}>
        15 slides profissionais — inclui slides ocultos para uso pessoal (ponto de partida, roda da vida, compromisso). Abra no PowerPoint ou Google Slides e edite como quiser!
      </div>
      <button onClick={baixar} disabled={dlLoad} style={{width:"100%",padding:14,background:dlLoad?C.slateDeep:C.navy,color:dlLoad?C.textMid:C.white,border:"none",borderRadius:10,fontWeight:800,fontSize:14,cursor:dlLoad?"default":"pointer"}}>
        {dlLoad?"⏳ Gerando seu PowerPoint...":"📊 Baixar PDI (.pptx)"}
      </button>
      {dlMsg&&<div style={{marginTop:10,padding:10,background:dlMsg.startsWith("✅")?`${C.green}18`:`${C.red}18`,borderRadius:9,fontSize:12,fontWeight:700,color:dlMsg.startsWith("✅")?C.green:C.red,textAlign:"center"}}>{dlMsg}</div>}
    </Card>
  </div>;
}

// ── MENSAGEM MOTIVACIONAL ─────────────────────────────────────────
function MsgMotivacional({etapa,onContinuar}){
  return <div style={{minHeight:"100dvh",background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',sans-serif",textAlign:"center"}}>
    <div style={{fontSize:56,marginBottom:20}}>🌟</div>
    <div style={{fontSize:18,fontWeight:700,color:C.white,lineHeight:1.5,maxWidth:300,marginBottom:32}}>{MSGS[etapa%MSGS.length]}</div>
    <button onClick={onContinuar} style={{padding:"14px 40px",background:C.amber,color:C.navy,border:"none",borderRadius:12,fontWeight:800,fontSize:15,cursor:"pointer"}}>Continuar →</button>
  </div>;
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────



function TelaRevisao(){
  return <div style={{minHeight:"100dvh",background:C.navy,padding:24,fontFamily:"'Inter',sans-serif"}}>
    <div style={{textAlign:"center",marginBottom:24,paddingTop:20}}>
      <div style={{fontSize:48,marginBottom:8}}>🔄</div>
      <div style={{fontSize:22,fontWeight:800,color:C.white,marginBottom:8}}>Revisão do PDI</div>
      <div style={{fontSize:14,color:C.slateDeep}}>Como está seu desenvolvimento?</div>
    </div>
    <div style={{background:C.navyMid,borderRadius:16,padding:20,marginBottom:16}}>
      <div style={{fontWeight:700,fontSize:14,color:C.amber,marginBottom:16}}>Reflita sobre as últimas semanas:</div>
      {["O que avancei no meu plano de ação?","Meu sabotador apareceu? Como me saí?","O que preciso ajustar no meu PDI?","Qual foi minha maior conquista nesse período?"].map((q,i)=>(
        <div key={i} style={{marginBottom:14}}>
          <div style={{fontSize:12,color:C.slateDeep,marginBottom:6,fontWeight:600}}>{i+1}. {q}</div>
          <textarea placeholder="Sua reflexão..." style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${C.navyLight}`,borderRadius:10,fontSize:12,outline:"none",background:C.navyLight,fontFamily:"inherit",resize:"vertical",minHeight:60,color:C.white}}/>
        </div>
      ))}
    </div>
    <div style={{background:C.amber,borderRadius:12,padding:16,textAlign:"center"}}>
      <div style={{fontWeight:800,fontSize:14,color:C.navy,marginBottom:8}}>Quer atualizar seu PDI completo?</div>
      <button onClick={()=>window.location.href=window.location.pathname} style={{padding:"10px 24px",background:C.navy,color:C.white,border:"none",borderRadius:10,fontWeight:800,fontSize:13,cursor:"pointer"}}>Ir para o PDI →</button>
    </div>
  </div>;
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────

// ── APP PRINCIPAL ────────────────────────────────────────────────
function TelaEncerrado(){
  return <div style={{minHeight:"100dvh",background:`linear-gradient(160deg,${C.navy} 0%,${C.navyLight} 100%)`,display:"flex",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',sans-serif"}}>
    <div style={{textAlign:"center",maxWidth:340}}>
      <div style={{width:60,height:60,borderRadius:"50%",background:`${C.amber}1F`,border:`2px solid ${C.amber}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:28}}>🔒</div>
      <div style={{fontWeight:800,fontSize:22,color:C.white,marginBottom:10}}>Treinamento encerrado</div>
      <div style={{fontSize:13,color:C.slateDeep,lineHeight:1.65,marginBottom:18}}>
        O preenchimento do PDI ficou disponível apenas durante o treinamento e já foi encerrado.
      </div>
      <div style={{fontSize:12,color:C.slateDeep,lineHeight:1.6,background:C.navyMid,borderRadius:12,padding:"12px 14px"}}>
        Se você baixou seu PowerPoint, ele continua salvo no seu dispositivo. 💛
      </div>
      <div style={{fontSize:11,color:C.amber,fontWeight:700,letterSpacing:1.6,textTransform:"uppercase",marginTop:20}}>PDI na Prática</div>
    </div>
  </div>;
}

export default function App(){
  const qs=typeof window!=="undefined"?window.location.search:"";
  if(qs.includes("revisao=1"))return <TelaRevisao/>;
  // ?admin=1 sempre ignora o encerramento — use esse link pra continuar
  // acessando o app mesmo depois de travar o acesso dos participantes.
  const acessoAdmin = qs.includes("admin=1");
  if(!acessoAdmin && ACESSO_ATE && new Date() > new Date(`${ACESSO_ATE}T23:59:59`)) return <TelaEncerrado/>;

  const[etapa,setEtapa]=useState(()=>{
    if(acessoAdmin) return 1;
    const r=lerRascunho();return typeof r?.etapa==="number"?r.etapa:0;
  });
  const[dados,setDados]=useState(()=>{
    const r=lerRascunho();
    if(r?.dados&&r.dados._sid)return {...INICIAL,...r.dados};
    return {...INICIAL,
      _sid:(typeof crypto!=="undefined"&&crypto.randomUUID)?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,
      _inicio:Date.now(),
    };
  });
  const[showMsg,setShowMsg]=useState(false);
  const[proxEtapa,setProxEtapa]=useState(0);
  const[restaurado]=useState(()=>{const r=lerRascunho();return !!(r?.dados&&r.dados._sid&&r.etapa>0);});
  const[avisoRestaurado,setAvisoRestaurado]=useState(restaurado);
  const[etapaLiberada,setEtapaLiberada]=useState(0); // 0 = sem bloqueio ativo
  const[avisoBloqueio,setAvisoBloqueio]=useState(false);

  // Guarda o rascunho no próprio aparelho, para não perder em recarregamento acidental
  useEffect(()=>{ if(etapa>0) salvarRascunho(etapa,dados); },[etapa,dados]);

  // Consulta o controle da facilitadora (se ela estiver usando o ritmo guiado nesta turma)
  useEffect(()=>{
    let ativo=true;
    async function checar(){
      const v=await dbBuscarControle();
      if(ativo) setEtapaLiberada(v);
    }
    checar();
    const t=setInterval(checar,8000);
    return ()=>{ativo=false;clearInterval(t);};
  },[]);

  // Avisa antes de recarregar/fechar, para não perder o preenchimento sem querer
  useEffect(()=>{
    const comecou = etapa>0 && etapa<14;
    if(!comecou) return;
    const aviso=e=>{e.preventDefault();e.returnValue="";};
    window.addEventListener("beforeunload",aviso);
    return ()=>window.removeEventListener("beforeunload",aviso);
  },[etapa]);

  function ir(p){
    // Ritmo guiado: se a facilitadora travou o avanço, impede pular além do liberado
    if(etapaLiberada>0 && p>etapaLiberada){
      setAvisoBloqueio(true);
      setTimeout(()=>setAvisoBloqueio(false), 4000);
      return;
    }
    try{ dbSalvar(dados,calcPontos(dados)); }catch(e){}
    if(p>2&&p%3===0&&p<telas.length-1){setProxEtapa(p);setShowMsg(true);}
    else setEtapa(p);
  }
  function prev(){setEtapa(e=>Math.max(e-1,0));}

  function sairEReiniciar(){
    if(!confirm("Isso apaga as respostas preenchidas neste aparelho e volta para a tela de privacidade, pronta para a próxima pessoa.\n\nSe ainda não baixou o PowerPoint, as respostas serão perdidas. Confirma que quer sair?"))return;
    limparRascunho();
    setDados({...INICIAL,
      _sid:(typeof crypto!=="undefined"&&crypto.randomUUID)?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`,
      _inicio:Date.now(),
    });
    setAvisoRestaurado(false);
    setEtapa(1);
  }

  if(showMsg)return <MsgMotivacional etapa={proxEtapa} onContinuar={()=>{setShowMsg(false);setEtapa(proxEtapa);}}/>;

  const telas=[
    <TelaSenha next={()=>setEtapa(1)}/>,
    <TelaLGPD next={()=>ir(2)}/>,
    <TelaInicio d={dados} set={setDados} next={()=>ir(3)} prev={()=>setEtapa(1)}/>,
    <TelaSobre d={dados} set={setDados} next={()=>ir(4)} prev={()=>setEtapa(2)}/>,
    <TelaConquistas d={dados} set={setDados} next={()=>ir(5)} prev={()=>setEtapa(3)}/>,
    <TelaJornada d={dados} set={setDados} next={()=>ir(6)} prev={()=>setEtapa(4)}/>,
    <TelaObjetivos d={dados} set={setDados} next={()=>ir(7)} prev={()=>setEtapa(5)}/>,
    <TelaSwot d={dados} set={setDados} next={()=>ir(8)} prev={()=>setEtapa(6)}/>,
    <TelaHabilidades d={dados} set={setDados} next={()=>ir(9)} prev={()=>setEtapa(7)}/>,
    <TelaRoda d={dados} set={setDados} next={()=>ir(10)} prev={()=>setEtapa(8)}/>,
    <TelaSabotador d={dados} set={setDados} next={()=>ir(11)} prev={()=>setEtapa(9)}/>,
    <TelaSabResult d={dados} set={setDados} next={()=>ir(12)} prev={()=>setEtapa(10)}/>,
    <TelaPlano d={dados} set={setDados} next={()=>ir(13)} prev={()=>setEtapa(11)}/>,
    <TelaCompromisso d={dados} set={setDados} next={()=>ir(14)} prev={()=>setEtapa(12)}/>,
    <TelaConclusao d={dados} set={setDados}/>,
  ];

  const pct=Math.round((etapa/(telas.length-1))*100);
  const etapaInfo=ETAPAS[etapa]||ETAPAS[ETAPAS.length-1];

  return <div style={{fontFamily:"'Inter','Segoe UI',sans-serif",background:C.slate,minHeight:"100dvh",color:C.text}}>
    <style>{`html,body{overscroll-behavior-y:none;background:${C.slate}}*{box-sizing:border-box}input,textarea{font-family:inherit}input[type=range]{-webkit-appearance:none;height:6px;border-radius:99px;outline:none;background:${C.slateDeep}}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:${C.amber};cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.25)}`}</style>

    {etapa>0&&avisoRestaurado&&<div style={{background:C.green,color:C.white,padding:"9px 16px",fontSize:11.5,fontWeight:700,textAlign:"center",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
      <span>✅ Continuando de onde você parou — nada foi perdido.</span>
      <span onClick={()=>setAvisoRestaurado(false)} style={{cursor:"pointer",opacity:.85,flexShrink:0}}>✕</span>
    </div>}

    {etapa>0&&avisoBloqueio&&<div style={{background:C.red,color:C.white,padding:"9px 16px",fontSize:11.5,fontWeight:700,textAlign:"center"}}>
      ⏳ Aguarde a facilitadora liberar a próxima etapa.
    </div>}

    {etapa>0&&<>
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,padding:"12px 16px",color:C.white}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div>
            <div style={{fontSize:8,color:C.slateDeep,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>PDI na Prática</div>
            <div style={{fontSize:15,fontWeight:800,marginTop:1}}>{dados.nome||"Meu PDI"}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{background:C.amber,color:C.navy,fontWeight:800,fontSize:10,padding:"3px 10px",borderRadius:99}}>{etapa+1}/{telas.length}</div>
            <div onClick={sairEReiniciar} title="Sair e voltar ao início" style={{fontSize:11,color:C.slateDeep,cursor:"pointer",padding:"3px 6px",display:"flex",alignItems:"center",gap:3}}>🚪 Sair</div>
          </div>
        </div>
        <PBar value={pct} max={100} cor={C.amber} h={4}/>
        <div style={{fontSize:10,color:C.amber,fontWeight:700,marginTop:4}}>{etapaInfo.icon} {etapaInfo.titulo}</div>
      </div>
      <div style={{background:C.navyMid,padding:"6px 14px",display:"flex",gap:4,overflowX:"auto"}}>
        {ETAPAS.slice(1).map((e,i)=>{
          const jaVisitou = i+1<etapa;
          const futura = i+1>etapa;
          const travada = etapaLiberada>0 && (i+1)>etapaLiberada;
          return <div key={e.id} title={travada?`Ainda travado: ${e.titulo}`:jaVisitou?`Revisar: ${e.titulo}`:futura?`Ir para: ${e.titulo}`:e.titulo}
            onClick={()=>ir(i+1)}
            style={{fontSize:13,padding:"4px 7px",borderRadius:8,flexShrink:0,cursor:"pointer",position:"relative",
            background:i+1===etapa?C.amber:jaVisitou?`${C.green}55`:"transparent",
            border:`1px solid ${i+1===etapa?C.amber:jaVisitou?`${C.green}88`:C.navyLight}`,
            opacity:travada?.4:futura?.65:1}}>
            {travada?"🔒":e.icon}
          </div>;
        })}
      </div>
      <div style={{fontSize:9.5,color:C.slateDeep,textAlign:"center",padding:"3px 14px 0",background:C.navyMid}}>
        {etapaLiberada>0?`💡 a facilitadora libera as próximas etapas ao vivo`:`💡 toque em qualquer ícone pra ir direto pra aquela etapa`}
      </div>
    </>}

    <div style={{padding:etapa===0?0:14}}>{telas[etapa]}</div>
  </div>;
}
