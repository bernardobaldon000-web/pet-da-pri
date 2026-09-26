/* ==========================================================================
   ARQUIVO DE CONFIGURAÇÃO DO NEGÓCIO - Pet da Pri
   ==========================================================================
   Site DEMONSTRATIVO montado com as informações reais de contato da Pet da
   Pri, mas com horários e alguns textos como EXEMPLO (marcados abaixo) —
   é só um protótipo para ela ver como ficaria, antes de fechar os detalhes
   finais.
   ========================================================================== */

window.SITE_CONFIG = {

    // --- Identidade ---
    nomeEmpresa: "Pet da Pri",
    tagline: "Banho, tosa e vacina com todo o carinho que o seu cão merece.",
    logoEmoji: "🐾",
    logoImagem: "images/logo.webp", // logo real da cliente; se preenchido, é usado no lugar do emoji
    tituloAba: "Pet da Pri - Banho, Tosa e Vacina",

    // --- Paleta de cores (baseada no ciano/turquesa do logo da Pet da Pri) ---
    cores: {
        primary: "#17a2b8",
        primaryDark: "#0f6674",
        accent: "#ff8552",
        bgLight: "#eafbfd",
    },

    // --- Contato (dados reais fornecidos) ---
    contato: {
        telefone: "(51) 99984-2681",
        whatsapp: "(51) 99984-2681",
        email: "fm.priscila@gmail.com",
        endereco: "Rua 3 de Outubro, 705 - Olaria - Camaquã/RS - CEP 96785-212",
        documento: "CNPJ: 30.322.736/0001-47",
        // Usado no mapa e nos botões "Abrir no Waze" / "Abrir no Google Maps"
        // da página de Contato (sem o CEP, que às vezes confunde a busca).
        enderecoParaMapa: "Rua 3 de Outubro, 705 - Olaria, Camaquã - RS",
    },

    // --- Horário de funcionamento --- (REAL, confirmado com a Priscila)
    // Segunda-feira: fechado. Terça a sexta: 9h às 18h.
    // Sábado: ela NÃO abre todo sábado — quando abre, é das 9h ao meio-dia.
    // Por isso o sábado não entra no cálculo automático de "aberto agora"
    // (ver exibirStatusDaLoja em main.js) — o site sempre manda confirmar
    // a disponibilidade de sábado pelo WhatsApp antes de agendar.
    horarios: {
        tercaSexta: { abre: 9, fecha: 18 },
        sabado: { abre: 9, fecha: 12 },
        sabadoNemSempreAbre: true,
        domingoFechado: true,
    },

    // --- Textos da página inicial ---
    home: {
        boasVindasTitulo: "Bem-vindo(a) à Pet da Pri!",
        boasVindasTexto:
            "A Pet da Pri cuida do banho, da tosa e da vacina do seu cão com atenção e carinho, em Camaquã/RS, " +
            "desde 2018. A Priscila é médica-veterinária formada pela UniRitter (2025), o que dá ainda mais " +
            "segurança na hora de cuidar do seu melhor amigo. Atendemos com hora marcada, no local ou com " +
            "tele-busca, para facilitar a vida de quem tem um cachorro em casa.",
        diferenciais: [
            "Atendimento exclusivo para cães.",
            "Desde 2018 cuidando dos cães de Camaquã/RS.",
            "Priscila é médica-veterinária formada pela UniRitter (2025).",
            "Banho, tosa e vacina com produtos de qualidade.",
            "Tele-busca disponível para sua comodidade.",
            "Agendamento fácil, direto pelo site ou WhatsApp.",
        ],
    },

    // --- Imagens do carrossel da home ---
    // O 1º slide é uma foto real de dois pugs clientes, tirada no espaço de
    // atendimento da Pet da Pri (dá pra ver o logo pintado na parede atrás -
    // images/dois-pugs-loja.webp). O 2º slide é o carro real da Pet da Pri,
    // usado na tele-busca (images/carro-tele-busca.webp). O 3º slide já é uma
    // foto real de dois cães clientes (images/slide3-cachorros.webp).
    carrossel: [
        { imagem: "images/dois-pugs-loja.webp", alt: "Dois pugs clientes da Pet da Pri no espaço de atendimento", titulo: "Banho, Tosa e Vacina", subtitulo: "Com todo o carinho que o seu cão merece.", posicao: "center top" },
        { imagem: "images/carro-tele-busca.webp", alt: "Carro da Pet da Pri usado na tele-busca", titulo: "Tele-busca disponível", subtitulo: "A gente busca e entrega o seu pet, sem você sair de casa.", posicao: "center 35%" },
        { imagem: "images/slide3-cachorros.webp", alt: "Dois cães clientes da Pet da Pri, sorridentes após o atendimento", titulo: "Cada cão, um cuidado especial", subtitulo: "Clientes que já confiam na Pet da Pri.", posicao: "center 20%" },
    ],
};
