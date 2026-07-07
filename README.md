# Handoff: Portfólio Guilherme Porto (site-currículo animado)

## Overview
Site-currículo pessoal de página única, bilíngue (PT/EN), animado, para publicação no GitHub Pages. Apresenta o Guilherme Porto Ribeiro: hero com efeito de digitação, sobre, timeline de experiência profissional, projeto em destaque (Lexo), habilidades, formação e contato.

## About the Design Files
Os arquivos deste pacote são **referências de design criadas em HTML** — protótipos que mostram a aparência e o comportamento pretendidos, não código de produção para copiar diretamente. A tarefa é **recriar este design no ambiente do projeto de destino**. Como o alvo é GitHub Pages, a recomendação é **HTML + CSS + JavaScript vanilla estático** (sem build step): um `index.html` com CSS e JS próprios. O arquivo `Portfolio Guilherme Porto.dc.html` usa um runtime próprio da ferramenta de design (`support.js`, template com `{{ }}`) — **não reutilize esse runtime**; extraia o markup, os estilos inline e a lógica descrita abaixo.

## Fidelity
**High-fidelity (hifi)**: cores, tipografia, espaçamentos e interações são finais. Recriar fielmente.

## Design Tokens
- `--accent`: `#2563EB` (azul principal — botões, links, destaques)
- `--ink` (texto): `oklch(0.24 0.03 255)` ≈ `#2E3440`
- `--muted` (texto secundário): `oklch(0.5 0.03 255)`
- `--bg` (fundo): `oklch(0.98 0.005 240)` — branco frio
- Cartões: fundo `white`, borda `1px solid oklch(0.92 0.01 250)`, radius `16px`
- Painel escuro (card Lexo, cabeçalho): `oklch(0.28 0.06 258)` — azul-marinho profundo
- Chips: fundo `oklch(0.94 0.03 255)`, texto accent, radius `999px`
- Sombra accent: `0 8px 24px oklch(0.55 0.18 255 / 0.35)`
- Tipografia (Google Fonts):
  - Display: **Sora** (700/800) — títulos, logo, nome
  - Corpo: **IBM Plex Sans** (400/500/600)
  - Mono: **IBM Plex Mono** (400/500) — labels de seção (`// PORTFÓLIO`, `01`–`06`), datas, botão de idioma
- Radius: botões 12px, cards 16px, card Lexo 20px, pills 999px
- Títulos de seção: Sora 36px/700; h1 hero: `clamp(40px, 6vw, 68px)` 800

## Screens / Views (página única, seções ancoradas)

### Navegação (fixa no topo)
- `position: fixed`, fundo `oklch(0.98 0.005 240 / 0.8)` + `backdrop-filter: blur(12px)`, borda inferior hairline, padding `14px 6vw`
- Esquerda: logo texto "gui**.porto**" (Sora 800, ".porto" em accent), âncora para `#topo`
- Direita: links Sobre / Experiência / Projetos / Habilidades / Formação / Contato (15px/500, cor muted → accent no hover) + botão PT/EN (pill, borda accent 1.5px, mono 13px; hover: fundo accent, texto branco). Rótulo mostra o idioma alternativo ("EN 🇺🇸" quando em PT).

### Fundo animado (global)
- 3 círculos com `radial-gradient` azul translúcido (`oklch(0.85 0.08 255 / 0.55)` etc.), `position: fixed`, tamanhos 300–600px, animações de flutuação (`translate` + `scale`) de 14s/18s/22s, `pointer-events: none`, atrás do conteúdo.

### Hero (`#topo`, min-height 100vh, flex centralizado, gap 64px, wrap)
- Coluna texto (max 560px): label mono `// PORTFÓLIO` (14px, letter-spacing 0.18em, accent) → h1 "Guilherme **Porto** Ribeiro" ("Porto" em accent) → linha com efeito máquina de escrever (mono, `clamp(16px, 2.2vw, 22px)`, muted) + cursor retangular accent piscando (animação `blink` 1s step-end) → dois botões: "Ver experiência ↓" (fundo accent, branco, sombra azul; hover: sobe 3px, sombra maior) e "📄 Currículo" (branco, borda; hover: borda/texto accent).
- Coluna foto: imagem 300×300 circular (`object-fit: cover`), borda branca 6px, sombra azul; anel externo tracejado accent girando 30s; badge "📍 Atibaia · SP" (pill branca, mono 13px) sobreposta embaixo à direita; conjunto flutua (`translateY ±14px`, 6s ease-in-out infinito).

### Sobre (`#sobre`, max-width 860px)
- Padrão de cabeçalho de seção: número mono accent ("01") + h2 Sora 36px.
- Um parágrafo 18px/1.7 muted. Conteúdo em `Portfolio Guilherme Porto.dc.html`.

