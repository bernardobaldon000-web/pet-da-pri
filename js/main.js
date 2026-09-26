/* ==========================================================================
   Template de site para comércio local - Motor do site.
   Lê window.SITE_CONFIG (js/config.js) e window.SITE_DATA (js/data.js) e
   monta o cabeçalho, rodapé, carrossel, listas de produtos/serviços e o
   formulário de agendamento automaticamente. Assim, trocar de cliente é só
   editar aqueles dois arquivos — este aqui normalmente não precisa mudar.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    aplicarCoresDaMarca();
    // Título da página já vem definido direto no HTML de cada página (bom para SEO);
    // o JS não sobrescreve mais para não atrapalhar a indexação pelo Google.

    renderizarCabecalho();
    renderizarRodape();

    renderizarCarrossel();          // só existe conteúdo se a página tiver #carrossel-container
    renderizarTextosHome();         // só se a página tiver os ids de texto da home
    renderizarFiltroECategorias();  // só se a página tiver #lista-categorias
    renderizarServicos();           // só se a página tiver #lista-servicos
    renderizarContato();            // só se a página tiver #contato-canais / #contato-horario
    esconderTextosDeConta();        // trechos .so-com-conta só aparecem com o login ativo

    atualizarAnoRodape();
    exibirStatusDaLoja();
    setInterval(exibirStatusDaLoja, 60000);

    inicializarFormularioAgendamento();
});

/* --------------------------------------------------------------------------
 * Aplica as cores definidas em SITE_CONFIG.cores nas variáveis CSS,
 * sobrescrevendo o fallback de css/style.css.
 * ------------------------------------------------------------------------ */
function aplicarCoresDaMarca() {
    const raiz = document.documentElement.style;
    raiz.setProperty("--cor-primaria", SITE_CONFIG.cores.primary);
    raiz.setProperty("--cor-primaria-escura", SITE_CONFIG.cores.primaryDark);
    raiz.setProperty("--cor-destaque", SITE_CONFIG.cores.accent);
    raiz.setProperty("--cor-fundo-claro", SITE_CONFIG.cores.bgLight);
}

/* --------------------------------------------------------------------------
 * Cabeçalho (navbar) - o mesmo em todas as páginas. A página atual é
 * detectada pelo nome do arquivo (window.location.pathname) para destacar
 * o link ativo no menu.
 * ------------------------------------------------------------------------ */
function renderizarCabecalho() {
    const alvo = document.getElementById("cabecalho");
    if (!alvo) return;

    const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
    const links = [
        { href: "index.html", texto: "Início" },
        { href: "quem-somos.html", texto: "Quem Somos" },
        { href: "servicos.html", texto: "Serviços" },
        { href: "agendamento.html", texto: "Cadastro e Agendamento" },
        { href: "contato.html", texto: "Contato" },
    ];
    // Link da área do cliente só aparece quando o login (Firebase) está ativo.
    if (window.FIREBASE_CONFIG) {
        links.push({ href: "entrar.html", texto: "Área do Cliente" });
    }

    const itensMenu = links.map(function (link) {
        const ativo = link.href === paginaAtual;
        return (
            '<li class="nav-item"><a class="nav-link' + (ativo ? " active" : "") + '" ' +
            (ativo ? 'aria-current="page" ' : "") +
            'href="' + link.href + '">' + link.texto + "</a></li>"
        );
    }).join("");

    // Usa a logo real (imagem) se SITE_CONFIG.logoImagem estiver preenchido;
    // caso contrário, cai no emoji + nome (comportamento padrão do template).
    const marca = SITE_CONFIG.logoImagem
        ? '<img src="' + SITE_CONFIG.logoImagem + '" alt="Logo ' + escaparTexto(SITE_CONFIG.nomeEmpresa) + '" width="57" height="40" class="d-inline-block align-text-top me-2" style="border-radius:6px;">' + escaparTexto(SITE_CONFIG.nomeEmpresa)
        : SITE_CONFIG.logoEmoji + " " + escaparTexto(SITE_CONFIG.nomeEmpresa);

    alvo.innerHTML =
        '<nav class="navbar navbar-expand-md navbar-negocio" aria-label="Menu principal">' +
        '  <div class="container">' +
        '    <a class="navbar-brand fw-bold d-flex align-items-center" href="index.html">' + marca + "</a>" +
        '    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false" aria-label="Abrir/fechar menu de navegação">' +
        '      <span class="navbar-toggler-icon"></span>' +
        "    </button>" +
        '    <div class="collapse navbar-collapse" id="menuPrincipal">' +
        '      <ul class="navbar-nav ms-auto">' + itensMenu + "</ul>" +
        "    </div>" +
        "  </div>" +
        "</nav>";
}

