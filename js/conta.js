/* ==========================================================================
   ÁREA DO CLIENTE - login, cadastro e ficha do cliente (Firebase)
   ==========================================================================
   Usado em duas páginas:
   - entrar.html: entrar, criar conta e "esqueci minha senha".
   - agendamento.html: exige login, preenche o formulário com a ficha salva
     do cliente e, ao enviar, salva a ficha e o pedido de agendamento.

   Se js/firebase-config.js ainda não estiver preenchido, este arquivo não
   faz nada e o site continua funcionando como antes (sem login).
   ========================================================================== */

const VERSAO_FIREBASE = "12.19.0";
const CDN = "https://www.gstatic.com/firebasejs/" + VERSAO_FIREBASE + "/";

const config = window.FIREBASE_CONFIG;
const paginaEntrar = document.getElementById("pagina-entrar");
const formAgendamento = document.getElementById("form-agendamento");

if (!config) {
    if (paginaEntrar) {
        paginaEntrar.innerHTML =
            '<div class="alert alert-warning">A área do cliente ainda não foi ativada. ' +
            'Enquanto isso, você pode <a href="agendamento.html">agendar direto pelo WhatsApp</a>.</div>';
    }
} else {
    iniciar().catch(function (erro) {
        // Se o Firebase não carregar (sem internet, bloqueador etc.), o
        // formulário antigo continua funcionando normalmente.
        console.error("Não foi possível carregar a área do cliente:", erro);
        mostrar("form-agendamento", true);
        mostrar("area-login-necessario", false);
        mostrar("carregando-conta", false);
    });
}

async function iniciar() {
    // No agendamento, esconde o formulário até saber se a pessoa está logada.
    if (formAgendamento) {
        mostrar("form-agendamento", false);
        mostrar("carregando-conta", true);
    }

    const [{ initializeApp }, auth, fs] = await Promise.all([
        import(CDN + "firebase-app.js"),
        import(CDN + "firebase-auth.js"),
        import(CDN + "firebase-firestore.js"),
    ]);

    const app = initializeApp(config);
    const autenticacao = auth.getAuth(app);
    autenticacao.languageCode = "pt";
    const banco = fs.getFirestore(app);

    const ctx = { auth, fs, autenticacao, banco };

    if (paginaEntrar) iniciarPaginaEntrar(ctx);
    if (formAgendamento) iniciarAgendamento(ctx);
}

/* ==========================================================================
   PÁGINA ENTRAR (entrar.html)
   ========================================================================== */
function iniciarPaginaEntrar(ctx) {
    const { auth, autenticacao } = ctx;
    const destino = paginaDeRetorno();

    auth.onAuthStateChanged(autenticacao, function (usuario) {
        mostrar("bloco-conectado", !!usuario);
        mostrar("bloco-desconectado", !usuario);
        if (usuario) {
            document.getElementById("email-conectado").textContent = usuario.email;
            carregarMeusDados(ctx, usuario);
        }
    });

    iniciarMeusDados(ctx);

    // --- Entrar ---
    document.getElementById("form-entrar").addEventListener("submit", async function (e) {
        e.preventDefault();
        const form = e.target;
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const email = form.querySelector("#entrar-email").value.trim();
        const senha = form.querySelector("#entrar-senha").value;
        await comBotaoCarregando(form, "Entrando...", async function () {
            try {
                await auth.signInWithEmailAndPassword(autenticacao, email, senha);
                // Veio de um atalho da página de privacidade (#meus-dados ou
                // #excluir-conta)? Fica aqui mesmo, mostrando essa parte.
                if (window.location.hash) {
                    abrirAtalhoDoEndereco();
                } else {
                    window.location.href = destino;
                }
            } catch (erro) {
                mensagem("msg-entrar", traduzirErro(erro), "danger");
            }
        });
    });

    // --- Esqueci minha senha ---
    document.getElementById("link-esqueci").addEventListener("click", async function (e) {
        e.preventDefault();
        const email = document.getElementById("entrar-email").value.trim();
        if (!email) {
            mensagem("msg-entrar", "Digite seu e-mail no campo acima e clique de novo em \"Esqueci minha senha\".", "warning");
            document.getElementById("entrar-email").focus();
            return;
        }
        try {
            await auth.sendPasswordResetEmail(autenticacao, email);
            mensagem("msg-entrar", "Se existir uma conta com esse e-mail, enviamos um link para criar uma nova senha. Confira também a caixa de spam.", "success");
        } catch (erro) {
            mensagem("msg-entrar", traduzirErro(erro), "danger");
        }
    });

    // --- Criar conta ---
    document.getElementById("form-criar").addEventListener("submit", async function (e) {
        e.preventDefault();
        const form = e.target;
        const senha = form.querySelector("#criar-senha");
        const confirmar = form.querySelector("#criar-senha-confirmar");
        confirmar.setCustomValidity(senha.value !== confirmar.value ? "As senhas não são iguais." : "");
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const email = form.querySelector("#criar-email").value.trim();
        await comBotaoCarregando(form, "Criando conta...", async function () {
            try {
                const credencial = await auth.createUserWithEmailAndPassword(autenticacao, email, senha.value);
                auth.sendEmailVerification(credencial.user).catch(function () {});
                // Conta criada: vai para o agendamento completar o cadastro.
                window.location.href = "agendamento.html?novo=1";
            } catch (erro) {
                mensagem("msg-criar", traduzirErro(erro), "danger");
            }
        });
    });

    document.getElementById("criar-senha-confirmar").addEventListener("input", function (e) {
        e.target.setCustomValidity("");
    });

    // --- Sair ---
    document.getElementById("botao-sair").addEventListener("click", function () {
        auth.signOut(autenticacao);
    });
}

