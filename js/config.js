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
    tagline: "Banho e tosa com todo o carinho que o seu pet merece.",
    logoEmoji: "🐾",
    logoImagem: "images/logo.png", // logo real da cliente; se preenchido, é usado no lugar do emoji
    tituloAba: "Pet da Pri - Banho e Tosa",

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
        endereco: "Rua 3 de Outubro, 705 - Olaria - Camaquã/RS - CEP 96180-000",
        documento: "CNPJ: 30.322.736/0001-47",
    },

    // --- Horário de funcionamento --- (EXEMPLO — confirmar o horário real com a Priscila)
    horarios: {
        segSex: { abre: 8, fecha: 18 },
        sabado: { abre: 8, fecha: 13 },
        domingoFechado: true,
    },

    // --- Textos da página inicial ---
    home: {
        boasVindasTitulo: "Bem-vindo(a) à Pet da Pri!",
        boasVindasTexto:
            "A Pet da Pri cuida do banho e da tosa do seu pet com atenção e carinho, em Camaquã/RS. " +
            "Atendemos com hora marcada, no local ou com tele-busca, para facilitar a vida de quem tem " +
            "um cão ou gato em casa.",
        diferenciais: [
            "Atendimento próximo e de confiança, direto com a Priscila.",
            "Banho e tosa com produtos de qualidade.",
            "Tele-busca disponível para sua comodidade.",
            "Agendamento fácil, direto pelo site ou WhatsApp.",
        ],
    },

    // --- Imagens do carrossel da home ---
    // EXEMPLO: banners gerados como placeholder. O ideal é trocar por fotos
    // reais do espaço, do atendimento ou de pets já atendidos pela Priscila.
    carrossel: [
        { imagem: "images/slide1.svg", alt: "Banho e Tosa - Pet da Pri", titulo: "Banho e Tosa", subtitulo: "Com todo o carinho que o seu pet merece." },
        { imagem: "images/slide2.svg", alt: "Tele-busca disponível", titulo: "Tele-busca disponível", subtitulo: "A gente busca e entrega o seu pet, sem você sair de casa." },
        { imagem: "images/slide3.svg", alt: "Agende pelo site", titulo: "Agende pelo site", subtitulo: "Escolha o dia e horário em poucos cliques." },
    ],
};