/* --------------------------------------------------------------------------
 * Rodapé - também compartilhado por todas as páginas.
 * ------------------------------------------------------------------------ */
function renderizarRodape() {
    const alvo = document.getElementById("rodape");
    if (!alvo) return;

    const c = SITE_CONFIG.contato;
    alvo.innerHTML =
        '<footer class="py-4 mt-4">' +
        '  <div class="container">' +
        "    <p class='mb-1'>" + escaparTexto(SITE_CONFIG.nomeEmpresa) + " - " + escaparTexto(c.documento) + "</p>" +
        "    <p class='mb-1'>Endereço: <a href='" + linkGoogleMaps() + "' target='_blank' rel='noopener'>" + escaparTexto(c.endereco) + "</a></p>" +
        "    <p class='mb-2'>" +
        "WhatsApp: <a href='" + linkWhatsAppSimples() + "' target='_blank' rel='noopener'>" + escaparTexto(c.whatsapp) + "</a>" +
        " | Telefone: <a href='" + linkTelefone() + "'>" + escaparTexto(c.telefone) + "</a>" +
        " | E-mail: <a href='mailto:" + escaparTexto(c.email) + "'>" + escaparTexto(c.email) + "</a></p>" +
        '    <nav aria-label="Links do rodapé">' +
        '      <a href="index.html">Início</a> | ' +
        '      <a href="quem-somos.html">Quem Somos</a> | ' +
        '      <a href="servicos.html">Serviços</a> | ' +
        '      <a href="agendamento.html">Cadastro e Agendamento</a> | ' +
        '      <a href="contato.html">Contato</a> | ' +
        '      <a href="termos.html">Termos e Privacidade</a>' +
        "    </nav>" +
        "    <p class='mt-2 mb-0'>&copy; <span id='ano-atual'></span> " + escaparTexto(SITE_CONFIG.nomeEmpresa) + ". Todos os direitos reservados.</p>" +
        "  </div>" +
        "</footer>";
}

function atualizarAnoRodape() {
    const spanAno = document.getElementById("ano-atual");
    if (spanAno) spanAno.textContent = new Date().getFullYear();
}

/* --------------------------------------------------------------------------
 * Carrossel da home, montado a partir de SITE_CONFIG.carrossel.
 * ------------------------------------------------------------------------ */
