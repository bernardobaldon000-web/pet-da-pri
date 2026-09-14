/* ==========================================================================
   SERVIÇOS - Pet da Pri
   ==========================================================================
   A Pet da Pri não vende produtos, só presta serviço de banho e tosa — por
   isso não existe página de Produtos neste site.

   IMPORTANTE sobre a tele-busca: ela NÃO dá banho na casa do cliente. A
   tele-busca significa que ela busca o pet, faz o banho/tosa no espaço dela,
   e depois devolve o pet no endereço combinado. Isso é escolhido à parte,
   na página de Agendamento (opção "Entrega no local" ou "Tele-busca").

   PREÇO: banho confirmado em R$ 30,00. A tosa ainda não tem valor definido
   — assim que a Priscila confirmar, é só atualizar o campo "valor" abaixo.
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
            valor: "R$ 30,00",
        },
        {
            nome: "Tosa",
            descricao: "Tosa realizada no espaço de atendimento da Pet da Pri.",
            valor: "Valor a confirmar",
        },
    ],
};