/* ==========================================================================
   MEUS DADOS (entrar.html): ver, baixar cópia e excluir a conta (LGPD)
   ========================================================================== */
let dadosCarregados = null;

async function buscarTudo(ctx, usuario) {
    const { fs, banco } = ctx;
    const refFicha = fs.doc(banco, "clientes", usuario.uid);
    const [ficha, pedidos] = await Promise.all([
        fs.getDoc(refFicha),
        fs.getDocs(fs.collection(banco, "clientes", usuario.uid, "agendamentos")),
    ]);
    const listaPedidos = [];
    pedidos.forEach(function (d) { listaPedidos.push(Object.assign({ id: d.id, ref: d.ref }, d.data())); });
    listaPedidos.sort(function (a, b) { return String(b.data).localeCompare(String(a.data)); });
    return { email: usuario.email, ficha: ficha.exists() ? ficha.data() : null, pedidos: listaPedidos };
}

async function carregarMeusDados(ctx, usuario) {
    const alvo = document.getElementById("meus-dados-conteudo");
    if (!alvo) return;
    try {
        dadosCarregados = await buscarTudo(ctx, usuario);
    } catch (erro) {
        console.error(erro);
        alvo.innerHTML = '<p class="text-danger mb-0">Não conseguimos carregar seus dados agora. Tente de novo em instantes.</p>';
        return;
    }
    alvo.textContent = "";
    linhasDosDados(dadosCarregados).forEach(function (grupo) {
        const h = document.createElement("h3");
        h.className = "h6 mt-3 mb-1";
        h.textContent = grupo.titulo;
        alvo.appendChild(h);
        const dl = document.createElement("dl");
        dl.className = "row mb-0 small";
        grupo.itens.forEach(function (item) {
            const dt = document.createElement("dt");
            dt.className = "col-sm-4 fw-semibold";
            dt.textContent = item[0];
            const dd = document.createElement("dd");
            dd.className = "col-sm-8 mb-1";
            dd.textContent = item[1] || "—";
            dl.appendChild(dt);
            dl.appendChild(dd);
        });
        alvo.appendChild(dl);
    });
    abrirAtalhoDoEndereco();
}

// Transforma os dados em grupos de linhas legíveis (usado na tela e no arquivo baixado).
function linhasDosDados(dados) {
    const f = dados.ficha || {};
    const pet = f.pet || {};
    const sexo = { feminino: "Feminino", masculino: "Masculino", "prefiro-nao-informar": "Prefiro não informar" };
    const porte = { pequeno: "Pequeno", medio: "Médio", grande: "Grande" };
    const grupos = [
        { titulo: "Você", itens: [
            ["E-mail da conta", dados.email],
            ["Nome", f.nome], ["CPF", f.cpf], ["Telefone", f.telefone],
            ["Endereço", f.endereco], ["Sexo", sexo[f.sexo]],
            ["Lembretes no WhatsApp", dados.ficha ? (f.aceitaWhatsapp ? "Sim" : "Não") : ""],
        ] },
        { titulo: "Seu cão", itens: [
            ["Nome", pet.nome], ["Raça", pet.raca], ["Idade", pet.idade ? pet.idade + " ano(s)" : ""],
            ["Porte", porte[pet.porte]],
            ["Cuidados de saúde", pet.restricaoSaude ? (pet.observacoesSaude || "Sim") : (dados.ficha ? "Nenhum informado" : "")],
        ] },
    ];
    const pedidos = dados.pedidos.map(function (p) {
        const data = p.data ? p.data.split("-").reverse().join("/") : "";
        return [data + (p.horario ? " às " + p.horario : ""), (p.servicos || []).join(" + ") + (p.atendimento === "tele-busca" ? " (tele-busca)" : "")];
    });
    grupos.push({ titulo: "Pedidos de agendamento (" + pedidos.length + ")", itens: pedidos.length ? pedidos : [["Nenhum pedido ainda", ""]] });
    return grupos;
}