function renderizarCarrossel() {
    const alvo = document.getElementById("carrossel-container");
    if (!alvo) return;

    const slides = SITE_CONFIG.carrossel;
    const indicadores = slides.map(function (_, i) {
        return '<button type="button" data-bs-target="#carrosselPrincipal" data-bs-slide-to="' + i + '"' +
            (i === 0 ? ' class="active" aria-current="true"' : "") +
            ' aria-label="Slide ' + (i + 1) + '"></button>';
    }).join("");

    const itens = slides.map(function (slide, i) {
        // slide.posicao é opcional: permite ajustar o enquadramento do corte
        // (object-position) quando a foto não fica bem centralizada por padrão.
        const estiloPosicao = slide.posicao ? ' style="object-position: ' + slide.posicao + ';"' : "";
        // Lazy loading: só o 1º slide carrega na hora (é o que aparece
        // primeiro, então ganha prioridade). Os outros só são baixados
        // quando o carrossel estiver prestes a mostrá-los.
        const carregamento = i === 0
            ? ' loading="eager" fetchpriority="high"'
            : ' loading="lazy"';
        return (
            '<div class="carousel-item' + (i === 0 ? " active" : "") + '">' +
            '  <img src="' + slide.imagem + '" class="d-block w-100" alt="' + escaparTexto(slide.alt) + '"' +
            carregamento + ' decoding="async"' + estiloPosicao + '>' +
            '  <div class="carousel-caption d-none d-md-block">' +
            "    <h2>" + escaparTexto(slide.titulo) + "</h2>" +
            "    <p>" + escaparTexto(slide.subtitulo) + "</p>" +
            "  </div>" +
            "</div>"
        );
    }).join("");

    // O carrossel fica dentro de um .container (mesma largura do conteúdo
    // da página), com margens nas laterais e cantos arredondados, em vez
    // de ocupar 100% da largura da tela.
    alvo.className = "container pt-4";
    alvo.innerHTML =
        '<div id="carrosselPrincipal" class="carousel slide carrossel-home" data-bs-ride="carousel" aria-label="Destaques">' +
        '  <div class="carousel-indicators">' + indicadores + "</div>" +
        '  <div class="carousel-inner">' + itens + "</div>" +
        '  <button class="carousel-control-prev" type="button" data-bs-target="#carrosselPrincipal" data-bs-slide="prev">' +
        '    <span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Slide anterior</span>' +
        "  </button>" +
        '  <button class="carousel-control-next" type="button" data-bs-target="#carrosselPrincipal" data-bs-slide="next">' +
        '    <span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Próximo slide</span>' +
        "  </button>" +
        "</div>";
}

/* --------------------------------------------------------------------------
 * Textos da página inicial (título, saudação, diferenciais).
 * ------------------------------------------------------------------------ */
function renderizarTextosHome() {
    const tituloEl = document.getElementById("home-titulo-principal");
    if (!tituloEl) return; // só existe em index.html

    tituloEl.textContent = SITE_CONFIG.nomeEmpresa;
    document.getElementById("home-tagline").textContent = SITE_CONFIG.tagline;
    document.getElementById("home-boas-vindas-titulo").textContent = SITE_CONFIG.home.boasVindasTitulo;
    document.getElementById("home-boas-vindas-texto").textContent = SITE_CONFIG.home.boasVindasTexto;

    const listaDiferenciais = document.getElementById("home-diferenciais");
    listaDiferenciais.innerHTML = SITE_CONFIG.home.diferenciais.map(function (item) {
        return '<li class="col-md-6 mb-2">✅ ' + escaparTexto(item) + "</li>";
    }).join("");
}

/* --------------------------------------------------------------------------
 * Página de Produtos: filtro de categorias + grade de itens, tudo a
 * partir de SITE_DATA.categorias.
 * ------------------------------------------------------------------------ */
function renderizarFiltroECategorias() {
    const listaAlvo = document.getElementById("lista-categorias");
    if (!listaAlvo) return; // só existe em produtos.html

    const categorias = SITE_DATA.categorias;

    // Filtro
    const filtroAlvo = document.getElementById("filtro-categorias");
    const botaoTodos = '<button type="button" class="btn btn-outline-success btn-filtro active" data-categoria="todos" aria-pressed="true">Todos</button>';
    const botoesCategorias = categorias.map(function (cat) {
        return '<button type="button" class="btn btn-outline-success btn-filtro" data-categoria="' + cat.id + '" aria-pressed="false">' + escaparTexto(cat.nome) + "</button>";
    }).join("");
    filtroAlvo.innerHTML = botaoTodos + botoesCategorias;

    // Seções de categoria com os produtos
    listaAlvo.innerHTML = categorias.map(function (cat) {
        const cards = cat.itens.map(function (item) {
            return (
                '<div class="col">' +
                '  <article class="card card-produto h-100">' +
                '    <img src="' + item.imagem + '" class="card-img-top" alt="' + escaparTexto(item.alt) + '">' +
                '    <div class="card-body">' +
                '      <h3 class="h5 card-title">' + escaparTexto(item.nome) + "</h3>" +
                '      <p class="card-text">' + escaparTexto(item.descricao) + "</p>" +
                '      <p class="preco">Valor: ' + escaparTexto(item.valor) + "</p>" +
                "    </div>" +
                "  </article>" +
                "</div>"
            );
        }).join("");

        return (
            '<section class="categoria-produtos mb-5" data-categoria="' + cat.id + '">' +
            '  <h2 class="h3">Categoria: ' + escaparTexto(cat.nome) + "</h2>" +
            '  <div class="row row-cols-1 row-cols-md-2 g-4">' + cards + "</div>" +
            "</section>"
        );
    }).join("");

    inicializarFiltroDeProdutos();
}

