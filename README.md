# JSL Cell Imports · site

Site estático (HTML, CSS e JS puros, sem build) da JSL Cell Imports, assistência técnica de celular em Itajaí-SC. Pronto para deploy na Vercel.

## Deploy na Vercel

Validado com `vercel build` (CLI 64). A branch `main` é a de produção.

1. Importe este repositório em vercel.com/new.
2. Framework preset: **Other**. Build command: vazio. Output directory: `.` (raiz).
3. Em *Settings > Domains*, adicione `www.jslcell.com` e `jslcell.com` (redirecionando para o www).

Teste local: `npx serve .` e abra http://localhost:3000.

## Estrutura

| Arquivo | Função |
|---|---|
| `index.html` | Home (assistência) com SEO, Open Graph e JSON-LD (Organization, 2x MobilePhoneStore, OfferCatalog, Person, FAQPage) |
| `curso.html` | `/curso`: Iniciante Pro 1.0 e JSLCELL 2.0, com checkout Kiwify e JSON-LD de Course |
| `jmg.html` | `/jmg`: página da JMG Media Group |
| `assets/css/style.css` | Visual completo, responsivo, com `prefers-reduced-motion` |
| `assets/js/main.js` | Scroll animations, reparo do celular no hero, camadas 3D, contadores, "aberto agora", formulário → WhatsApp, eventos de conversão |
| `assets/fonts/` | Space Grotesk, Inter e JetBrains Mono auto-hospedadas (OFL) |
| `robots.txt` | Libera buscadores e bots de IA (GPTBot, ClaudeBot, PerplexityBot etc.) |
| `sitemap.xml` | Mapa do site |
| `llms.txt` | Resumo factual para ChatGPT, Claude, Perplexity e afins (também em `/llm.txt`) |
| `vercel.json` | Clean URLs, cache, headers de segurança, rewrite de `/llm.txt` e redirect 301 das URLs antigas (`/samsung`, `/iphone`) |
| `og.png` | Imagem de compartilhamento 1200x630 |
| `404.html` | Página de erro |

## Pendências antes de publicar

- **Foto do Jônatas:** salvar em `img/jonatas.webp` (proporção 4:5, ~1120x1400). Sem o arquivo, aparece um monograma "JL".
- **Números:** nota 4,9 com 58 avaliações no Google, 30 mil seguidores no Instagram e 56 mil no Facebook foram coletados em outubro/2026. Atualize quando mudar (`index.html` e `llms.txt`).
- **Google Search Console:** após o deploy, envie `https://www.jslcell.com/sitemap.xml`.
- **Analytics (opcional):** os cliques de WhatsApp disparam `lead_click` no `dataLayer` e `generate_lead` no `gtag`. Basta instalar o GTM ou GA4 no `<head>`.
