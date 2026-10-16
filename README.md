# LK Tattoo — mini site

Mini site do **LK Tattoo · Lucas Kaikye**, seguindo o manual de marca (Figma: *Identidade / Manual de marca*).
Dark, autoral, com motion leve. HTML + CSS + JS puros, sem build.

## Seções
Hero · Sobre · Trabalhos (com filtros) · Vídeos · Processo · Depoimentos · Orçamento (envia pelo WhatsApp) · Rodapé

## Motion
Loader com o símbolo sendo "desenhado", reveal das letras nos títulos, glows vermelhos respirando,
grão animado, cursor customizado, parallax leve nas fotos, "REVEAL" correndo com o scroll,
linha do processo que acende conforme rola, carrossel de depoimentos e hover nos trabalhos.
Respeita `prefers-reduced-motion`.

## Logo 3D
A logo LK é extrudada em 3D num único canvas (`logo3d.js`, imagens em `assets/lk-*.png`): fica no fundo,
desce acompanhando o scroll, cresce até o fim da página, respira como inflável, gira com a rolagem e inclina
seguindo o mouse. Só redesenha quando o ângulo muda (leve).

## Identidade
Versão clean (conceito v1 do Figma): preto, vermelho LK como acento, títulos grandes, fotos em P&B. Estilos em
`style.css` + `clean.css`; animações de scroll em `scroll.css`.

## Para finalizar
- **Fotos e vídeos:** os blocos `.ph` são placeholders com legenda `[ ... ]`. Trocar por `<img>`/`<video>` reais.
- **WhatsApp:** preencher `WHATSAPP` no topo de `main.js` (só dígitos, com 55 + DDD).
- **Textos entre colchetes:** cidade, mês da agenda, nomes e depoimentos reais.

Design: Gframe + Lucas Kaikye