function inicializarFiltroDeProdutos() {
    const botoes = document.querySelectorAll(".btn-filtro");
    if (botoes.length === 0) return;
    const secoes = document.querySelectorAll(".categoria-produtos");

    botoes.forEach(function (botao) {
        botao.addEventListener("click", function () {
            const categoriaAlvo = botao.getAttribute("data-categoria");
            botoes.forEach(function (b) {
                b.classList.remove("active");
                b.setAttribute("aria-pressed", "false");
            });
            botao.classList.add("active");
            botao.setAttribute("aria-pressed", "true");
            secoes.forEach(function (secao) {
                const mostrar = categoriaAlvo === "todos" || secao.dataset.categoria === categoriaAlvo;
                secao.classList.toggle("d-none", !mostrar);
            });
        });
    });
}

/* --------------------------------------------------------------------------
 * Página de Serviços, montada a partir de SITE_DATA.servicos.
 * ------------------------------------------------------------------------ */
function renderizarServicos() {
    const alvo = document.getElementById("lista-servicos");
    if (!alvo) return; // só existe em servicos.html

    alvo.innerHTML = SITE_DATA.servicos.map(function (servico) {
        return (
            '<div class="col">' +
            '  <article class="card card-servico h-100">' +
            '    <div class="card-body">' +
            '      <h2 class="h4 card-title">' + escaparTexto(servico.nome) + "</h2>" +
            '      <p class="card-text">' + escaparTexto(servico.descricao) + "</p>" +
            '      <p class="preco">Valor: ' + escaparTexto(servico.valor) + "</p>" +
            "    </div>" +
            "  </article>" +
            "</div>"
        );
    }).join("");
}

/* --------------------------------------------------------------------------
 * Página de Contato: canais e horário, a partir de SITE_CONFIG.
 * ------------------------------------------------------------------------ */
function renderizarContato() {
    const canais = document.getElementById("contato-canais");
    if (canais) {
        const c = SITE_CONFIG.contato;
        // Cada canal vira um link: WhatsApp abre a conversa, telefone já
        // inicia a ligação (no celular), e-mail abre o app de e-mail e o
        // endereço abre no Google Maps.
        canais.innerHTML =
            "<li class='mb-2'>💬 WhatsApp: <a href='" + linkWhatsAppSimples() + "' target='_blank' rel='noopener'>" + escaparTexto(c.whatsapp) + "</a></li>" +
            "<li class='mb-2'>📞 Telefone: <a href='" + linkTelefone() + "'>" + escaparTexto(c.telefone) + "</a></li>" +
            "<li class='mb-2'>✉️ E-mail: <a href='mailto:" + escaparTexto(c.email) + "'>" + escaparTexto(c.email) + "</a></li>" +
            "<li class='mb-3'>📍 Endereço: <a href='" + linkGoogleMaps() + "' target='_blank' rel='noopener'>" + escaparTexto(c.endereco) + "</a></li>" +
            "<li class='d-flex flex-wrap gap-2'>" +
            "  <a class='btn btn-success btn-sm' href='" + linkWhatsAppSimples() + "' target='_blank' rel='noopener'>Chamar no WhatsApp</a>" +
            "  <a class='btn btn-outline-secondary btn-sm' href='" + linkTelefone() + "'>Ligar agora</a>" +
            "</li>";
    }

    // Mapa + botões de rota (Waze e Google Maps)
    const mapa = document.getElementById("contato-mapa");
    if (mapa) {
        const endereco = encodeURIComponent(SITE_CONFIG.contato.enderecoParaMapa);
        mapa.innerHTML =
            '<div class="mapa-loja">' +
            '  <iframe src="https://www.google.com/maps?q=' + endereco + '&output=embed" ' +
            '    title="Mapa com a localização da ' + escaparTexto(SITE_CONFIG.nomeEmpresa) + '" loading="lazy" ' +
            '    referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
            "</div>" +
            '<div class="d-flex flex-wrap gap-2 mt-3">' +
            '  <a class="btn btn-waze" href="https://waze.com/ul?q=' + endereco + '&navigate=yes" target="_blank" rel="noopener">🚗 Ir com o Waze</a>' +
            '  <a class="btn btn-outline-primary" href="https://www.google.com/maps/dir/?api=1&destination=' + endereco + '" target="_blank" rel="noopener">🗺️ Ir com o Google Maps</a>' +
            "</div>";
    }

    const horarioTabela = document.getElementById("contato-horario");
    if (horarioTabela) {
        const h = SITE_CONFIG.horarios;
        horarioTabela.innerHTML =
            "<tr><th scope='row'>Segunda-feira</th><td>Fechado</td></tr>" +
            "<tr><th scope='row'>Terça a sexta-feira</th><td>" + h.tercaSexta.abre + "h às " + h.tercaSexta.fecha + "h</td></tr>" +
            "<tr><th scope='row'>Sábado</th><td>" + h.sabado.abre + "h às " + h.sabado.fecha + "h (nem todo sábado — confirme pelo WhatsApp)</td></tr>" +
            "<tr><th scope='row'>Domingo</th><td>" + (h.domingoFechado ? "Fechado" : "Consulte") + "</td></tr>";
    }
}