### Experiência (`#experiencia`) — timeline vertical
- Container com `border-left: 2px solid oklch(0.88 0.02 250)`, padding-left 32px, cards em coluna com gap 28px.
- Cada card: branco, radius 16px, padding 26px 28px; ponto de 16px na linha (accent no item atual, `oklch(0.75 0.08 255)` nos demais, borda 4px da cor do fundo); hover: `translateX(6px)` + sombra azul.
- Estrutura do card: data mono 13px accent → h3 cargo (Sora 20px/700) → empresa (15px/600 muted) → bullets 15px/1.7.
- Item atual (A.C Mendonça) tem badge pill "ATUAL" (fundo accent, branco, mono 11px) ao lado da data.
- 6 entradas, da mais recente para a mais antiga: A.C Mendonça (out 2025–atual), Atibaia Fibra Telecom (2024–2025), Conecte Tudo Informática (2023), Prev Fácil (2021–2022), LH Content (2020–2021), Ziom Motores (2019–2020). Textos completos (PT e EN) no arquivo HTML.

### Projetos (`#projetos`)
- Card único destacado: fundo azul-marinho `oklch(0.28 0.06 258)`, texto branco, radius 20px, padding 40px 44px, brilho radial azul no canto superior direito, `overflow: hidden`; hover: sobe 6px + sombra.
- Conteúdo: label mono "SAAS · JURÍDICO" → "Lexo" (Sora 32px/800) → descrição; emoji ⚖️ grande (64px) à direita.

### Habilidades (`#habilidades`)
- Grid `repeat(auto-fit, minmax(300px, 1fr))`, gap 24px; 2 cards brancos: "💻 Desenvolvimento" (HTML5, CSS3, JavaScript, Node.js, React Native) e "🛠️ Suporte & Redes" (Help Desk, Redes, HubSoft, Manutenção de PCs, Atendimento ao Cliente).
- Chips pill; hover: `scale(1.08)`.

### Formação (`#formacao`)
- Grid `minmax(240px, 1fr)`, 3 cards brancos com borda superior de 4px (accent no primeiro, azul claro nos demais); label mono (CURSANDO / COMPLEMENTAR / IDIOMAS), título Sora 18px, instituição 15px muted; hover: sobe 6px.
- USF (ADS, cursando) · Faculdade Impacta (fundamentos) · Yázigi (inglês intermediário, 4 anos).

### Contato (`#contato`, centralizado)
- "06" → h2 "Vamos conversar?" (`clamp(32px, 5vw, 48px)` 800) → subtítulo → dois botões (mailto `guiribeiro0910@gmail.com` estilo primário; tel `(11) 93469-3145` estilo secundário) → linha de links LinkedIn / GitHub / Instagram (URLs no HTML).

### Rodapé
- Centralizado, mono 13px muted, borda superior: "Feito com 💙 por Guilherme Porto · 2026".

## Interactions & Behavior
- **Bilíngue PT/EN**: todo texto existe duplicado com classes `txt-pt` / `txt-en`. CSS: `.txt-en { display: none }`; com classe `lang-en` no wrapper raiz: `.lang-en .txt-pt { display: none !important }` e `.lang-en .txt-en { display: revert }`. O botão da nav alterna a classe. Padrão = PT.
- **Máquina de escrever (hero)**: cicla frases — PT: "Supervisor Administrativo", "Desenvolvedor Web em formação", "Criador do Lexo — SaaS Jurídico", "HTML • CSS • JavaScript • Node.js" (EN equivalente). Digita ~75ms/caractere, pausa 1800ms no fim, apaga ~35ms/caractere, próxima frase. Reinicia ao trocar idioma.
- **Reveal ao rolar**: elementos marcados começam `opacity: 0; translateY(26px)` e transicionam para visível (`0.7s ease`) via `IntersectionObserver` (threshold 0.12), uma única vez. Aplicar estado inicial via JS (fallback: sem IO, tudo visível).
- **Scroll suave**: `html { scroll-behavior: smooth }`, nav ancora nas seções.
- **Hovers**: descritos por seção acima.

## State Management
- `lang: 'pt' | 'en'` — idioma atual (classe no wrapper)
- Estado do typewriter: índice da frase, índice do caractere, flag digitando/apagando (timeouts)
- Sem fetch de dados; tudo estático.

## Assets
- `assets/foto-perfil.jpg` — foto de perfil (fornecida pelo usuário; incluída neste pacote)
- Google Fonts: Sora, IBM Plex Sans, IBM Plex Mono (via `<link>`)
- Ícones: apenas emoji (📍 ✉️ 📞 📄 💻 🛠️ ⚖️ 💙 🇧🇷 🇺🇸) — sem biblioteca de ícones

## Files
- `Portfolio Guilherme Porto.dc.html` — protótipo do site (markup completo com estilos inline, textos PT/EN e lógica de referência)
- `assets/foto-perfil.jpg` — foto de perfil
