/* ==========================================================================
   SERVIÇOS - Pet da Pri
   ==========================================================================
   A Pet da Pri não vende produtos, só presta serviço de banho, tosa e
   vacina — por isso não existe página de Produtos neste site.

   IMPORTANTE sobre a tele-busca: ela NÃO dá banho na casa do cliente. A
   tele-busca significa que ela busca o pet, faz o banho/tosa no espaço dela,
   e depois devolve o pet no endereço combinado. Isso é escolhido à parte,
   na página de Agendamento (opção "Entrega no local" ou "Tele-busca").

   ATENDIMENTO: só cães (a Priscila não atende gatos).

   PREÇO: banho a partir de R$ 40,00 (varia conforme o porte do cão) —
   confirmado com a Priscila em 17/09/2026. O combo Banho + Tosa fica entre
   R$ 75,00 e R$ 130,00, conforme o porte do cão — confirmado em 18/09/2026.
   A vacina não tem valor fixo no site: a Priscila prefere combinar o valor
   direto com o cliente, porque às vezes ela faz um combo com o banho.
   ========================================================================== */

window.SITE_DATA = {

    // Sem produtos à venda neste negócio — deixado vazio de propósito.
    categorias: [],

    // --- Serviços oferecidos ---
    // A forma de atendimento (local ou tele-busca) é escolhida separadamente
    // no formulário de agendamento, e vale para qualquer um dos serviços abaixo.
    servicos: [
        {
            nome: "Banho",
            descricao: "Banho completo, realizado no espaço de atendimento da Pet da Pri.",
            valor: "A partir de R$ 40,00 (varia conforme o porte do cão)",
        },
        {
            nome: "Tosa",
            descricao: "Tosa realizada no espaço de atendimento da Pet da Pri. Quando feita junto com o banho, o combo sai de R$ 75,00 a R$ 130,00, conforme o porte do cão.",
            valor: "Combo Banho + Tosa: de R$ 75,00 a R$ 130,00 (conforme o porte do cão)",
        },
        {
            nome: "Vacina",
            descricao: "Aplicação de vacinas para cães, realizada no espaço de atendimento da Pet da Pri.",
            valor: "Combine direto com a gente pelo WhatsApp (o valor pode variar se for feita junto com o banho)",
        },
    ],
};