/* --------------------------------------------------------------------------
 * Saudação + status "aberto agora", usando SITE_CONFIG.horarios.
 * ------------------------------------------------------------------------ */
function exibirStatusDaLoja() {
    const caixaStatus = document.getElementById("status-loja");
    if (!caixaStatus) return;

    const agora = new Date();
    const hora = agora.getHours();
    const diaSemana = agora.getDay();
    const h = SITE_CONFIG.horarios;

    let saudacao;
    if (hora < 12) saudacao = "Bom dia";
    else if (hora < 18) saudacao = "Boa tarde";
    else saudacao = "Boa noite";

    // Terça a sexta: horário fixo, dá pra calcular "aberto agora" com segurança.
    // Segunda: sempre fechado. Sábado: a Priscila NÃO abre todo sábado, então
    // o site nunca afirma "aberto" automaticamente nesse dia — só avisa pra
    // confirmar pelo WhatsApp.
    let aberta = false;
    if (diaSemana >= 2 && diaSemana <= 5) {
        aberta = hora >= h.tercaSexta.abre && hora < h.tercaSexta.fecha;
    }

    const horaFormatada = agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    if (aberta) {
        // Aberto: mostra uma faixa discreta e verde na própria página.
        caixaStatus.className = "alert alert-success mt-4";
        caixaStatus.innerHTML = "<strong>" + saudacao + ", seja bem-vindo(a)!</strong> Estamos abertos agora (" + horaFormatada + ").";
        return;
    }

    // Fechado (ou sábado, que depende de confirmação): em vez da faixa
    // amarela no meio da página, o aviso aparece num pop-up. A faixa fica
    // escondida.
    caixaStatus.className = "d-none";
    caixaStatus.innerHTML = "";

    let titulo, mensagem;
    if (diaSemana === 6 && h.sabadoNemSempreAbre) {
        titulo = "Sábado é com hora marcada";
        mensagem = "Aos sábados o atendimento acontece só em alguns dias (" + h.sabado.abre + "h ao meio-dia). " +
            "Confirme a disponibilidade e agende pelo WhatsApp.";
    } else {
        titulo = "Estamos fechados agora";
        mensagem = "No momento estamos fechados (" + horaFormatada + "). " +
            "Voltamos " + proximaAbertura(agora) + ", mas você já pode deixar seu horário agendado!";
    }
    mostrarPopupLojaFechada(saudacao + "! " + titulo, mensagem);
}

