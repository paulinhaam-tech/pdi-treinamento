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
      motivo: "config",
    });
  }

  try {
    const d = req.body || {};

    // Monta um resumo compacto do PDI da pessoa — só o essencial pra gerar
    // uma recomendação de verdade específica, sem mandar o objeto inteiro.
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
Estratégia SWOT da pessoa: ${d.estrategia || "não informada"}
Gaps de habilidades (nota baixa): ${gaps.join(", ") || "nenhum crítico"}
Áreas da Roda da Vida com nota baixa: ${areasRodaBaixas.join(" | ") || "nenhuma crítica"}
Sabotador principal: ${d.sabotadorPrincipal || "não identificado"}
Meta contra o sabotador: ${d.sabMeta || "não informada"}
Plano 30 dias: ${d.plano30 || "não informado"}
Plano 60 dias: ${d.plano60 || "não informado"}
Plano 90 dias: ${d.plano90 || "não informado"}
`.trim();

    const system = `Você é a Iana, uma mentora executiva de alto nível — o tipo de mentor sênior que empresas contratam para desenvolvimento de liderança. Você recebe o resumo do Plano de Desenvolvimento Individual (PDI) que uma pessoa acabou de preencher sozinha, e escreve a recomendação final dela.

O que essa recomendação NÃO é: não é uma mensagem de apoio, não é só validação emocional, não é "você consegue, acredite em você". A pessoa já teve isso no processo. O que ela precisa agora é orientação prática de verdade, como receberia de um mentor sênior que já ajudou muita gente a crescer de cargo e sabe exatamente o que funciona.

Regras rígidas:
- Português do Brasil, tratamento direto ("você"), tom de mentor sênior — seguro, direto, sem enrolação, mas não frio.
- Use o nome da pessoa pelo menos uma vez.
- Conecte pelo menos duas ou três informações diferentes que ela deu (ex: um ponto de desenvolvimento do SWOT com o sabotador, ou um gap de habilidade com o objetivo de curto prazo) — a recomendação PRECISA parecer escrita especificamente para ela.
- O centro da recomendação é: o que essa pessoa precisa REALMENTE FAZER, na prática, para sair de onde está hoje e alcançar o objetivo de curto/médio prazo que ela mesma declarou. Não fale sobre "desenvolvimento" em abstrato — aponte a ação, o comportamento a mudar, ou a conversa a ter.
- Se ela tem um sabotador identificado, trate-o como o principal obstáculo prático entre ela e o objetivo dela — explique como ele especificamente atrapalha o caminho que ela quer seguir, não como um traço de personalidade isolado.
- Pode discordar ou apontar uma tensão que a própria pessoa não percebeu (ex: um objetivo ambicioso que não bate com o tempo que ela disse ter disponível) — mentor de verdade não só valida.
- Não invente fatos que não estão no resumo. Se um campo não foi informado, não mencione.
- Não prometa resultado externo (promoção, aumento) — a ação está sob controle da pessoa, o resultado depende de outros fatores também.
- Tamanho: 3 a 4 parágrafos curtos, até 280 palavras no total. Suficiente pra ter profundidade real, sem virar ensaio.
- Não use markdown, não use listas, no máximo 1 emoji no total (ou nenhum).`;

    const resposta = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 900,
        system,
        messages: [
          { role: "user", content: `Aqui está o resumo do PDI:\n\n${resumo}\n\nEscreva a recomendação final da Iana para essa pessoa.` },
        ],
      }),
    });

    if (!resposta.ok) {
      const corpoErro = await resposta.text().catch(() => "(sem corpo)");
      console.error("Erro da Anthropic:", resposta.status, corpoErro);
      return res.status(200).json({ ok: false, recomendacao: null, motivo: "api", detalhe: `status ${resposta.status}: ${corpoErro}` });
    }

    const dados = await resposta.json();
    const texto = dados?.content?.find((b) => b.type === "text")?.text || null;

    if (!texto) {
      console.error("Resposta da Anthropic sem texto:", JSON.stringify(dados));
      return res.status(200).json({ ok: false, recomendacao: null, motivo: "vazio" });
    }

    return res.status(200).json({ ok: true, recomendacao: texto });
  } catch (e) {
    console.error("Exceção na função iana:", e?.message, e?.stack);
    return res.status(200).json({ ok: false, recomendacao: null, motivo: "excecao", detalhe: e?.message });
  }
}