function iniciarMeusDados(ctx) {
    const { auth, fs, autenticacao } = ctx;
    const formExcluir = document.getElementById("excluir-conta");
    if (!formExcluir) return;

    document.getElementById("link-apagar-whatsapp").href = linkWhatsAppMensagem("Olá! Gostaria que vocês apagassem todos os meus dados, inclusive as conversas (LGPD).");

    // --- Baixar uma cópia (arquivo de texto fácil de ler) ---
    document.getElementById("botao-baixar-dados").addEventListener("click", function () {
        if (!dadosCarregados) return;
        let texto = "MEUS DADOS NA PET DA PRI\nGerado em " + new Date().toLocaleString("pt-BR") + "\n";
        linhasDosDados(dadosCarregados).forEach(function (g) {
            texto += "\n== " + g.titulo + " ==\n";
            g.itens.forEach(function (i) { texto += i[0] + (i[1] ? ": " + i[1] : "") + "\n"; });
        });
        const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "meus-dados-pet-da-pri.txt";
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(function () { URL.revokeObjectURL(link.href); }, 1000);
    });

    // --- Excluir conta ---
    document.getElementById("botao-abrir-excluir").addEventListener("click", function () {
        abrirExclusao();
    });
    document.getElementById("botao-cancelar-excluir").addEventListener("click", function () {
        mostrar("excluir-conta", false);
    });
    formExcluir.addEventListener("submit", async function (e) {
        e.preventDefault();
        if (!formExcluir.checkValidity()) { formExcluir.reportValidity(); return; }
        const usuario = autenticacao.currentUser;
        if (!usuario) return;
        const senha = document.getElementById("excluir-senha").value;
        await comBotaoCarregando(formExcluir, "Excluindo...", async function () {
            try {
                // O Firebase exige confirmar a senha antes de apagar a conta.
                await auth.reauthenticateWithCredential(usuario, auth.EmailAuthProvider.credential(usuario.email, senha));
                const dados = await buscarTudo(ctx, usuario);
                for (const p of dados.pedidos) await fs.deleteDoc(p.ref);
                await fs.deleteDoc(fs.doc(ctx.banco, "clientes", usuario.uid));
                await auth.deleteUser(usuario);
                document.getElementById("pagina-entrar").innerHTML =
                    '<div class="alert alert-success"><strong>Pronto, sua conta foi excluída.</strong> ' +
                    'Todos os seus dados e os do seu cão foram apagados. Se quiser voltar, é só criar uma conta nova. 🐾</div>';
                window.scrollTo({ top: 0, behavior: "smooth" });
            } catch (erro) {
                console.error(erro);
                const senhaErrada = erro && (erro.code === "auth/invalid-credential" || erro.code === "auth/wrong-password");
                mensagem("msg-excluir", senhaErrada ? "Senha incorreta. Nada foi apagado." : traduzirErro(erro), "danger");
            }
        });
    });
}

function abrirExclusao() {
    mostrar("excluir-conta", true);
    const form = document.getElementById("excluir-conta");
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    document.getElementById("excluir-senha").focus({ preventScroll: true });
}