/* Descreve quando a loja abre de novo (terça a sexta, SITE_CONFIG.horarios),
 * ex.: "amanhã às 9h" ou "na terça-feira às 9h". Sábado fica de fora de
 * propósito, porque ela não abre todo sábado. */
function proximaAbertura(agora) {
    const h = SITE_CONFIG.horarios.tercaSexta;
    const nomesDias = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
    for (let i = 0; i <= 7; i++) {
        const dia = new Date(agora);
        dia.setDate(agora.getDate() + i);
        const d = dia.getDay();
        if (d < 2 || d > 5) continue;
        if (i === 0 && agora.getHours() >= h.abre) continue; // hoje já passou do horário de abrir
        const quando = i === 0 ? "hoje" : i === 1 ? "amanhã" : (d === 6 ? "no " : "na ") + nomesDias[d];
        return quando + " às " + h.abre + "h";
    }
    return "em breve";
}

/* Pop-up (modal do Bootstrap) com o aviso de loja fechada. Aparece só uma
 * vez por visita: se a pessoa fechar e navegar pelo site, não volta a
 * aparecer a cada página (nem a cada minuto, quando o status é recalculado). */
let popupLojaFechadaJaExibido = false;
function mostrarPopupLojaFechada(titulo, mensagem) {
    if (popupLojaFechadaJaExibido) return;
    popupLojaFechadaJaExibido = true;
    try {
        if (sessionStorage.getItem("popupLojaFechadaVisto")) return;
        sessionStorage.setItem("popupLojaFechadaVisto", "1");
    } catch (e) { /* navegador bloqueando armazenamento: só mostra normalmente */ }

    if (!window.bootstrap || !bootstrap.Modal) return;

    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "popup-loja-fechada";
    modal.tabIndex = -1;
    modal.setAttribute("aria-labelledby", "popup-loja-fechada-titulo");
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
        '<div class="modal-dialog modal-dialog-centered">' +
        '  <div class="modal-content popup-fechado">' +
        '    <div class="modal-header border-0 pb-0">' +
        '      <h2 class="modal-title h5" id="popup-loja-fechada-titulo">🐾 ' + escaparTexto(titulo) + "</h2>" +
        '      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar aviso"></button>' +
        "    </div>" +
        '    <div class="modal-body">' +
        "      <p class='mb-2'>" + escaparTexto(mensagem) + "</p>" +
        "      <p class='small text-muted mb-0'>Horário: terça a sexta, das " + SITE_CONFIG.horarios.tercaSexta.abre + "h às " +
        SITE_CONFIG.horarios.tercaSexta.fecha + "h. Alguns sábados, das " + SITE_CONFIG.horarios.sabado.abre + "h ao meio-dia.</p>" +
        "    </div>" +
        '    <div class="modal-footer border-0 pt-0">' +
        '      <a href="' + linkWhatsAppSimples() + '" target="_blank" rel="noopener" class="btn btn-success">Falar no WhatsApp</a>' +
        '      <a href="agendamento.html" class="btn btn-destaque">Agendar horário</a>' +
        "    </div>" +
        "  </div>" +
        "</div>";
    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();
}

/* --------------------------------------------------------------------------
 * Formulário de Cadastro + Agendamento.
 * Os checkboxes de serviço são gerados a partir de SITE_DATA.servicos, e o
 * select de horário é gerado a partir de SITE_CONFIG.horarios.
 * ------------------------------------------------------------------------ */
