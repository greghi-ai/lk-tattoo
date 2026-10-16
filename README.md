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

## Terror
Fundo: caveira 3D em vídeo (`assets/skull.mp4` / `.webm`) desenhada num canvas — desce e cresce com o scroll,
respira como inflável e entra em glitch pesado (canais deslocados, fatias, apagões, barras na tela) quando o
cursor passa por cima. Surtos aleatórios, lâmpada falhando, scanlines. Arquivos: `video-skull.js`, `nueva.css`.

> ⚠️ O vídeo da caveira é obra de terceiro (@iskxart). Antes de publicar no site oficial, obter autorização/licença
> do artista ou trocar pelo vídeo próprio — basta substituir os arquivos em `assets/`.

## Para finalizar
- **Fotos e vídeos:** os blocos `.ph` são placeholders com legenda `[ ... ]`. Trocar por `<img>`/`<video>` reais.
- **WhatsApp:** preencher `WHATSAPP` no topo de `main.js` (só dígitos, com 55 + DDD).
- **Textos entre colchetes:** cidade, mês da agenda, nomes e depoimentos reais.

Design: Gframe + Lucas Kaikye