// Atalhos vindos da página de privacidade: entrar.html#meus-dados e #excluir-conta
function abrirAtalhoDoEndereco() {
    const hash = window.location.hash;
    if (hash === "#excluir-conta") {
        abrirExclusao();
    } else if (hash === "#meus-dados") {
        const el = document.getElementById("meus-dados");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function linkWhatsAppMensagem(texto) {
    return "https://wa.me/" + numeroComDDI(SITE_CONFIG.contato.whatsapp) + "?text=" + encodeURIComponent(texto);
}

/* ==========================================================================
   AGENDAMENTO (agendamento.html)
   ========================================================================== */
function iniciarAgendamento(ctx) {
    const { auth, fs, autenticacao, banco } = ctx;
    let usuarioAtual = null;

    document.getElementById("link-entrar-agendamento").href = "entrar.html?voltar=agendamento.html";
    document.getElementById("botao-sair-agendamento").addEventListener("click", function () {
        auth.signOut(autenticacao);
    });
    document.getElementById("botao-editar-cadastro").addEventListener("click", function () {
        mostrar("resumo-cadastro", false);
        mostrar("bloco-cadastro", true);
        document.getElementById("nome-cliente").focus();
    });

    auth.onAuthStateChanged(autenticacao, async function (usuario) {
        usuarioAtual = usuario;
        mostrar("carregando-conta", false);

        if (!usuario) {
            mostrar("area-login-necessario", true);
            mostrar("barra-usuario", false);
            mostrar("form-agendamento", false);
            return;
        }

        mostrar("area-login-necessario", false);
        mostrar("barra-usuario", true);
        document.getElementById("email-usuario").textContent = usuario.email;

        const campoEmail = document.getElementById("email-cliente");
        campoEmail.value = usuario.email;
        campoEmail.defaultValue = usuario.email; // "Limpar formulário" não apaga o e-mail da conta
        campoEmail.readOnly = true;

        let ficha = null;
        try {
            const doc = await fs.getDoc(fs.doc(banco, "clientes", usuario.uid));
            if (doc.exists()) ficha = doc.data();
        } catch (erro) {
            console.error("Erro ao carregar a ficha do cliente:", erro);
        }

        if (ficha) {
            preencherFormulario(ficha);
            mostrarResumoCadastro(ficha);
            mostrar("bloco-cadastro", false);
            mostrar("resumo-cadastro", true);
            mostrar("aviso-completar-cadastro", false);
        } else {
            // Primeiro acesso: pede para completar os dados uma única vez.
            mostrar("bloco-cadastro", true);
            mostrar("resumo-cadastro", false);
            mostrar("aviso-completar-cadastro", true);
        }
        mostrar("form-agendamento", true);
    });

    // Se faltar algum dado obrigatório na ficha (que pode estar recolhida),
    // reabre a ficha antes da validação do main.js mostrar o erro.
    document.addEventListener("submit", function (e) {
        if (e.target === formAgendamento && !formAgendamento.checkValidity()) {
            mostrar("resumo-cadastro", false);
            mostrar("bloco-cadastro", true);
        }
    }, true);

    // main.js dispara este evento depois de validar o formulário e abrir o
    // WhatsApp. Aqui salvamos a ficha e o pedido no Firebase.
    document.addEventListener("agendamento-enviado", async function () {
        if (!usuarioAtual) return;
        const uid = usuarioAtual.uid;
        const ficha = lerFichaDoFormulario(usuarioAtual.email);
        const pedido = lerPedidoDoFormulario();
        const status = document.getElementById("status-salvamento");
        try {
            await fs.setDoc(fs.doc(banco, "clientes", uid), Object.assign({}, ficha, {
                atualizadoEm: fs.serverTimestamp(),
            }));
            await fs.addDoc(fs.collection(banco, "clientes", uid, "agendamentos"), Object.assign({}, pedido, {
                status: "solicitado",
                criadoEm: fs.serverTimestamp(),
            }));
            mostrarResumoCadastro(ficha);
            if (status) {
                status.className = "small text-success mb-2";
                status.textContent = "✔ Seus dados ficaram salvos na sua conta. No próximo agendamento, é só escolher o serviço e o horário.";
            }
        } catch (erro) {
            console.error("Erro ao salvar no Firebase:", erro);
            if (status) {
                status.className = "small text-danger mb-2";
                status.textContent = "Não conseguimos salvar seus dados na conta agora, mas a mensagem do WhatsApp foi aberta normalmente.";
            }
        }
    });
}

/* --- Leitura e preenchimento do formulário --- */
function valor(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}
function marcado(id) {
    const el = document.getElementById(id);
    return !!(el && el.checked);
}
function radioMarcado(nome) {
    const el = document.querySelector('input[name="' + nome + '"]:checked');
    return el ? el.value : "";
}

function lerFichaDoFormulario(email) {
    return {
        nome: valor("nome-cliente"),
        cpf: valor("cpf-cliente"),
        telefone: valor("telefone-cliente"),
        email: email,
        endereco: valor("endereco-cliente"),
        sexo: radioMarcado("sexo-cliente"),
        aceitaWhatsapp: marcado("aceita-whatsapp"),
        aceiteTermosEm: new Date().toISOString(),
        pet: {
            nome: valor("nome-pet"),
            raca: valor("raca-pet"),
            idade: valor("idade-pet"),
            porte: radioMarcado("porte-pet"),
            restricaoSaude: marcado("pet-restricao-saude"),
            observacoesSaude: valor("observacoes-saude"),
        },
    };
}

function lerPedidoDoFormulario() {
    return {
        servicos: Array.from(document.querySelectorAll('input[name="servico"]:checked')).map(function (c) { return c.value; }),
        atendimento: radioMarcado("atendimento"),
        data: valor("data-agendamento"),
        horario: valor("horario-agendamento"),
        pet: valor("nome-pet"),
    };
}

function preencherFormulario(ficha) {
    function definir(id, v) { const el = document.getElementById(id); if (el && v != null) el.value = v; }
    function marcar(id, v) { const el = document.getElementById(id); if (el) el.checked = !!v; }
    function radio(nome, v) {
        const el = v && document.querySelector('input[name="' + nome + '"][value="' + CSS.escape(v) + '"]');
        if (el) el.checked = true;
    }
    definir("nome-cliente", ficha.nome);
    definir("cpf-cliente", ficha.cpf);
    definir("telefone-cliente", ficha.telefone);
    definir("endereco-cliente", ficha.endereco);
    radio("sexo-cliente", ficha.sexo);
    marcar("aceita-whatsapp", ficha.aceitaWhatsapp);
    const pet = ficha.pet || {};
    definir("nome-pet", pet.nome);
    definir("raca-pet", pet.raca);
    definir("idade-pet", pet.idade);
    radio("porte-pet", pet.porte);
    marcar("pet-restricao-saude", pet.restricaoSaude);
    definir("observacoes-saude", pet.observacoesSaude);
    const area = document.getElementById("area-observacoes-saude");
    if (area) area.classList.toggle("d-none", !pet.restricaoSaude);
}

function mostrarResumoCadastro(ficha) {
    const pet = ficha.pet || {};
    const alvo = document.getElementById("resumo-cadastro-texto");
    if (!alvo) return;
    alvo.textContent = "";
    const linhas = [
        ["Cliente", ficha.nome + " · " + ficha.telefone],
        ["Pet", pet.nome + " (" + pet.raca + ", porte " + ({ pequeno: "pequeno", medio: "médio", grande: "grande" }[pet.porte] || pet.porte) + ")"],
    ];
    linhas.forEach(function (l) {
        const p = document.createElement("p");
        p.className = "mb-1";
        const b = document.createElement("strong");
        b.textContent = l[0] + ": ";
        p.appendChild(b);
        p.appendChild(document.createTextNode(l[1]));
        alvo.appendChild(p);
    });
}

/* ==========================================================================
   Utilitários
   ========================================================================== */
function mostrar(id, visivel) {
    const el = document.getElementById(id);
    if (el) el.classList.toggle("d-none", !visivel);
}

function mensagem(id, texto, tipo) {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = "alert alert-" + tipo + " mt-3 mb-0";
    el.textContent = texto;
}

async function comBotaoCarregando(form, textoCarregando, acao) {
    const botao = form.querySelector('button[type="submit"]');
    const textoOriginal = botao.textContent;
    botao.disabled = true;
    botao.textContent = textoCarregando;
    try {
        await acao();
    } finally {
        botao.disabled = false;
        botao.textContent = textoOriginal;
    }
}

// Só aceita voltar para páginas do próprio site (evita redirecionamento
// para sites de fora).
function paginaDeRetorno() {
    const voltar = new URLSearchParams(window.location.search).get("voltar");
    return voltar && /^[a-z0-9-]+\.html$/i.test(voltar) ? voltar : "agendamento.html";
}

function traduzirErro(erro) {
    const mensagens = {
        "auth/invalid-credential": "E-mail ou senha incorretos.",
        "auth/wrong-password": "E-mail ou senha incorretos.",
        "auth/user-not-found": "E-mail ou senha incorretos.",
        "auth/invalid-email": "Esse e-mail não parece válido.",
        "auth/email-already-in-use": "Já existe uma conta com esse e-mail. Tente entrar ou use \"Esqueci minha senha\".",
        "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
        "auth/too-many-requests": "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.",
        "auth/network-request-failed": "Sem conexão com a internet. Confira sua rede e tente de novo.",
        "auth/missing-email": "Digite seu e-mail.",
        "auth/missing-password": "Digite sua senha.",
        "auth/requires-recent-login": "Por segurança, saia e entre de novo na conta antes de excluir.",
    };
    return mensagens[erro && erro.code] || "Algo deu errado. Tente de novo em instantes.";
}