function inicializarFormularioAgendamento() {
    const form = document.getElementById("form-agendamento");
    if (!form) return;

    // --- Checkboxes de serviço, gerados dinamicamente ---
    const containerServicos = document.getElementById("servicos-checkboxes");
    if (containerServicos) {
        containerServicos.innerHTML = SITE_DATA.servicos.map(function (s, i) {
            const id = "servico-" + i;
            return (
                '<div class="form-check form-check-inline">' +
                '  <input class="form-check-input" type="checkbox" name="servico" id="' + id + '" value="' + escaparTexto(s.nome) + '">' +
                '  <label class="form-check-label" for="' + id + '">' + escaparTexto(s.nome) + "</label>" +
                "</div>"
            );
        }).join("");
    }

    // --- Horários disponíveis, gerados a partir do horário de funcionamento ---
    const selectHorario = document.getElementById("horario-agendamento");
    if (selectHorario) {
        const h = SITE_CONFIG.horarios;
        const inicio = Math.min(h.tercaSexta.abre, h.sabado.abre);
        const fim = Math.max(h.tercaSexta.fecha, h.sabado.fecha);
        let opcoes = '<option value="" selected disabled>Selecione um horário</option>';
        for (let hora = inicio; hora < fim; hora++) {
            if (hora === 12) continue; // pausa de almoço
            const horaTexto = String(hora).padStart(2, "0") + ":00";
            opcoes += '<option value="' + horaTexto + '">' + horaTexto + "</option>";
        }
        selectHorario.innerHTML = opcoes;
    }

    // --- Data mínima = amanhã ---
    const campoData = document.getElementById("data-agendamento");
    if (campoData) {
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        campoData.min = amanha.toISOString().split("T")[0];
    }

    // --- Endereço obrigatório apenas se "Tele-busca" for selecionado ---
    const radiosAtendimento = document.querySelectorAll('input[name="atendimento"]');
    const campoEndereco = document.getElementById("endereco-cliente");
    const avisoEndereco = document.getElementById("aviso-endereco");
    function atualizarObrigatoriedadeEndereco() {
        const teleBuscaSelecionada = document.querySelector('input[name="atendimento"]:checked')?.value === "tele-busca";
        if (campoEndereco) {
            campoEndereco.required = teleBuscaSelecionada;
            if (avisoEndereco) avisoEndereco.classList.toggle("d-none", !teleBuscaSelecionada);
        }
    }
    radiosAtendimento.forEach(function (radio) {
        radio.addEventListener("change", atualizarObrigatoriedadeEndereco);
    });
    atualizarObrigatoriedadeEndereco();

    // --- Mostrar/ocultar observações de saúde do pet ---
    const checkSaude = document.getElementById("pet-restricao-saude");
    const areaObservacoes = document.getElementById("area-observacoes-saude");
    if (checkSaude && areaObservacoes) {
        checkSaude.addEventListener("change", function () {
            areaObservacoes.classList.toggle("d-none", !checkSaude.checked);
        });
    }

    // --- Envio do formulário ---
    form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const servicosMarcados = Array.from(document.querySelectorAll('input[name="servico"]:checked')).map(function (c) {
            return c.value;
        });
        const avisoServico = document.getElementById("aviso-servico");
        if (servicosMarcados.length === 0) {
            avisoServico.classList.remove("d-none");
            return;
        }
        avisoServico.classList.add("d-none");

        const dados = coletarDadosAgendamento(servicosMarcados);
        montarResumoAgendamento(dados);

        // Abre o WhatsApp em outra aba, com a mensagem já pronta para o
        // cliente só conferir e apertar enviar. Como isso acontece dentro
        // do clique de envio do formulário, o navegador não bloqueia o popup.
        window.open(construirLinkWhatsApp(dados), "_blank");

        // Avisa a área do cliente (js/conta.js), se estiver ativa, para
        // salvar a ficha e o pedido na conta do cliente.
        document.dispatchEvent(new CustomEvent("agendamento-enviado", { detail: dados }));
    });
}

/* Lê todos os campos do formulário e devolve um objeto único com os dados
 * já formatados, reaproveitado tanto no resumo na tela quanto na mensagem
 * do WhatsApp. */
function coletarDadosAgendamento(servicosMarcados) {
    const atendimento = document.querySelector('input[name="atendimento"]:checked').value;
    const data = document.getElementById("data-agendamento").value;

    return {
        nomeCliente: document.getElementById("nome-cliente").value,
        telefoneCliente: document.getElementById("telefone-cliente").value,
        nomePet: document.getElementById("nome-pet").value,
        racaPet: document.getElementById("raca-pet").value,
        servicosTexto: servicosMarcados.join(" + "),
        atendimentoTexto: atendimento === "tele-busca" ? "Tele-busca (vocês buscam e devolvem o pet)" : "Entrega no local (eu levo e busco o pet)",
        enderecoCliente: document.getElementById("endereco-cliente")?.value || "",
        dataFormatada: new Date(data + "T00:00:00").toLocaleDateString("pt-BR"),
        horario: document.getElementById("horario-agendamento").value,
    };
}

