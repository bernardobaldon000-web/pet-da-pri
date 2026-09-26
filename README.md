# Pet da Pri - Site de Demonstração

Protótipo montado a partir do template genérico, usando as informações **reais** que você já tinha da cliente, pra mostrar pra ela como ficaria.

## O que é REAL neste site

- Nome: **Pet da Pri**
- Logo (a mesma imagem que você me mandou, em `images/logo.png`, usada no menu)
- WhatsApp/Telefone: (51) 99984-2681
- E-mail: fm.priscila@gmail.com
- Endereço: Rua 3 de Outubro, 705 - Olaria - Camaquã/RS - CEP 96180-000
- CNPJ: 30.322.736/0001-47
- Cores: paleta ciano/turquesa baseada no logo dela
- **Serviços oferecidos: Banho, Tosa e Vacina** (adicionada a Vacina — a Priscila também aplica vacina)
- **Atendimento exclusivo para cães** — a Priscila não atende gatos. Isso já está avisado na página de Serviços e nos textos da home.

## O que é REAL (atualizado com a Priscila)

- **Horário: Terça a sexta-feira, 9h às 18h.** Segunda-feira fechado.
- **Sábado: 9h ao meio-dia, mas ela NÃO abre todo sábado** — o site não afirma "aberto" automaticamente nesse dia, só orienta a confirmar disponibilidade e agendar pelo WhatsApp.
- **CEP atualizado:** 96785-212 (endereço continua o mesmo, Rua 3 de Outubro, 705 - Olaria - Camaquã/RS).
- **Preço do Banho: a partir de R$ 40,00, varia conforme o porte do cão.**
- **Preço do combo Banho + Tosa: de R$ 75,00 a R$ 130,00, conforme o porte do cão** (confirmado com a Priscila em 18/09/2026).
- **Vacina sem preço fixo no site:** a Priscila prefere combinar o valor direto com o cliente, porque às vezes ela faz um combo com o banho.
- **Pet da Pri existe desde 2018.**
- **Priscila é médica-veterinária, formada pela UniRitter em 2025.** Isso foi incluído nos diferenciais da home — é um baita diferencial de confiança, especialmente pra quem for agendar a vacina.
- Adicionado aviso pra agendar com antecedência (ela tem bastante clientes fixos durante a semana, os horários lotam rápido) — aparece no topo do formulário de Agendamento.
- **Nova página "Quem Somos" (`quem-somos.html`)**, com a seção "Quem sou eu?" (nome completo da Priscila, formação em Medicina Veterinária pela UniRitter em agosto de 2025) e uma linha do tempo com a história da Pet da Pri (2018 → 2025 → hoje). Já está linkada no menu, no rodapé e na home. A foto real da Priscila (formatura) já está no lugar do círculo com iniciais (`images/priscila-formatura.jpg`).
- **Foto real de dois pugs clientes, tirada no espaço de atendimento da Pet da Pri** (dá pra ver o logo pintado na parede atrás) no 1º slide do carrossel da home (`images/dois-pugs-loja.jpg`).
- **Foto real do carro da Pet da Pri** (usado na tele-busca) no 2º slide do carrossel da home (`images/carro-tele-busca.jpg`).
- **Foto real de dois cães clientes** no 3º slide do carrossel da home (`images/slide3-cachorros.jpg`) — o carrossel da home agora está 100% com fotos reais, sem nenhum banner de exemplo.

## O que ainda é EXEMPLO/placeholder (confirme com ela antes de publicar de verdade)

- Nao incluí página de "Produtos" porque, pelo que entendi, ela trabalha só com banho, tosa e vacina - se ela também vender produtos, é só reativar essa parte do template original.

## Importante sobre a tele-busca

A Pet da Pri **não dá banho na casa do cliente**. A tele-busca funciona assim: ela busca o pet, faz o banho/tosa no espaço dela, e devolve depois. Isso já está deixado bem claro no site (página de Serviços e no formulário de Agendamento), pra evitar mal-entendido do cliente.

## Ajustes de setembro/2026 (recomendações de revisão)

1. **Favicon** criado a partir do logo (`favicon.ico`, `images/favicon-192.png`, `images/apple-touch-icon.png`).
2. **Logo e fotos em WebP** (`images/*.webp`), bem mais leves que os PNG/JPG originais (que continuam na pasta, mas não são mais usados).
3. **Carrossel** agora fica na largura do conteúdo, com margens nas laterais, altura fixa (420px no computador, 240px no celular) e cantos arredondados.
4. **Lazy loading:** só a 1ª foto do carrossel carrega na hora; as outras (e o mapa do Contato) carregam só quando forem aparecer.
5. **Aviso de loja fechada virou pop-up**, com a próxima abertura e botões de WhatsApp e Agendar. Aparece só uma vez por visita. Quando está aberto, continua a faixa verde na home.
6. **Títulos em negrito** (`font-weight: 700`).
7. Removida a linha "Conheça Quem Somos, confira..." da home.
8. **Contatos clicáveis** (página de Contato e rodapé): WhatsApp abre a conversa, telefone inicia a ligação, e-mail abre o app de e-mail, endereço abre no Google Maps.
9. **Login com e-mail e senha (Firebase):** veja a seção "Área do Cliente" abaixo.
10. **Nova página `termos.html`** com os termos de atendimento e a política de privacidade (LGPD). O formulário de agendamento agora tem link para os termos e um aceite separado da LGPD. **Revisar o texto com a Priscila antes de publicar oficialmente.**
11. **Mapa e botões "Ir com o Waze" / "Ir com o Google Maps"** na página de Contato.

Também: `sitemap.xml` e `robots.txt` já apontam para o endereço real do GitHub Pages.

## Área do Cliente (login com Firebase)

Arquivos: `entrar.html`, `js/conta.js`, `js/firebase-config.js`, `firestore.rules`.

- O cliente cria a conta só com e-mail e senha (`entrar.html`), com opção de "Esqueci minha senha".
- No primeiro agendamento, ele completa os dados dele e do cão. Esses dados ficam salvos na conta, e nos próximos agendamentos já vêm preenchidos (aparece só um resumo com o botão "Editar").
- Ao enviar, o pedido continua indo pelo WhatsApp **e** também fica salvo no Firebase (`clientes/{id}/agendamentos`).
- Cada cliente só enxerga os próprios dados (regras em `firestore.rules`).
- **Meus dados e privacidade** (em `entrar.html`, com a conta aberta): o cliente vê tudo o que está guardado, baixa uma cópia em .txt e pode excluir a conta sozinho (pede a senha pra confirmar).

**Para ativar:**
1. Cole o `firebaseConfig` do seu projeto em `js/firebase-config.js`.
2. No console do Firebase, vá em Firestore Database › Regras, cole o conteúdo de `firestore.rules` e publique.

Enquanto `js/firebase-config.js` estiver com `null`, o site funciona como antes (sem login).

**Antes de ir pro ar com clientes reais:** adicionar a Priscila como proprietária do projeto no Firebase (Configurações do projeto › Usuários e permissões), já que pela LGPD ela é a responsável pelos dados.
