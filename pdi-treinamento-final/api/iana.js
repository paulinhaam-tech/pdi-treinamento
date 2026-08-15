// api/iana.js
// Função serverless (roda no Vercel, não no navegador da pessoa) — por isso a
// chave da API fica segura aqui, nunca é exposta no código do site.
//
// Configuração necessária no Vercel:
//   Project Settings → Environment Variables → adicionar ANTHROPIC_API_KEY
//   (o valor é a chave que começa com sk-ant-..., gerada em console.anthropic.com)

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "method" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      ok: false,
      recomendacao: null,
      cincoWDoisH: null,
      motivo: "config",
    });
  }

  try {
    const d = req.body || {};

    const gaps = Object.entries(d.habilidades || {})
      .filter(([, v]) => v && v <= 2)
      .map(([k]) => k);
    const areasRodaBaixas = Object.entries(d.rodaVida || {})
      .filter(([, v]) => (v?.nota ?? 5) <= 5)
      .map(([k, v]) => `${k} (nota ${v.nota}${v.melhorar ? `, quer melhorar: ${v.melhorar}` : ""})`);

    const resumo = `
Nome: ${d.nome || "a pessoa"}
Cargo atual: ${d.cargo || "não informado"}
Intenção com o treinamento: ${d.intencao || "não informada"}
Frase que a representa: ${d.sobreMimFrase || "não informada"}
Conquistas recentes: ${[d.conquista1, d.conquista2, d.conquista3].filter(Boolean).join(" | ") || "não informadas"}
Legado desejado: ${d.legado || "não informado"}
Objetivo de curto prazo: ${d.cargoShortText || "não informado"}
Objetivo de médio prazo: ${d.cargoMidText || "não informado"}
Objetivo de longo prazo: ${d.cargoLongText || "não informado"}
Checagem de realismo (o que falta): ${d.realidade || "não informado"}
Forças (SWOT): ${(d.forcas || []).join(", ") || "não informadas"}
Pontos de desenvolvimento (SWOT): ${(d.fraquezas || []).join(", ") || "não informados"}
Oportunidades (SWOT): ${(d.oportunidades || []).join(", ") || "não informadas"}
Ameaças (SWOT): ${(d.ameacas || []).join(", ") || "não informadas"}
Estratégia SWOT da pessoa: ${d.estrategia || "não informada"}
Gaps de habilidades (nota baixa): ${gaps.join(", ") || "nenhum crítico"}
Áreas da Roda da Vida com nota baixa: ${areasRodaBaixas.join(" | ") || "nenhuma crítica"}
Sabotador principal: ${d.sabotadorPrincipal || "não identificado"}
Meta contra o sabotador: ${d.sabMeta || "não informada"}
Plano 30 dias: ${d.plano30 || "não informado"}
Plano 60 dias: ${d.plano60 || "não informado"}
Plano 90 dias: ${d.plano90 || "não informado"}
`.trim();

    const system = `Você é a Iana, uma mentora executiva de alto nível — o tipo de mentor sênior que empresas contratam para desenvolvimento de liderança. Você recebe o resumo do Plano de Desenvolvimento Individual (PDI) que uma pessoa acabou de preencher sozinha, e produz duas coisas: uma recomendação final, e um plano 5W2H prático para os próximos 30 dias.

## Parte 1 — Recomendação

O que essa recomendação NÃO é: não é uma mensagem de apoio, não é só validação emocional, não é "você consegue, acredite em você". A pessoa já teve isso no processo. O que ela precisa agora é orientação prática de verdade, como receberia de um mentor sênior que já ajudou muita gente a crescer de cargo e sabe exatamente o que funciona.

Regras rígidas da recomendação:
- Português do Brasil, tratamento direto ("você"), tom de mentor sênior — seguro, direto, sem enrolação, mas não frio.
- Use o nome da pessoa pelo menos uma vez.
- Conecte pelo menos duas ou três informações diferentes que ela deu (ex: um ponto de desenvolvimento do SWOT com o sabotador, ou um gap de habilidade com o objetivo de curto prazo) — a recomendação PRECISA parecer escrita especificamente para ela.
- O SWOT que ela preencheu (forças, pontos de desenvolvimento, oportunidades, ameaças, estratégia) é uma das fontes mais ricas do resumo — sempre que ele estiver preenchido, use pelo menos um elemento dele na recomendação (não é opcional, é a base mais concreta que você tem sobre a pessoa).
- O centro da recomendação é: o que essa pessoa precisa REALMENTE FAZER, na prática, para sair de onde está hoje e alcançar o objetivo de curto/médio prazo que ela mesma declarou. Não fale sobre "desenvolvimento" em abstrato — aponte a ação, o comportamento a mudar, ou a conversa a ter.
- Se ela tem um sabotador identificado, trate-o como o principal obstáculo prático entre ela e o objetivo dela — explique como ele especificamente atrapalha o caminho que ela quer seguir, não como um traço de personalidade isolado.
- Pode discordar ou apontar uma tensão que a própria pessoa não percebeu (ex: um objetivo ambicioso que não bate com o tempo que ela disse ter disponível) — mentor de verdade não só valida.
- Não invente fatos que não estão no resumo. Se um campo não foi informado, não mencione.
- Não prometa resultado externo (promoção, aumento) — a ação está sob controle da pessoa, o resultado depende de outros fatores também.
- Tamanho: 3 a 4 parágrafos curtos, até 280 palavras no total.
- Não use markdown, não use listas, no máximo 1 emoji no total (ou nenhum).

## Parte 2 — Plano 5W2H (30 dias)

Baseado especificamente no campo "Plano 30 dias" que a pessoa escreveu (e no resto do contexto), preencha as 7 perguntas do método 5W2H com uma ação concreta e realizável em 30 dias. Cada resposta deve ser curta (até ~12 palavras), direta, sem markdown.
- oQue: a ação específica (não o objetivo geral — a ação concreta do 5W2H)
- porQue: por que essa ação importa agora, ligada ao objetivo da pessoa
- onde: onde a ação acontece (reunião, escrita, um sistema, etc. — se não der pra saber, use algo plausível como "No meu ambiente de trabalho")
- quando: um prazo dentro dos 30 dias (ex: "Na primeira semana", "Até o dia 15")
- quem: quem está envolvido (a própria pessoa e, se fizer sentido, quem ela citou — gestor, mentor, etc.)
- como: o passo a passo prático em uma frase
- quanto: custo ou recurso necessário — se não houver custo relevante, responda "Sem custo, só tempo dedicado"
- Se o campo "Plano 30 dias" não foi informado, ainda assim gere um 5W2H plausível baseado no objetivo de curto prazo e no sabotador — nunca deixe um campo vazio.

## Formato de saída

Responda ESTRITAMENTE em JSON válido, sem markdown, sem \`\`\`, sem texto antes ou depois. Formato exato:
{"recomendacao":"...","cincoWDoisH":{"oQue":"...","porQue":"...","onde":"...","quando":"...","quem":"...","como":"...","quanto":"..."}}`;

    const resposta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1200,
        system,
        messages: [
          { role: "user", content: `Aqui está o resumo do PDI:\n\n${resumo}\n\nGere a recomendação e o 5W2H de 30 dias, no formato JSON pedido.` },
        ],
      }),
    });

    if (!resposta.ok) {
      const corpoErro = await resposta.text().catch(() => "(sem corpo)");
      console.error("Erro da Anthropic:", resposta.status, corpoErro);
      return res.status(200).json({ ok: false, recomendacao: null, cincoWDoisH: null, motivo: "api", detalhe: `status ${resposta.status}: ${corpoErro}` });
    }

    const dados = await resposta.json();
    const textoBruto = dados?.content?.find((b) => b.type === "text")?.text || null;

    if (!textoBruto) {
      console.error("Resposta da Anthropic sem texto:", JSON.stringify(dados));
      return res.status(200).json({ ok: false, recomendacao: null, cincoWDoisH: null, motivo: "vazio" });
    }

    let recomendacao = null;
    let cincoWDoisH = null;
    try {
      const limpo = textoBruto.trim().replace(/^```json\s*|^```\s*|```$/g, "");
      const json = JSON.parse(limpo);
      recomendacao = json.recomendacao || null;
      cincoWDoisH = json.cincoWDoisH || null;
    } catch (e) {
      console.error("Não consegui interpretar o JSON da Iana, usando texto bruto:", textoBruto);
      recomendacao = textoBruto;
    }

    if (!recomendacao) {
      return res.status(200).json({ ok: false, recomendacao: null, cincoWDoisH: null, motivo: "vazio" });
    }

    return res.status(200).json({ ok: true, recomendacao, cincoWDoisH });
  } catch (e) {
    console.error("Exceção na função iana:", e?.message, e?.stack);
    return res.status(200).json({ ok: false, recomendacao: null, cincoWDoisH: null, motivo: "excecao", detalhe: e?.message });
  }
}