/* Monta o link https://wa.me/... com o número da empresa (SITE_CONFIG.contato.whatsapp)
 * e a mensagem de agendamento já preenchida e codificada para a URL. */
function construirLinkWhatsApp(dados) {
    const numeroComPais = numeroComDDI(SITE_CONFIG.contato.whatsapp);

    let texto = "Olá! Gostaria de agendar um horário:\n\n";
    texto += "*Cliente:* " + dados.nomeCliente + "\n";
    texto += "*Telefone:* " + dados.telefoneCliente + "\n";
    texto += "*Pet:* " + dados.nomePet + " (" + dados.racaPet + ")\n";
    texto += "*Serviço(s):* " + dados.servicosTexto + "\n";
    texto += "*Forma de atendimento:* " + dados.atendimentoTexto + "\n";
    if (dados.enderecoCliente) {
        texto += "*Endereço:* " + dados.enderecoCliente + "\n";
    }
    texto += "*Data e horário desejados:* " + dados.dataFormatada + " às " + dados.horario + "\n";
    texto += "\nAguardo a confirmação, obrigado(a)!";

    return "https://wa.me/" + numeroComPais + "?text=" + encodeURIComponent(texto);
}

function montarResumoAgendamento(dados) {
    const resumo = document.getElementById("resumo-agendamento");
    resumo.innerHTML =
        "<h3 class='h5'>Resumo do agendamento</h3>" +
        "<p><strong>Cliente:</strong> " + escaparTexto(dados.nomeCliente) + "</p>" +
        "<p><strong>Pet:</strong> " + escaparTexto(dados.nomePet) + " (" + escaparTexto(dados.racaPet) + ")</p>" +
        "<p><strong>Serviço(s):</strong> " + escaparTexto(dados.servicosTexto) + "</p>" +
        "<p><strong>Forma de atendimento:</strong> " + escaparTexto(dados.atendimentoTexto) + "</p>" +
        "<p><strong>Data e horário:</strong> " + dados.dataFormatada + " às " + dados.horario + "</p>" +
        "<p class='mb-2'>Abrimos o WhatsApp em outra aba com a mensagem pronta — é só conferir e apertar enviar!</p>" +
        '<a href="' + construirLinkWhatsApp(dados) + '" target="_blank" rel="noopener" class="btn btn-success btn-sm">' +
        "Abrir WhatsApp novamente</a>";

    resumo.classList.remove("d-none");
    resumo.setAttribute("tabindex", "-1");
    resumo.focus();
    resumo.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* Trechos marcados com .so-com-conta falam da Área do Cliente e só aparecem
 * quando o login (Firebase) está ativo. */
function esconderTextosDeConta() {
    const temConta = !!window.FIREBASE_CONFIG;
    document.querySelectorAll(".so-com-conta").forEach(function (el) {
        el.classList.toggle("d-none", !temConta);
    });
}

/* --------------------------------------------------------------------------
 * Links de contato reaproveitados no site todo.
 * ------------------------------------------------------------------------ */
function numeroComDDI(numero) {
    const digitos = String(numero).replace(/\D/g, "");
    return digitos.startsWith("55") ? digitos : "55" + digitos;
}
function linkWhatsAppSimples() {
    const texto = "Olá! Vim pelo site da " + SITE_CONFIG.nomeEmpresa + " e gostaria de mais informações.";
    return "https://wa.me/" + numeroComDDI(SITE_CONFIG.contato.whatsapp) + "?text=" + encodeURIComponent(texto);
}
function linkTelefone() {
    return "tel:+" + numeroComDDI(SITE_CONFIG.contato.telefone);
}
function linkGoogleMaps() {
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SITE_CONFIG.contato.enderecoParaMapa);
}

function escaparTexto(texto) {
    const div = document.createElement("div");
    div.textContent = texto == null ? "" : texto;
    return div.innerHTML;
}
