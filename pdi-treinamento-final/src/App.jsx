import { useState } from "react";

// ── CONFIG ────────────────────────────────────────────────────────
const SUPABASE_URL = "https://odcmxytazbtwbdjqbosc.supabase.co";
const SUPABASE_KEY = "sb_publishable_HbzbOANXyabiwQ7bEjJB3w_X3CxAYkH";
const IANA_MAX = 2;

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
};

// ── PRONOMES ──────────────────────────────────────────────────────
function getPronomes(genero) {
  if (genero === "Feminino") return { ele: "ela", seu: "sua", dele: "dela", mesmo: "mesma", pron: "ela" };
  if (genero === "Masculino") return { ele: "ele", seu: "seu", dele: "dele", mesmo: "mesmo", pron: "ele" };
  return { ele: "", seu: "seu/sua", dele: "de", mesmo: "mesmo(a)", pron: "" };
}

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
  { id:"sabotador", icon:"🛡️", titulo:"Sabotador" },
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
  nome:"", cargo:"", genero:"", data:"", vontade:7,
  intencao:"", energia:{corpo:3,mente:3,emocao:3},
  sobreMim:{ frase:"", inspiracoes:[] },
  conquistas:{ c1:"", c2:"", c3:"" },
  jornada:{ formacoes:"", marcos:[{ano:"",titulo:""}] },
  objetivos:{ legado:"", cargoShort:"", cargoShortText:"", cargoMid:"", cargoMidText:"", cargoLong:"", cargoLongText:"" },
  swot:{ forcas:[], forcasOutros:"", fraquezas:[], fraquezasOutros:"", oportunidades:[], oportunidadesOutros:"", ameacas:[], ameacasOutros:"" },
  habilidades:{},
  rodaVida: AREAS_RODA.reduce((a,r)=>({...a,[r]:5}),{}),
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
function PBar({value,max,cor,h=6}){
  return <div style={{background:C.slateDeep,borderRadius:99,height:h,overflow:"hidden"}}>
    <div style={{width:`${Math.min(100,Math.round(value/max*100))}%`,height:"100%",background:cor||C.amber,borderRadius:99,transition:"width .4s"}}/>
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

// ── SUPABASE RANKING ────────────────────────────────────────────
const RH_SENHA = "pdi2026rh";

async function dbSalvar(d, pts) {
  if (!SUPABASE_URL.includes("supabase")) return false;
  const gaps = HABILIDADES.flatMap(b=>b.itens)
    .filter(it=>(d.habilidades[it.id]||0)<=2).map(it=>it.nome).slice(0,3).join(",");
  const areas = Object.entries(d.rodaVida)
    .filter(([,v])=>v.nota<=4).map(([k])=>k).join(",");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/pdi_ranking`,{
    method:"POST",
    headers:{"Content-Type":"application/json","apikey":SUPABASE_KEY,
      "Authorization":`Bearer ${SUPABASE_KEY}`,"Prefer":"resolution=merge-duplicates"},
    body:JSON.stringify({
      pontos_total:pts.total, pontos_completude:pts.completude,
      pontos_qualidade:pts.qualidade, pontos_vontade:pts.vontade,
      nivel_vontade:d.vontade, energia_corpo:d.energia.corpo,
      energia_mente:d.energia.mente, energia_emocao:d.energia.emocao,
      sabotador:d.autossabotagem.sabotadorEscolhido||"",
      cargo_pretendido:d.objetivos.cargoPretendido||"",
      alinhado_carreira:d.alinhamentoCarreira||null,
      dificuldade_principal:d.dificuldadePrincipal||"",
      apoia_desenvolvimento:d.apoioEmpresa||null,
      gaps_habilidades:gaps, areas_baixas_roda:areas,
      atualizado_em:new Date().toISOString(),
    })
  });
  return res.ok;
}
async function dbRanking() {
  if (!SUPABASE_URL.includes("supabase")) return [];
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/pdi_ranking?select=*&order=pontos_total.desc&limit=50`,
    {headers:{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${SUPABASE_KEY}`}}
  );
  return res.ok ? res.json() : [];
}

// ── PONTUAÇÃO ────────────────────────────────────────────────────
function calcPontos(d){
  let c=0,q=0;
  const add=(v,n)=>{if(v)c+=n;};
  add(d.nome,10);add(d.intencao,15);add(d.sobreMim.frase,15);
  add(d.sobreMim.superpoder,15);add(d.sobreMim.pontoTreino,15);add(d.sobreMim.inspira,10);
  add(d.conquistas.c1,15);add(d.conquistas.c2,15);add(d.conquistas.c3,15);
  add(d.jornada.formacoes,15);add(d.jornada.aprendizado,15);
  add(d.objetivos.vida,20);add(d.objetivos.legado,20);
  if(d.swot.forcas&&d.swot.fraquezas&&d.swot.oportunidades&&d.swot.ameacas)c+=30;
  c+=Math.min(Object.values(d.habilidades).filter(v=>v>0).length*2,20);
  c+=Object.values(d.rodaVida).filter(r=>r.melhorar?.length>2).length*3;
  add(d.dificuldadePrincipal,10);
  c+=Math.min(d.planoAcao.pessoal.filter(a=>a.oq).length*8,24);
  c+=Math.min(d.planoAcao.profissional.filter(a=>a.oq).length*8,24);
  add(d.autossabotagem.sabotadorEscolhido,15);add(d.autossabotagem.meta,15);
  add(d.medidaSucesso.p1,10);add(d.fraseF?.length>10,15);
  c=Math.min(c,300);
  [d.intencao,d.sobreMim.frase,d.sobreMim.superpoder,d.sobreMim.pontoTreino,
   d.conquistas.c1,d.conquistas.c2,d.conquistas.c3,d.jornada.formacoes,
   d.jornada.aprendizado,d.objetivos.vida,d.objetivos.legado,
   d.swot.forcas,d.swot.fraquezas,d.autossabotagem.naoAtrapalhar,
   d.medidaSucesso.p1,d.medidaSucesso.p2,d.medidaSucesso.p3,
  ].forEach(t=>{if(!t)return;if(t.length>150)q+=18;else if(t.length>80)q+=10;else if(t.length>30)q+=5;});
  q=Math.min(q,300);
  const v=Math.round(d.vontade*10);
  return{total:c+q+v,completude:c,qualidade:q,vontade:v};
}

// ── UI HELPERS ────────────────────────────────────────────────────
function PBar({value,max,cor,h=6}){
  const p=max>0?Math.min(100,Math.round(value/max*100)):0;
  return <div style={{background:C.slateDeep,borderRadius:99,height:h,overflow:"hidden"}}>
    <div style={{width:`${p}%`,height:"100%",background:cor||C.amber,borderRadius:99,transition:"width .4s"}}/>
  </div>;
}

// ── TELA LGPD ─────────────────────────────────────────────────────
function TelaLGPD({next}){
  const [ok,setOk]=useState(false);
  return <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,padding:24,fontFamily:"'Inter',sans-serif"}}>
    <div style={{textAlign:"center",paddingTop:16,marginBottom:22}}>
      <div style={{fontSize:44,marginBottom:10}}>🔒</div>
      <div style={{fontWeight:800,fontSize:20,color:C.white,marginBottom:6}}>Privacidade & LGPD</div>
      <div style={{fontSize:12,color:C.slateDeep}}>Como seus dados são tratados</div>
    </div>
    <div style={{background:C.navyMid,borderRadius:14,padding:18,marginBottom:14}}>
      {[["🚫","Seus dados pessoais NÃO são armazenados em servidores"],
        ["📱","O PowerPoint fica salvo SOMENTE no seu dispositivo"],
        ["📊","Apenas estatísticas anônimas são coletadas"],
        ["✋","Você pode encerrar a qualquer momento"],
      ].map(([ic,t],i)=>(
        <div key={i} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
          <span style={{fontSize:16,flexShrink:0}}>{ic}</span>
          <span style={{fontSize:12,color:C.slateDeep,lineHeight:1.5}}>{t}</span>
        </div>
      ))}
    </div>
    <div onClick={()=>setOk(!ok)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",background:ok?`${C.green}22`:C.navyMid,borderRadius:12,cursor:"pointer",border:`2px solid ${ok?C.green:C.navyLight}`,marginBottom:14}}>
      <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${ok?C.green:C.slateDeep}`,background:ok?C.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        {ok&&<span style={{color:C.white,fontSize:13,fontWeight:800}}>✓</span>}
      </div>
      <span style={{fontSize:12,color:ok?C.green:C.slateDeep,fontWeight:ok?700:400}}>Li e concordo com os termos de privacidade</span>
    </div>
    <button onClick={next} disabled={!ok} style={{width:"100%",padding:14,background:ok?C.amber:C.navyMid,color:ok?C.navy:C.slateDeep,border:"none",borderRadius:12,fontWeight:800,fontSize:14,cursor:ok?"pointer":"default"}}>
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
      <Campo label="Nome completo *" value={d.nome} onChange={v=>set({...d,nome:v})} placeholder="Como você se chama?"/>
      <Campo label="Cargo / Área" value={d.cargo} onChange={v=>set({...d,cargo:v})} placeholder="Ex: Analista Financeiro"/>
      <div style={{marginBottom:10}}>
        <div style={{fontSize:10,fontWeight:700,color:C.textMid,marginBottom:6,textTransform:"uppercase",letterSpacing:.8}}>Gênero</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {["Feminino","Masculino","Outro","Prefiro não informar"].map(g=>(
            <button key={g} onClick={()=>set({...d,genero:g})} style={{padding:"8px 14px",borderRadius:99,border:`2px solid ${d.genero===g?C.amber:C.slateDeep}`,background:d.genero===g?C.navy:C.white,color:d.genero===g?C.amber:C.textMid,fontWeight:d.genero===g?700:400,fontSize:12,cursor:"pointer"}}>
              {d.genero===g?"✓ ":""}{g}
            </button>
          ))}
        </div>
      </div>
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
  const genero=d.genero;
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>🏆</div>
      <div style={{fontWeight:800,fontSize:16}}>Minhas Conquistas</div>
      <div style={{color:C.slateDeep,fontSize:11,marginTop:4,lineHeight:1.5}}>
        Antes de olhar para o futuro, celebre o que {genero==="Feminino"?"ela construiu":"genero==='Masculino'?'ele construiu':'você construiu'"}! 💛
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
function TelaJornada({d,set,next,prev}){
  const j=d.jornada;const upd=obj=>set({...d,jornada:{...j,...obj}});
  const addM=()=>set({...d,jornada:{...j,marcos:[...j.marcos,{ano:"",titulo:""}]}});
  const updM=(i,obj)=>{const m=[...j.marcos];m[i]={...m[i],...obj};set({...d,jornada:{...j,marcos:m}});};
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>🗺️</div>
      <div style={{fontWeight:800,fontSize:16}}>Minha Jornada</div>
    </Card>
    <Card>
      <Campo label="Formações (cursos, graduações, certificações)" value={j.formacoes} onChange={v=>upd({formacoes:v})} placeholder="Ex: Graduação em Administração — FGV (2018)" multi/>
    </Card>
    <Card>
      <Titulo>📍 Marcos Profissionais</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:10}}>Os momentos que definiram sua trajetória.</div>
      {j.marcos.map((m,i)=>(
        <div key={i} style={{display:"grid",gridTemplateColumns:"80px 1fr",gap:8,marginBottom:8,background:C.slate,borderRadius:10,padding:10}}>
          <input value={m.ano} onChange={e=>updM(i,{ano:e.target.value})} placeholder="Ano" style={{padding:"7px 9px",border:`1.5px solid ${C.slateDeep}`,borderRadius:8,fontSize:12,outline:"none",background:C.white,fontFamily:"inherit"}}/>
          <input value={m.titulo} onChange={e=>updM(i,{titulo:e.target.value})} placeholder="O que aconteceu?" style={{padding:"7px 9px",border:`1.5px solid ${C.slateDeep}`,borderRadius:8,fontSize:12,outline:"none",background:C.white,fontFamily:"inherit"}}/>
        </div>
      ))}
      {j.marcos.length<4&&<button onClick={addM} style={{width:"100%",padding:8,background:`${C.teal}15`,color:C.teal,border:`1.5px solid ${C.teal}44`,borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Adicionar marco</button>}
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
  const pr=getPronomes(d.genero);
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
        Uma ação pequena e específica que {pr.ele||"você"} vai fazer <strong>essa semana</strong>.
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
  const pr=getPronomes(d.genero);
  return <div>
    <Card style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,color:C.white}}>
      <div style={{fontSize:26,marginBottom:4}}>📅</div>
      <div style={{fontWeight:800,fontSize:16}}>Compromisso & Medida de Sucesso</div>
    </Card>
    <Card style={{borderLeft:`4px solid ${C.teal}`}}>
      <Titulo cor={C.teal}>📅 Apresentar para</Titulo>
      <Campo label="Gestor, mentor ou para si mesmo(a)" value={d.gestor} onChange={v=>set({...d,gestor:v})} placeholder="Nome de quem vai receber seu PDI"/>
      <Campo label="Data da apresentação" value={d.gestorData} onChange={v=>set({...d,gestorData:v})} type="date"/>
    </Card>
    <Card style={{borderLeft:`4px solid ${C.amber}`}}>
      <Titulo>🎯 O que precisa acontecer em 90 dias?</Titulo>
      <div style={{background:C.navy,borderRadius:10,padding:12,marginBottom:12,fontSize:12,color:C.amber,fontStyle:"italic",lineHeight:1.6}}>
        "O que precisa acontecer nos próximos 90 dias para {pr.ele||"você"} dizer que esse PDI valeu a pena?"
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
  const [iaLoad,setIaLoad]=useState(false);
  const [iaText,setIaText]=useState("");
  const ianaUsos=parseInt(localStorage.getItem("iana_usos_hotmart")||"0");
  const pr=getPronomes(d.genero);

  async function gerarIANA(){
    if(ianaUsos>=IANA_MAX)return;
    setIaLoad(true);
    try{
      const gaps=HABILIDADES.filter(h=>(d.habilidades[h.id]||0)<=2).map(h=>h.nome).slice(0,3).join(",")||"nenhum";
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:600,messages:[{role:"user",content:
          `Você é a IANA — mentora de PDI. Analise o PDI em português.
Dados: Nome: ${d.nome} | Gênero: ${d.genero} | Vontade ${d.vontade}/10 | Sabotador: ${d.sabotadorPrincipal||"não identificado"} | Gaps: ${gaps} | Legado: ${d.objetivos.legado||"não preenchido"}
Use o pronome correto: ${d.genero==="Feminino"?"ela/dela/sua":d.genero==="Masculino"?"ele/dele/seu":"a pessoa"}.
Escreva 3 parágrafos: 1)reconhecimento do PDI 2)recomendação principal baseada no sabotador e gaps 3)encorajamento. Máx 120 palavras. Tom humano, caloroso e direto.`
        }]})});
      const data=await r.json();
      setIaText(data.content?.[0]?.text||"");
      localStorage.setItem("iana_usos_hotmart",String(ianaUsos+1));
    }catch(e){console.error(e);}
    setIaLoad(false);
  }

  async function baixar(){
    setDlLoad(true);setDlMsg("");
    // Salvar no ranking ao baixar o PPTX
    try{ const pts=calcPontos(d); await dbSalvar(d,pts); }catch(e){};
    try{
      if(!window.PptxGenJS){await new Promise((res,rej)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/pptxgenjs@3.12.0/dist/pptxgen.bundle.js";s.onload=res;s.onerror=rej;document.head.appendChild(s);});}
      const prs=new window.PptxGenJS();prs.layout="LAYOUT_16x9";
      const N="0F1D3A",NM="1A3160",NL="234080",AM="F5A623",WH="FFFFFF",SL="EEF2FA",SD="C5D0E6";
      const GR="1DB87A",TL="0891B2",PU="7C3AED",OR="EA580C",RE="E05252",PI="EC4899";
      const hoje=d.data?new Date(d.data+"T12:00:00").toLocaleDateString("pt-BR"):new Date().toLocaleDateString("pt-BR");
      const pr2=getPronomes(d.genero);
      const mesmo=`mesmo${d.genero==="Feminino"?"a":d.genero==="Masculino"?"":"(a)"}`;

      // ── S1 CAPA ───────────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:7.5,fill:{color:N},line:{color:N}});
      sl.addText("PLANO DE DESENVOLVIMENTO INDIVIDUAL",{x:.55,y:.6,w:8,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("PDI",{x:.5,y:.9,w:7,h:2.6,fontSize:110,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.RECTANGLE,{x:.5,y:4.6,w:9,h:.04,fill:{color:AM},line:{color:AM}});
      sl.addText(d.nome||"[Nome]",{x:.55,y:4.7,w:8.8,h:.65,fontSize:26,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addText(d.cargo||"",{x:.55,y:5.38,w:8.8,h:.38,fontSize:14,color:SD,fontFace:"Calibri",margin:0});
      sl.addText(hoje,{x:.55,y:.3,w:8,h:.26,fontSize:9,color:"607090",fontFace:"Calibri",margin:0});
      // Vontade badge
      sl.addShape(prs.shapes.OVAL,{x:8.4,y:5.6,w:1.5,h:1.5,fill:{color:AM},line:{color:AM}});
      sl.addText(`${d.vontade}/10`,{x:8.4,y:5.6,w:1.5,h:1.5,fontSize:16,bold:true,color:N,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      sl.addText("vontade",{x:8.3,y:7.1,w:1.7,h:.3,fontSize:8,color:SD,align:"center",fontFace:"Calibri",margin:0});}

      // ── S2 PONTO DE PARTIDA (oculto) ─────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.15,fill:{color:NM},line:{color:NM}});
      sl.addText("PONTO DE PARTIDA",{x:.6,y:.08,w:8,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Intenção & Como estou chegando hoje",{x:.6,y:.4,w:8,h:.6,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.25,w:6.0,h:2.2,fill:{color:NL},rectRadius:.1});
      sl.addText("🎯  MINHA INTENÇÃO",{x:.6,y:1.38,w:5.6,h:.3,fontSize:10,bold:true,color:AM,fontFace:"Calibri",margin:0});
      sl.addText(d.intencao||"–",{x:.6,y:1.75,w:5.6,h:1.6,fontSize:14,color:WH,fontFace:"Calibri",italic:true,valign:"top",margin:4});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:6.6,y:1.25,w:3.0,h:2.2,fill:{color:NL},rectRadius:.1});
      sl.addText("🌡️  COMO ESTOU",{x:6.75,y:1.38,w:2.7,h:.3,fontSize:10,bold:true,color:AM,fontFace:"Calibri",margin:0});
      [{k:"corpo",l:"💪 Corpo"},{k:"mente",l:"🧠 Mente"},{k:"emocao",l:"❤️ Emoção"}].forEach((dim,i)=>{
        const y=1.78+i*.5;
        sl.addText(`${dim.l}  ${d.energia[dim.k]}/5`,{x:6.75,y,w:2.7,h:.32,fontSize:11,color:WH,fontFace:"Calibri",margin:0,valign:"middle"});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:6.75,y:y+.24,w:2.7,h:.1,fill:{color:SD},rectRadius:.03});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:6.75,y:y+.24,w:Math.max(2.7*(d.energia[dim.k]/5),.05),h:.1,fill:{color:AM},rectRadius:.03});});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:3.6,w:9.2,h:1.15,fill:{color:AM},rectRadius:.1});
      sl.addText("🔥  Nível de Vontade",{x:.7,y:3.7,w:7,h:.35,fontSize:13,bold:true,color:N,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.OVAL,{x:8.0,y:3.52,w:1.4,h:1.2,fill:{color:N},line:{color:N}});
      sl.addText(`${d.vontade}`,{x:8.0,y:3.52,w:1.4,h:1.2,fontSize:36,bold:true,color:AM,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      sl.addText("🔒  Uso pessoal · para sua autoavaliação (não apresentar)",{x:.4,y:4.95,w:9.2,h:.35,fontSize:9,color:"607090",italic:true,fontFace:"Calibri",margin:0});}

      // ── S3 SOBRE MIM ─────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.5,fill:{color:N},line:{color:N}});
      sl.addText("SOBRE MIM",{x:.6,y:.1,w:8,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText(d.nome||"[Nome]",{x:.6,y:.42,w:8,h:.85,fontSize:28,bold:true,color:WH,fontFace:"Calibri",margin:0});
      if(d.sobreMim.frase){sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.62,w:9.2,h:.88,fill:{color:N},rectRadius:.1});sl.addText(`❝  ${d.sobreMim.frase}  ❞`,{x:.4,y:1.62,w:9.2,h:.88,fontSize:13,color:AM,italic:true,align:"center",valign:"middle",fontFace:"Calibri",margin:12});}
      // Foto placeholder
      sl.addText("📷  Quem eu sou além do trabalho",{x:.4,y:2.65,w:5.2,h:.32,fontSize:11,bold:true,color:"4A5A7A",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:3.02,w:3.4,h:3.25,fill:{color:"C5D0E6"},rectRadius:.15});
      sl.addText("📷\nAdicione sua\nfoto principal",{x:.4,y:3.02,w:3.4,h:3.25,fontSize:13,color:"607090",align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:3.95,y:3.02,w:1.55,h:1.55,fill:{color:"D5DFF0"},rectRadius:.1});
      sl.addText("🌟\nUm momento\nmarcante",{x:3.95,y:3.02,w:1.55,h:1.55,fontSize:9,color:"607090",align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:3.95,y:4.72,w:1.55,h:1.55,fill:{color:"D5DFF0"},rectRadius:.1});
      sl.addText("❤️\nO que eu amo",{x:3.95,y:4.72,w:1.55,h:1.55,fontSize:9,color:"607090",align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      // Inspirações
      sl.addText("✨  O que me inspira",{x:5.7,y:2.65,w:3.9,h:.32,fontSize:11,bold:true,color:"4A5A7A",fontFace:"Calibri",margin:0});
      const insp=d.sobreMim.inspiracoes.length>0?d.sobreMim.inspiracoes:["Família","Propósito","Crescimento"];
      const inspCores=[GR,TL,PU,AM,OR,RE,PI,"028090"];
      insp.slice(0,5).forEach((item,i)=>{
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:5.7,y:3.05+i*.62,w:3.9,h:.54,fill:{color:inspCores[i]||GR},rectRadius:.1});
        sl.addText(item,{x:5.7,y:3.05+i*.62,w:3.9,h:.54,fontSize:14,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});});}

      // ── S4 CONQUISTAS ─────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.3,fill:{color:N},line:{color:N}});
      sl.addText("MINHAS CONQUISTAS",{x:.6,y:.1,w:8,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("O que já construí que me orgulha",{x:.6,y:.42,w:8,h:.7,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      const cores3=[GR,TL,PU];
      [{n:1,v:d.conquistas.c1||"[Conquista 1]"},{n:2,v:d.conquistas.c2||"[Conquista 2]"},{n:3,v:d.conquistas.c3||"[Conquista 3]"}].forEach((c,i)=>{
        const y=1.45+i*1.7;const cor=cores3[i];
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y,w:9.2,h:1.52,fill:{color:WH},rectRadius:.12});
        sl.addShape(prs.shapes.OVAL,{x:.58,y:y+.38,w:.76,h:.76,fill:{color:cor},line:{color:cor}});
        sl.addText(`${c.n}`,{x:.58,y:y+.38,w:.76,h:.76,fontSize:20,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(c.v,{x:1.5,y:y+.12,w:7.9,h:1.28,fontSize:14,color:N,fontFace:"Calibri",valign:"middle",margin:6});});}

      // ── S5 JORNADA ────────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.3,fill:{color:N},line:{color:N}});
      sl.addText("MINHA JORNADA",{x:.6,y:.1,w:8,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Formações & Marcos Profissionais",{x:.6,y:.42,w:8,h:.7,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      // Formações
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.4,w:4.55,h:5.55,fill:{color:NM},rectRadius:.12});
      sl.addText("📚  Formações",{x:.65,y:1.55,w:4.1,h:.4,fontSize:13,bold:true,color:AM,fontFace:"Calibri",margin:0});
      sl.addText(d.jornada.formacoes||"[Suas formações]",{x:.65,y:2.02,w:4.1,h:4.75,fontSize:13,color:WH,fontFace:"Calibri",valign:"top",margin:4});
      // Marcos
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:5.15,y:1.4,w:4.45,h:5.55,fill:{color:NM},rectRadius:.12});
      sl.addText("📍  Marcos Profissionais",{x:5.35,y:1.55,w:4.1,h:.4,fontSize:13,bold:true,color:AM,fontFace:"Calibri",margin:0});
      const marcos=d.jornada.marcos.filter(m=>m.ano||m.titulo).slice(0,4);
      marcos.forEach((m,i)=>{
        const y=2.05+i*1.1;
        sl.addShape(prs.shapes.OVAL,{x:5.35,y:y+.05,w:.72,h:.72,fill:{color:AM},line:{color:AM}});
        sl.addText(m.ano||"",{x:5.35,y:y+.05,w:.72,h:.72,fontSize:10,bold:true,color:N,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(m.titulo||"",{x:6.2,y:y+.12,w:3.25,h:.52,fontSize:12,color:WH,fontFace:"Calibri",valign:"middle",margin:2});
        if(i<marcos.length-1)sl.addShape(prs.shapes.RECTANGLE,{x:5.67,y:y+.8,w:.08,h:.35,fill:{color:AM},line:{color:AM}});});}

      // ── S6 OBJETIVOS ──────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.3,fill:{color:N},line:{color:N}});
      sl.addText("MEUS OBJETIVOS",{x:.6,y:.1,w:8,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Legado & Onde Quero Chegar",{x:.6,y:.42,w:8,h:.7,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.42,w:9.2,h:1.12,fill:{color:NM},rectRadius:.1});
      sl.addText("🌟",{x:.55,y:1.55,w:.7,h:.78,fontSize:22,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(d.objetivos.legado||"[Seu legado]",{x:1.25,y:1.5,w:8.2,h:1.0,fontSize:13,color:WH,fontFace:"Calibri",italic:true,valign:"middle",margin:6});
      const objPrazos=[
        {prazo:"Curto",sub:"2-3 anos",cargo:d.objetivos.cargoShort,txt:d.objetivos.cargoShortText,cor:TL},
        {prazo:"Médio",sub:"3-5 anos",cargo:d.objetivos.cargoMid,txt:d.objetivos.cargoMidText,cor:PU},
        {prazo:"Longo",sub:"5-10 anos",cargo:d.objetivos.cargoLong,txt:d.objetivos.cargoLongText,cor:OR},
      ];
      objPrazos.forEach((o,i)=>{
        const x=.4+i*3.2;
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x,y:2.68,w:3.05,h:4.05,fill:{color:o.cor},rectRadius:.12});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x,y:2.68,w:3.05,h:.55,fill:{color:o.cor},rectRadius:.12});
        sl.addText(`${o.prazo}`,{x,y:2.68,w:3.05,h:.55,fontSize:14,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(o.sub,{x,y:3.25,w:3.05,h:.35,fontSize:10,color:WH,align:"center",italic:true,fontFace:"Calibri",margin:0});
        sl.addText(o.cargo||"[cargo/objetivo]",{x:x+.12,y:3.65,w:2.82,h:.55,fontSize:15,bold:true,color:WH,align:"center",fontFace:"Calibri",margin:0});
        sl.addText(o.txt||"[descrição]",{x:x+.12,y:4.3,w:2.82,h:2.3,fontSize:12,color:WH,align:"center",valign:"top",fontFace:"Calibri",italic:true,margin:6});});}

      // ── S7 SWOT + HABILIDADES ─────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.1,fill:{color:N},line:{color:N}});
      sl.addText("AUTOCONHECIMENTO PROFISSIONAL",{x:.6,y:.08,w:9,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("SWOT & Habilidades do Futuro",{x:.6,y:.38,w:9,h:.55,fontSize:20,bold:true,color:WH,fontFace:"Calibri",margin:0});
      // SWOT 2x2
      const swotItems=[
        {l:"💪 FORÇAS",cor:GR,itens:[...d.swot.forcas,d.swot.forcasOutros].filter(Boolean)},
        {l:"🎯 OPORTUNIDADES",cor:TL,itens:[...d.swot.oportunidades,d.swot.oportunidadesOutros].filter(Boolean)},
        {l:"⚠️ PONTOS DE DESENVOLVIMENTO",cor:RE,itens:[...d.swot.fraquezas,d.swot.fraquezasOutros].filter(Boolean)},
        {l:"🔴 AMEAÇAS",cor:OR,itens:[...d.swot.ameacas,d.swot.ameacasOutros].filter(Boolean)},
      ];
      swotItems.forEach((q,i)=>{
        const col=i%2,row=Math.floor(i/2),x=.35+col*2.88,y=1.22+row*2.7;
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x,y,w:2.72,h:2.55,fill:{color:WH},rectRadius:.1});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x,y,w:2.72,h:.42,fill:{color:q.cor},rectRadius:.1});
        sl.addText(q.l,{x,y,w:2.72,h:.42,fontSize:8,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(q.itens.slice(0,5).map(v=>`• ${v}`).join("\n")||"–",{x:x+.1,y:y+.48,w:2.52,h:2.0,fontSize:10,color:N,fontFace:"Calibri",valign:"top",margin:2});});
      // Habilidades radar (barras à direita)
      sl.addText("🎯  Habilidades do Futuro",{x:6.0,y:1.22,w:3.6,h:.38,fontSize:12,bold:true,color:N,fontFace:"Calibri",margin:0});
      HABILIDADES.forEach((h,i)=>{
        const y=1.68+i*.55;const nota=d.habilidades[h.id]||0;
        const cor=h.grupo==="Digital"?TL:h.grupo==="Cognitiva"?PU:GR;
        sl.addText(h.nome,{x:6.0,y,w:2.4,h:.36,fontSize:9,color:N,fontFace:"Calibri",margin:0,valign:"middle"});
        sl.addText(`${nota}`,{x:8.35,y,w:.4,h:.36,fontSize:10,bold:true,color:cor,align:"right",fontFace:"Calibri",margin:0});
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:8.75,y:y+.1,w:.9,h:.14,fill:{color:SD},rectRadius:.04});
        if(nota>0)sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:8.75,y:y+.1,w:Math.max(.9*(nota/5),.04),h:.14,fill:{color:cor},rectRadius:.04});});
      // Estratégia SWOT
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.35,y:6.64,w:9.3,h:.72,fill:{color:N},rectRadius:.1});
      sl.addText("🎯  Como vou usar meu SWOT a meu favor",{x:.55,y:6.7,w:8.9,h:.28,fontSize:10,bold:true,color:AM,fontFace:"Calibri",margin:0});
      const forcasArr=d.swot.forcas.slice(0,2);const oopArr=d.swot.oportunidades.slice(0,1);
      const estrategia=forcasArr.length>0&&oopArr.length>0?`Usar ${forcasArr.join(" e ")} para aproveitar ${oopArr[0]}.`:"[Complete com sua estratégia]";
      sl.addText(estrategia,{x:.55,y:6.98,w:8.9,h:.32,fontSize:10,color:WH,fontFace:"Calibri",margin:0});}

      // ── S8 SABOTADOR ──────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.3,fill:{color:N},line:{color:N}});
      sl.addText("ANTI-AUTOSSABOTAGEM",{x:.6,y:.1,w:8,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Meu Perfil & Plano para Superar Bloqueios",{x:.6,y:.42,w:8,h:.7,fontSize:20,bold:true,color:WH,fontFace:"Calibri",margin:0});
      const sabInfo=SABOTADORES_INFO[d.sabotadorPrincipal]||{frase:'""',tracos:""};
      const sabEmoji=QUIZ_SABOTADORES.find(q=>q.sab===d.sabotadorPrincipal)?.emoji||"🛡️";
      const sabEmoji2=QUIZ_SABOTADORES.find(q=>q.sab===d.sabotadorSecundario)?.emoji||"";
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.42,w:3.8,h:5.55,fill:{color:NM},rectRadius:.12});
      sl.addText(sabEmoji,{x:.4,y:1.6,w:3.8,h:.9,fontSize:40,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(d.sabotadorPrincipal||"[Sabotador]",{x:.5,y:2.52,w:3.6,h:.55,fontSize:18,bold:true,color:AM,align:"center",fontFace:"Calibri",margin:0});
      sl.addText("Sabotador Principal",{x:.5,y:3.08,w:3.6,h:.3,fontSize:9,color:SD,align:"center",italic:true,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.RECTANGLE,{x:1.0,y:3.45,w:2.5,h:.04,fill:{color:AM},line:{color:AM}});
      sl.addText(sabInfo.frase,{x:.55,y:3.58,w:3.5,h:1.0,fontSize:11,color:SD,italic:true,align:"center",fontFace:"Calibri",margin:0});
      sl.addText("Traços secundários",{x:.5,y:4.68,w:3.6,h:.3,fontSize:9,color:AM,bold:true,fontFace:"Calibri",margin:0,align:"center"});
      sl.addText(`${sabEmoji2} ${d.sabotadorSecundario||"–"}`,{x:.5,y:5.0,w:3.6,h:.3,fontSize:11,color:WH,align:"center",fontFace:"Calibri",margin:0});
      [{l:"🎯 Meta",v:d.sabMeta},{l:"🛡️ Como superar",v:d.sabComo},{l:"📅 Quando",v:d.sabQuando},{l:"🤝 Com quem",v:d.sabComQuem}].forEach((it,i)=>{
        const y=1.42+i*1.38;
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:4.4,y,w:5.2,h:1.22,fill:{color:WH},rectRadius:.1});
        sl.addText(it.l,{x:4.58,y:y+.1,w:4.84,h:.3,fontSize:10,bold:true,color:TL,fontFace:"Calibri",margin:0});
        sl.addText(it.v||"[preencher]",{x:4.58,y:y+.42,w:4.84,h:.72,fontSize:13,color:N,fontFace:"Calibri",margin:0,valign:"top"});});}

      // ── S9 COMPROMISSO 7 DIAS ─────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.3,fill:{color:NM},line:{color:NM}});
      sl.addText("⚡ COMPROMISSO DE 7 DIAS",{x:.6,y:.1,w:9,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Minha Primeira Ação — Começa Hoje",{x:.6,y:.42,w:9,h:.7,fontSize:22,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:1.2,y:1.45,w:7.6,h:4.3,fill:{color:AM},rectRadius:.18});
      sl.addText("🤝",{x:1.2,y:1.6,w:7.6,h:.95,fontSize:44,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(`Nos próximos 7 dias, ${pr2.ele||"eu"} vou:`,{x:1.4,y:2.58,w:7.2,h:.5,fontSize:14,color:N,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(d.compromisso7dias||"[Sua ação de 7 dias]",{x:1.4,y:3.1,w:7.2,h:1.1,fontSize:20,bold:true,color:N,align:"center",valign:"middle",fontFace:"Calibri",margin:8});
      sl.addShape(prs.shapes.RECTANGLE,{x:2.2,y:4.25,w:5.6,h:.04,fill:{color:N},line:{color:N}});
      sl.addText(`Esta é minha promessa para mim ${mesmo}.`,{x:1.4,y:4.36,w:7.2,h:.42,fontSize:12,color:NM,italic:true,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(`${d.nome||"[Nome]"}  ·  ${hoje}`,{x:1.4,y:4.85,w:7.2,h:.45,fontSize:14,bold:true,color:NM,align:"center",fontFace:"Calibri",margin:0});
      sl.addText("Lembre-se: uma ação pequena hoje vale mais do que um plano perfeito para amanhã. ✨",{x:.5,y:5.95,w:9.0,h:.42,fontSize:11,color:SD,italic:true,align:"center",fontFace:"Calibri",margin:0});}

      // ── S10 5W2H ──────────────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.1,fill:{color:N},line:{color:N}});
      sl.addText("PLANO DE AÇÃO",{x:.6,y:.08,w:8,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Método 5W2H — Plano para até 4 ações",{x:.6,y:.38,w:8,h:.55,fontSize:18,bold:true,color:WH,fontFace:"Calibri",margin:0});
      // Cabeçalho colunas
      const colW=2.05;
      ["Ação 1","Ação 2","Ação 3","Ação 4"].forEach((ac,i)=>{
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:2.25+i*colW,y:1.15,w:colW-.08,h:.42,fill:{color:NM},rectRadius:.06});
        sl.addText(ac,{x:2.25+i*colW,y:1.15,w:colW-.08,h:.42,fontSize:11,bold:true,color:AM,align:"center",valign:"middle",fontFace:"Calibri",margin:0});});
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
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.25,y,w:1.92,h:.68,fill:{color:row.cor},rectRadius:.08});
        sl.addText(row.l,{x:.25,y,w:1.92,h:.38,fontSize:10,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(row.sl,{x:.25,y:y+.36,w:1.92,h:.3,fontSize:8,color:WH,align:"center",italic:true,fontFace:"Calibri",margin:0});
        for(let ci=0;ci<4;ci++){
          sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:2.25+ci*colW,y,w:colW-.08,h:.68,fill:{color:ri%2===0?NM:NL},rectRadius:.06});
          sl.addText("✏️",{x:2.35+ci*colW,y:y+.18,w:colW-.28,h:.32,fontSize:13,align:"center",fontFace:"Calibri",margin:0});}});}

      // ── S11 CRONOGRAMA ANUAL ──────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:SL};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.1,fill:{color:N},line:{color:N}});
      sl.addText("🗓️ CRONOGRAMA ANUAL",{x:.6,y:.08,w:9,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText(`Linha do Tempo das Minhas Ações — ${new Date().getFullYear()}/${new Date().getFullYear()+1}`,{x:.6,y:.38,w:9,h:.55,fontSize:18,bold:true,color:WH,fontFace:"Calibri",margin:0});
      const meses=["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
      const cw=9.2/12;
      meses.forEach((m,i)=>{
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4+i*cw,y:1.15,w:cw-.04,h:.45,fill:{color:i%2===0?NM:NL},rectRadius:.05});
        sl.addText(m,{x:.4+i*cw,y:1.15,w:cw-.04,h:.45,fontSize:9,bold:true,color:WH,align:"center",valign:"middle",fontFace:"Calibri",margin:0});});
      // Ações baseadas no plano
      const acoesPlano=[
        {nome:d.plano30.oq||"Ação 30 dias",inicio:1,dur:1,cor:TL,y:1.75},
        {nome:d.plano60.oq||"Ação 60 dias",inicio:2,dur:2,cor:PU,y:2.45},
        {nome:d.plano90.oq||"Ação 90 dias",inicio:3,dur:3,cor:GR,y:3.15},
        {nome:d.compromisso7dias||"Compromisso 7 dias",inicio:0,dur:1,cor:AM,y:3.85},
      ];
      acoesPlano.forEach(a=>{
        sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4+a.inicio*cw,y:a.y,w:a.dur*cw-.04,h:.58,fill:{color:a.cor},rectRadius:.08});
        sl.addText(a.nome.substring(0,30),{x:.45+a.inicio*cw,y:a.y+.08,w:a.dur*cw-.14,h:.42,fontSize:10,bold:true,color:WH,fontFace:"Calibri",margin:2});});
      // Marcos 30/60/90
      [{d:1,l:"30 dias",c:AM},{d:2,l:"60 dias",c:GR},{d:3,l:"90 dias",c:TL}].forEach(m=>{
        sl.addShape(prs.shapes.RECTANGLE,{x:.4+m.d*cw,y:1.15,w:.06,h:3.5,fill:{color:m.c},line:{color:m.c}});
        sl.addText(m.l,{x:.4+m.d*cw-.3,y:4.72,w:1.2,h:.3,fontSize:9,bold:true,color:m.c,fontFace:"Calibri",margin:0});});
      sl.addText("💡 Edite este cronograma no PowerPoint conforme seu ritmo — arraste as barras para ajustar os prazos.",{x:.4,y:5.15,w:9.2,h:.35,fontSize:9,color:"4A5A7A",italic:true,align:"center",fontFace:"Calibri",margin:0});}

      // ── S12 COMPROMISSO (oculto) ──────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.RECTANGLE,{x:0,y:0,w:10,h:1.3,fill:{color:NM},line:{color:NM}});
      sl.addText("MEU COMPROMISSO",{x:.6,y:.1,w:8,h:.3,fontSize:8,bold:true,color:AM,charSpacing:3,fontFace:"Calibri",margin:0});
      sl.addText("Apresentar meu PDI & Medida de Sucesso",{x:.6,y:.42,w:8,h:.7,fontSize:20,bold:true,color:WH,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:1.42,w:9.2,h:.88,fill:{color:AM},rectRadius:.1});
      sl.addText(`📅  Vou apresentar para: ${d.gestor||"[gestor, mentor ou eu mesmo(a)]"}   ·   Data: ${d.gestorData?new Date(d.gestorData+"T12:00:00").toLocaleDateString("pt-BR"):"[DD/MM/AAAA]"}`,{x:.6,y:1.42,w:8.8,h:.88,fontSize:14,bold:true,color:N,fontFace:"Calibri",valign:"middle",margin:10});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.4,y:2.42,w:9.2,h:4.1,fill:{color:NL},rectRadius:.12});
      sl.addText("O que precisa acontecer nos próximos 90 dias para esse PDI valer a pena?",{x:.6,y:2.55,w:8.8,h:.52,fontSize:12,bold:true,color:AM,fontFace:"Calibri",margin:0});
      [{n:1,v:d.medida1||"[Vida pessoal]"},{n:2,v:d.medida2||"[Carreira]"},{n:3,v:d.medida3||"[Desenvolvimento]"}].forEach((m,i)=>{
        const y=3.18+i*.95;
        sl.addShape(prs.shapes.OVAL,{x:.58,y:y+.08,w:.56,h:.56,fill:{color:AM},line:{color:AM}});
        sl.addText(`${m.n}`,{x:.58,y:y+.08,w:.56,h:.56,fontSize:15,bold:true,color:N,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
        sl.addText(m.v,{x:1.3,y,w:8.1,h:.7,fontSize:13,color:WH,fontFace:"Calibri",valign:"middle",margin:3});});
      sl.addText("🔒  Uso pessoal · não apresentar",{x:.4,y:6.62,w:9.2,h:.3,fontSize:9,color:"607090",italic:true,fontFace:"Calibri",margin:0,align:"center"});}

      // ── S13 IANA (oculto) ─────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.OVAL,{x:-.8,y:-.8,w:5.0,h:5.0,fill:{color:NM,transparency:55},line:{color:NM,transparency:55}});
      sl.addShape(prs.shapes.ROUNDED_RECTANGLE,{x:.45,y:.3,w:1.6,h:1.6,fill:{color:NM},rectRadius:.25});
      sl.addText("🤖",{x:.45,y:.3,w:1.6,h:1.6,fontSize:40,align:"center",valign:"middle",fontFace:"Calibri",margin:0});
      sl.addText("IANA",{x:2.25,y:.35,w:5,h:.65,fontSize:34,bold:true,color:AM,fontFace:"Calibri",margin:0});
      sl.addText("IA da Ana  ·  Sua mentora de desenvolvimento",{x:2.25,y:1.02,w:7.3,h:.35,fontSize:12,color:SD,fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.RECTANGLE,{x:.45,y:1.55,w:9.1,h:.04,fill:{color:AM},line:{color:AM}});
      sl.addText(iaText||`${d.nome||"[Nome]"}, você construiu um PDI com clareza e coragem que poucas pessoas alcançam. Como ${pr2.ele?"sua":""} mentora, deixo 3 movimentos para transformar esse plano em resultado:\n\n⚖️ Equilíbrio antes de velocidade — Bloqueie no calendário 1 momento de descanso inegociável por semana.\n\n🎯 Uma prioridade de cada vez — Escolha UMA ação para os próximos 30 dias e vá fundo.\n\n📣 Compromisso com testemunha — Apresente seu PDI a alguém de confiança e peça check-in mensal.\n\nCrescimento sustentável pede consistência, não velocidade. ✨`,{x:.5,y:1.68,w:9.0,h:5.0,fontSize:13,color:WH,fontFace:"Calibri",valign:"top",margin:0});
      sl.addText("🔒  Uso pessoal · não apresentar",{x:.4,y:7.05,w:9.2,h:.3,fontSize:9,color:"607090",italic:true,fontFace:"Calibri",margin:0,align:"center"});}

      // ── S14 FRASE FINAL ───────────────────────────────────────
      {const sl=prs.addSlide();sl.background={color:N};
      sl.addShape(prs.shapes.OVAL,{x:-.8,y:-.8,w:6.5,h:6.5,fill:{color:NM,transparency:55},line:{color:NM,transparency:55}});
      sl.addShape(prs.shapes.OVAL,{x:6.0,y:2.0,w:5.5,h:5.5,fill:{color:NL,transparency:65},line:{color:NL,transparency:65}});
      sl.addText("\u201C",{x:.8,y:.5,w:8.4,h:1.2,fontSize:80,bold:true,color:AM,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(d.fraseF||"Meu desenvolvimento começa com uma decisão:\na de agir.",{x:.8,y:1.65,w:8.4,h:2.2,fontSize:22,color:WH,italic:true,align:"center",valign:"middle",fontFace:"Calibri",margin:16});
      sl.addText("\u201D",{x:.8,y:3.65,w:8.4,h:1.0,fontSize:80,bold:true,color:AM,align:"center",fontFace:"Calibri",margin:0});
      sl.addShape(prs.shapes.RECTANGLE,{x:3.1,y:5.0,w:3.8,h:.05,fill:{color:AM},line:{color:AM}});
      sl.addText(d.nome||"[Nome]",{x:.8,y:5.1,w:8.4,h:.5,fontSize:18,bold:true,color:AM,align:"center",fontFace:"Calibri",margin:0});
      sl.addText(hoje,{x:.8,y:5.65,w:8.4,h:.3,fontSize:10,color:"607090",align:"center",fontFace:"Calibri",margin:0});}

      await prs.writeFile({fileName:`PDI_${(d.nome||"meu").replace(/ /g,"_")}.pptx`});
      setDlMsg("✅ PowerPoint baixado! Abra e personalize como quiser.");
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

    <Card style={{background:`linear-gradient(135deg,${C.navyMid},${C.navyLight})`,border:`2px solid ${C.amber}44`}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
        <span style={{fontSize:26}}>🤖</span>
        <div>
          <div style={{fontWeight:800,fontSize:14,color:C.amber}}>IANA — Sua Mentora de IA</div>
          <div style={{fontSize:10,color:C.slateDeep}}>{IANA_MAX-ianaUsos} análise(s) disponível(is)</div>
        </div>
      </div>
      {ianaUsos>=IANA_MAX
        ?<div style={{background:C.navyLight,borderRadius:10,padding:12,fontSize:12,color:C.slateDeep,textAlign:"center"}}>Análises utilizadas. O resultado já está no seu PowerPoint! 💪</div>
        :!iaText
          ?<button onClick={gerarIANA} disabled={iaLoad} style={{width:"100%",padding:11,background:iaLoad?C.navyLight:C.amber,color:iaLoad?C.slateDeep:C.navy,border:"none",borderRadius:9,fontWeight:800,fontSize:13,cursor:iaLoad?"default":"pointer"}}>{iaLoad?"⏳ Analisando seu PDI...":"✨ Gerar análise da IANA"}</button>
          :<div style={{fontSize:12,color:C.white,lineHeight:1.7}}>{iaText}</div>}
    </Card>

    <Card>
      <Titulo>📥 Baixar seu PDI em PowerPoint</Titulo>
      <div style={{fontSize:11,color:C.textMid,marginBottom:12,lineHeight:1.6}}>
        14 slides profissionais — inclui slides ocultos para uso pessoal (5W2H, cronograma, compromisso e IANA). Abra no PowerPoint ou Google Slides e edite como quiser!
      </div>
      <button onClick={baixar} disabled={dlLoad} style={{width:"100%",padding:14,background:dlLoad?C.slateDeep:C.navy,color:dlLoad?C.textMid:C.white,border:"none",borderRadius:10,fontWeight:800,fontSize:14,cursor:dlLoad?"default":"pointer"}}>
        {dlLoad?"⏳ Gerando seu PowerPoint...":"📊 Baixar PDI (.pptx)"}
      </button>
      {dlMsg&&<div style={{marginTop:10,padding:10,background:dlMsg.startsWith("✅")?`${C.green}18`:`${C.red}18`,borderRadius:9,fontSize:12,fontWeight:700,color:dlMsg.startsWith("✅")?C.green:C.red,textAlign:"center"}}>{dlMsg}</div>}
    </Card>

    <Card style={{background:C.slate,borderLeft:`4px solid ${C.teal}`,textAlign:"center"}}>
      <div style={{fontSize:13,color:C.textMid,lineHeight:1.8}}>
        Gostou do PDI na Prática?<br/>
        <strong style={{color:C.navy}}>Compartilhe com quem você quer ver crescer! 🚀</strong>
      </div>
    </Card>
  </div>;
}

// ── MENSAGEM MOTIVACIONAL ─────────────────────────────────────────
function MsgMotivacional({etapa,onContinuar}){
  return <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',sans-serif",textAlign:"center"}}>
    <div style={{fontSize:56,marginBottom:20}}>🌟</div>
    <div style={{fontSize:18,fontWeight:700,color:C.white,lineHeight:1.5,maxWidth:300,marginBottom:32}}>{MSGS[etapa%MSGS.length]}</div>
    <button onClick={onContinuar} style={{padding:"14px 40px",background:C.amber,color:C.navy,border:"none",borderRadius:12,fontWeight:800,fontSize:15,cursor:"pointer"}}>Continuar →</button>
  </div>;
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────

function TelaRanking(){
  const [ranking,setRanking]=useState([]);
  const [loading,setLoading]=useState(true);
  const ref=useRef(null);
  async function atualizar(){const data=await dbRanking();setRanking(data);setLoading(false);}
  useEffect(()=>{atualizar();ref.current=setInterval(atualizar,10000);return()=>clearInterval(ref.current);},[]);
  const medalhas=[{emoji:"🥇",cor:C.gold},{emoji:"🥈",cor:C.silver},{emoji:"🥉",cor:C.bronze}];
  const top3=ranking.slice(0,3);const resto=ranking.slice(3);
  return <div style={{minHeight:"100vh",background:C.navy,padding:32,fontFamily:"'Inter',sans-serif"}}>
    <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}`}</style>
    <div style={{textAlign:"center",marginBottom:32}}>
      <div style={{fontSize:13,color:C.amber,fontWeight:700,letterSpacing:3,textTransform:"uppercase",marginBottom:8}}>🏆 Ranking ao Vivo · PDI na Prática</div>
      <div style={{fontSize:36,fontWeight:800,color:C.white}}>Quem tem o PDI mais completo?</div>
      <div style={{fontSize:11,color:C.slateDeep,marginTop:6}}>Atualização automática a cada 10 segundos</div>
    </div>
    {loading?<div style={{textAlign:"center",color:C.slateDeep,fontSize:20,padding:60}}>⏳ Carregando...</div>:
    ranking.length===0?<div style={{textAlign:"center",color:C.slateDeep,fontSize:18,padding:60}}>Aguardando participantes finalizarem...</div>:(
    <>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.25fr 1fr",gap:20,marginBottom:32,alignItems:"end"}}>
        {[top3[1],top3[0],top3[2]].map((p,vi)=>{
          if(!p)return <div key={vi}/>;
          const pos=vi===1?0:vi===0?1:2;const m=medalhas[pos];
          return <div key={vi} style={{background:`linear-gradient(160deg,${C.navyMid},${C.navyLight})`,borderRadius:20,padding:"24px 20px",textAlign:"center",border:`3px solid ${m.cor}`,boxShadow:`0 0 30px ${m.cor}44`,minHeight:vi===1?"230px":"190px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",animation:vi===1?"pulse 2s infinite":"none"}}>
            <div style={{fontSize:vi===1?56:42,marginBottom:4}}>{m.emoji}</div>
            <div style={{fontSize:vi===1?22:18,fontWeight:800,color:C.white,marginBottom:8}}>Participante {pos+1}</div>
            <div style={{fontSize:vi===1?42:32,fontWeight:800,color:m.cor,lineHeight:1}}>{p.pontos_total}</div>
            <div style={{fontSize:10,color:C.slateDeep,marginBottom:8}}>pontos</div>
            <span style={{fontSize:9,background:`${m.cor}22`,color:m.cor,padding:"2px 8px",borderRadius:99,fontWeight:700}}>🔥 {p.nivel_vontade}/10</span>
          </div>;
        })}
      </div>
      {resto.length>0&&<div style={{background:C.navyMid,borderRadius:16,padding:20}}>
        {resto.map((p,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:i%2===0?C.navy:C.navyLight,marginBottom:6}}>
            <div style={{fontSize:16,fontWeight:800,color:C.slateDeep,width:30}}>{i+4}º</div>
            <div style={{flex:1}}><div style={{fontWeight:700,color:C.white,fontSize:14}}>Participante {i+4}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:800,color:C.amber}}>{p.pontos_total}</div><div style={{fontSize:9,color:C.slateDeep}}>pts</div></div>
          </div>
        ))}
      </div>}
      <div style={{textAlign:"center",marginTop:24,color:C.slateDeep,fontSize:11}}>{ranking.length} participante(s) · {new Date().toLocaleTimeString("pt-BR")}</div>
    </>)}
  </div>;
}

// ── DASHBOARD RH ──────────────────────────────────────────────────

function DashboardRH(){
  const [senha,setSenha]=useState("");
  const [ok,setOk]=useState(false);
  const [dados,setDados]=useState([]);
  const [loading,setLoading]=useState(false);
  const ref=useRef(null);

  async function carregar(){setLoading(true);const data=await dbRanking();setDados(data);setLoading(false);}
  function entrar(){if(senha===RH_SENHA){setOk(true);carregar();ref.current=setInterval(carregar,30000);}else alert("Senha incorreta");}
  useEffect(()=>()=>clearInterval(ref.current),[]);

  if(!ok)return <div style={{minHeight:"100vh",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Inter',sans-serif"}}>
    <div style={{background:C.navyMid,borderRadius:16,padding:32,width:320,textAlign:"center"}}>
      <div style={{fontSize:36,marginBottom:12}}>📊</div>
      <div style={{fontWeight:800,fontSize:18,color:C.white,marginBottom:8}}>Dashboard RH</div>
      <div style={{fontSize:12,color:C.slateDeep,marginBottom:20}}>Acesso restrito — Facilitadora</div>
      <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} onKeyDown={e=>e.key==="Enter"&&entrar()} placeholder="Senha de acesso"
        style={{width:"100%",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${C.navyLight}`,background:C.navy,color:C.white,fontSize:14,outline:"none",fontFamily:"inherit",marginBottom:12}}/>
      <button onClick={entrar} style={{width:"100%",padding:12,background:C.amber,color:C.navy,border:"none",borderRadius:10,fontWeight:800,fontSize:14,cursor:"pointer"}}>Entrar</button>
    </div>
  </div>;

  if(loading&&dados.length===0)return <div style={{minHeight:"100vh",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",color:C.slateDeep,fontSize:18,fontFamily:"'Inter',sans-serif"}}>Carregando dados...</div>;

  const n=Math.max(dados.length,1);
  const media=arr=>arr.length?( arr.reduce((s,x)=>s+x,0)/arr.length).toFixed(1):"–";
  const mediaVontade=media(dados.map(d=>d.nivel_vontade||0));
  const mediaCorpo=media(dados.map(d=>d.energia_corpo||0));
  const mediaMente=media(dados.map(d=>d.energia_mente||0));
  const mediaEmocao=media(dados.map(d=>d.energia_emocao||0));
  const mediaApoio=media(dados.filter(d=>d.apoia_desenvolvimento).map(d=>d.apoia_desenvolvimento));
  const mediaPts=media(dados.map(d=>d.pontos_total||0));
  const count=(arr,key)=>arr.reduce((acc,d)=>{const v=d[key];if(v)acc[v]=(acc[v]||0)+1;return acc;},{});
  const topN=(obj,n)=>Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,n);
  const sabCount=count(dados,"sabotador");
  const difCount=count(dados,"dificuldade_principal");
  const cargoCount=count(dados,"cargo_pretendido");
  const gapCount={}; dados.forEach(d=>(d.gaps_habilidades||"").split(",").map(g=>g.trim()).filter(Boolean).forEach(g=>{gapCount[g]=(gapCount[g]||0)+1;}));
  const areaCount={}; dados.forEach(d=>(d.areas_baixas_roda||"").split(",").map(a=>a.trim()).filter(Boolean).forEach(a=>{areaCount[a]=(areaCount[a]||0)+1;}));
  const alinhados=dados.filter(d=>d.alinhado_carreira==="Sim, estou alinhado").length;
  const parcial=dados.filter(d=>d.alinhado_carreira==="Parcialmente").length;
  const desalinhados=dados.filter(d=>d.alinhado_carreira==="Não, quero mudar de área").length;
  const riscoSaida=dados.filter(d=>(d.nivel_vontade||5)<5&&d.alinhado_carreira==="Não, quero mudar de área").length;

  const card={background:C.white,borderRadius:14,padding:16,marginBottom:12,boxShadow:"0 2px 8px rgba(15,29,58,.07)"};
  const bar=(v,max,cor)=><div style={{background:C.slateDeep,borderRadius:99,height:8,overflow:"hidden",flex:1}}>
    <div style={{width:`${Math.min(100,(v/max)*100)}%`,height:"100%",background:cor,borderRadius:99}}/>
  </div>;

  return <div style={{fontFamily:"'Inter',sans-serif",minHeight:"100vh",background:C.slate,color:C.text}}>
    <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,padding:"20px 20px 16px"}}>
      <div style={{fontSize:8,color:C.slateDeep,fontWeight:700,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Dashboard RH — Dados Anônimos</div>
      <div style={{fontSize:22,fontWeight:800,color:C.white,marginBottom:4}}>Relatório do Treinamento PDI</div>
      <div style={{fontSize:11,color:C.slateDeep}}>{dados.length} participantes · Atualização a cada 30s</div>
      <div style={{marginTop:10,fontSize:10,color:C.amber,background:`${C.amber}18`,borderRadius:8,padding:"6px 10px",display:"inline-block"}}>🔒 Todos os dados são anônimos (LGPD)</div>
    </div>
    <div style={{padding:14}}>

      {/* Visão Geral */}
      <div style={{fontWeight:700,fontSize:11,color:C.textMid,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Visão Geral</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {[{l:"Participantes",v:dados.length,ic:"👥",cor:C.teal},{l:"Média de Pontos",v:mediaPts,ic:"🏆",cor:C.amber},{l:"Média de Vontade",v:`${mediaVontade}/10`,ic:"🔥",cor:C.green},{l:"Risco de Saída",v:riscoSaida,ic:"⚠️",cor:C.red}].map(m=>(
          <div key={m.l} style={{...card,borderLeft:`4px solid ${m.cor}`,margin:0}}>
            <div style={{fontSize:18,marginBottom:4}}>{m.ic}</div>
            <div style={{fontSize:24,fontWeight:800,color:m.cor}}>{m.v}</div>
            <div style={{fontSize:10,color:C.textMid}}>{m.l}</div>
          </div>
        ))}
      </div>

      {/* Energia */}
      <div style={card}>
        <div style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:12}}>🌡️ Como chegaram ao treinamento</div>
        {[{l:"💪 Corpo",v:mediaCorpo,c:C.green},{l:"🧠 Mente",v:mediaMente,c:C.teal},{l:"❤️ Emoção",v:mediaEmocao,c:C.purple}].map(e=>(
          <div key={e.l} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,fontWeight:600}}>{e.l}</span><span style={{fontSize:14,fontWeight:800,color:e.c}}>{e.v}/5</span></div>
            <PBar value={Number(e.v)} max={5} cor={e.c} h={8}/>
          </div>
        ))}
      </div>

      {/* Alinhamento */}
      <div style={card}>
        <div style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:12}}>🎯 Alinhamento de Carreira</div>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          {[{l:"✅ Alinhados",v:alinhados,c:C.green},{l:"⚡ Parcial",v:parcial,c:C.amber},{l:"🔄 Quer mudar",v:desalinhados,c:C.red}].map(a=>(
            <div key={a.l} style={{flex:1,textAlign:"center",background:`${a.c}15`,borderRadius:10,padding:"10px 6px",border:`1px solid ${a.c}44`}}>
              <div style={{fontSize:18,fontWeight:800,color:a.c}}>{a.v}</div>
              <div style={{fontSize:10,color:C.textMid,marginTop:2}}>{a.l}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:11,color:C.textMid}}>Apoio percebido da empresa: <strong style={{color:C.navy}}>{mediaApoio}/5</strong></div>
      </div>

      {/* Sabotadores */}
      <div style={card}>
        <div style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:12}}>🛡️ Sabotadores mais comuns</div>
        {topN(sabCount,3).map(([sab,cnt])=>(
          <div key={sab} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.slate}`}}>
            <span style={{fontSize:11,fontWeight:600,flex:1}}>{SABOTADORES.find(s=>s.nome===sab)?.emoji} {sab}</span>
            <div style={{display:"flex",alignItems:"center",gap:8,width:120}}>
              {bar(cnt,n,C.amber)}
              <span style={{fontSize:12,fontWeight:700,color:C.amber,minWidth:32}}>{Math.round((cnt/n)*100)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Dificuldades */}
      <div style={card}>
        <div style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:12}}>🚧 Principais dificuldades de desenvolvimento</div>
        {topN(difCount,4).map(([dif,cnt])=>(
          <div key={dif} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.slate}`}}>
            <span style={{fontSize:11,flex:1}}>{dif}</span>
            <div style={{display:"flex",alignItems:"center",gap:8,width:100}}>
              {bar(cnt,n,C.red)}
              <span style={{fontSize:12,fontWeight:700,color:C.red,minWidth:32}}>{Math.round((cnt/n)*100)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Gaps */}
      <div style={card}>
        <div style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:8}}>💡 Principais gaps de habilidades</div>
        <div style={{fontSize:11,color:C.textMid,marginBottom:12,background:`${C.teal}15`,borderRadius:8,padding:"8px 10px"}}>
          💡 <strong>Sugestão para o RH:</strong> Considere capacitações nestas áreas.
        </div>
        {topN(gapCount,5).map(([gap,cnt])=>(
          <div key={gap} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.slate}`}}>
            <span style={{fontSize:11,flex:1}}>{gap}</span>
            <div style={{display:"flex",alignItems:"center",gap:8,width:100}}>
              {bar(cnt,n,C.teal)}
              <span style={{fontSize:12,fontWeight:700,color:C.teal,minWidth:32}}>{Math.round((cnt/n)*100)}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Roda da Vida */}
      <div style={card}>
        <div style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:12}}>⚖️ Áreas da vida com menor satisfação</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {topN(areaCount,4).map(([area,cnt])=>(
            <span key={area} style={{fontSize:10,fontWeight:700,background:`${C.orange}22`,color:C.orange,padding:"4px 12px",borderRadius:99}}>{area} ({Math.round((cnt/n)*100)}%)</span>
          ))}
        </div>
      </div>

      {/* Cargos */}
      <div style={card}>
        <div style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:12}}>📈 Cargos pretendidos (planejamento de sucessão)</div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {Object.entries(cargoCount).map(([cargo,cnt])=>(
            <div key={cargo} style={{flex:1,textAlign:"center",background:C.slate,borderRadius:10,padding:"10px 6px"}}>
              <div style={{fontSize:20,fontWeight:800,color:C.navy}}>{cnt}</div>
              <div style={{fontSize:10,color:C.textMid,marginTop:2}}>{cargo}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa de Talentos */}
      <div style={card}>
        <div style={{fontWeight:700,fontSize:13,color:C.navy,marginBottom:8}}>🗺️ Índice de Clima de Desenvolvimento</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{l:"Média Vontade",v:`${mediaVontade}/10`,c:C.amber},{l:"Apoio Empresa",v:`${mediaApoio}/5`,c:C.teal},{l:"Concluíram",v:`${dados.length}`,c:C.green},{l:"Risco Saída",v:riscoSaida,c:C.red}].map(m=>(
            <div key={m.l} style={{background:C.slate,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:9,color:C.textMid,marginBottom:4}}>{m.l}</div>
              <div style={{fontSize:20,fontWeight:800,color:m.c}}>{m.v}</div>
            </div>
          ))}
        </div>
      </div>

      {riscoSaida>0&&<div style={{...card,borderLeft:`4px solid ${C.red}`}}>
        <div style={{fontWeight:700,fontSize:13,color:C.red,marginBottom:8}}>⚠️ Índice de Risco de Saída</div>
        <div style={{fontSize:12,color:C.textMid,lineHeight:1.6,marginBottom:8}}><strong>{riscoSaida} participante(s)</strong> com baixa vontade + desalinhamento de carreira. Recomenda-se atenção no acompanhamento.</div>
        <div style={{fontSize:10,color:C.textMid,fontStyle:"italic"}}>* Dados 100% anônimos. Nenhuma pessoa identificada individualmente.</div>
      </div>}

      <div style={{textAlign:"center",padding:"16px 0",fontSize:11,color:C.textLight}}>
        🔒 Relatório anônimo · PDI na Prática<br/>Atualização automática a cada 30s
      </div>
    </div>
  </div>;
}


function TelaRevisao(){
  return <div style={{minHeight:"100vh",background:C.navy,padding:24,fontFamily:"'Inter',sans-serif"}}>
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

// ── MENSAGEM MOTIVACIONAL ─────────────────────────────────────────
function MsgMotivacional({etapa,onContinuar}){
  return <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,fontFamily:"'Inter',sans-serif",textAlign:"center"}}>
    <div style={{fontSize:56,marginBottom:20}}>🌟</div>
    <div style={{fontSize:18,fontWeight:700,color:C.white,lineHeight:1.5,maxWidth:300,marginBottom:32}}>{MSGS[etapa%MSGS.length]}</div>
    <button onClick={onContinuar} style={{padding:"14px 40px",background:C.amber,color:C.navy,border:"none",borderRadius:12,fontWeight:800,fontSize:15,cursor:"pointer"}}>Continuar →</button>
  </div>;
}

// ── APP PRINCIPAL ─────────────────────────────────────────────────

// ── APP PRINCIPAL ────────────────────────────────────────────────
export default function App(){
  const qs=typeof window!=="undefined"?window.location.search:"";
  if(qs.includes("ranking=1"))return <TelaRanking/>;
  if(qs.includes("rh=1"))return <DashboardRH/>;
  if(qs.includes("revisao=1"))return <TelaRevisao/>;

  const[etapa,setEtapa]=useState(0);
  const[dados,setDados]=useState(INICIAL);
  const[showMsg,setShowMsg]=useState(false);
  const[proxEtapa,setProxEtapa]=useState(0);

  function ir(p){
    if(p>2&&p%3===0&&p<telas.length-1){setProxEtapa(p);setShowMsg(true);}
    else setEtapa(p);
  }
  function prev(){setEtapa(e=>Math.max(e-1,0));}

  if(showMsg)return <MsgMotivacional etapa={proxEtapa} onContinuar={()=>{setShowMsg(false);setEtapa(proxEtapa);}}/>;

  const telas=[
    <TelaLGPD next={()=>ir(1)}/>,
    <TelaInicio d={dados} set={setDados} next={()=>ir(2)} prev={()=>setEtapa(0)}/>,
    <TelaSobre d={dados} set={setDados} next={()=>ir(3)} prev={()=>setEtapa(1)}/>,
    <TelaConquistas d={dados} set={setDados} next={()=>ir(4)} prev={()=>setEtapa(2)}/>,
    <TelaJornada d={dados} set={setDados} next={()=>ir(5)} prev={()=>setEtapa(3)}/>,
    <TelaObjetivos d={dados} set={setDados} next={()=>ir(6)} prev={()=>setEtapa(4)}/>,
    <TelaSwot d={dados} set={setDados} next={()=>ir(7)} prev={()=>setEtapa(5)}/>,
    <TelaHabilidades d={dados} set={setDados} next={()=>ir(8)} prev={()=>setEtapa(6)}/>,
    <TelaSabotador d={dados} set={setDados} next={()=>ir(9)} prev={()=>setEtapa(7)}/>,
    <TelaSabResult d={dados} set={setDados} next={()=>ir(10)} prev={()=>setEtapa(8)}/>,
    <TelaPlano d={dados} set={setDados} next={()=>ir(11)} prev={()=>setEtapa(9)}/>,
    <TelaCompromisso d={dados} set={setDados} next={()=>ir(12)} prev={()=>setEtapa(10)}/>,
    <TelaConclusao d={dados} set={setDados}/>,
  ];

  const pct=Math.round((etapa/(telas.length-1))*100);
  const etapaInfo=ETAPAS[etapa+1]||ETAPAS[ETAPAS.length-1];

  return <div style={{fontFamily:"'Inter','Segoe UI',sans-serif",background:C.slate,minHeight:"100vh",color:C.text}}>
    <style>{`*{box-sizing:border-box}input,textarea{font-family:inherit}input[type=range]{-webkit-appearance:none;height:6px;border-radius:99px;outline:none;background:${C.slateDeep}}input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:${C.amber};cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.25)}`}</style>

    {etapa>0&&<>
      <div style={{background:`linear-gradient(135deg,${C.navy},${C.navyLight})`,padding:"12px 16px",color:C.white}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
          <div>
            <div style={{fontSize:8,color:C.slateDeep,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase"}}>PDI na Prática</div>
            <div style={{fontSize:15,fontWeight:800,marginTop:1}}>{dados.nome||"Meu PDI"}</div>
          </div>
          <div style={{background:C.amber,color:C.navy,fontWeight:800,fontSize:10,padding:"3px 10px",borderRadius:99}}>{etapa+1}/{telas.length}</div>
        </div>
        <PBar value={pct} max={100} cor={C.amber} h={4}/>
        <div style={{fontSize:10,color:C.amber,fontWeight:700,marginTop:4}}>{etapaInfo.icon} {etapaInfo.titulo}</div>
      </div>
      <div style={{background:C.navyMid,padding:"6px 14px",display:"flex",gap:4,overflowX:"auto"}}>
        {ETAPAS.slice(1).map((e,i)=>(
          <div key={e.id} title={e.titulo} style={{fontSize:13,padding:"4px 7px",borderRadius:8,flexShrink:0,
            background:i+1===etapa?C.amber:i+1<etapa?`${C.green}55`:"transparent",
            border:`1px solid ${i+1===etapa?C.amber:i+1<etapa?`${C.green}88`:"transparent"}`,
            opacity:i+1>etapa+1?.45:1}}>
            {e.icon}
          </div>
        ))}
      </div>
    </>}

    <div style={{padding:etapa===0?0:14}}>{telas[etapa]}</div>
  </div>;
}
