# Encontrabilidade — front (fatec·shop)

Loja estática da disciplina **Projetos de Encontrabilidade** (Fatec/SI):
catálogo, produto, carrinho + camada citável por IA (JSON-LD, `llms.txt`, `feed.json`).

- **Loja no ar:** https://renatoviolin.github.io/encontrabilidade-frontend/
- **Back:** [`encontrabilidade-backend`](https://github.com/renatoviolin/encontrabilidade-backend) (Render)

## Rodar local

```bash
python3 -m http.server 8140
# abrir http://localhost:8140 (precisa do back em :3001 — ver repo do back)
```

## Ligar ao back

Ordem de resolução em `assets/js/api.js`:
1. `?api=<url>` na querystring (salva no navegador)
2. `window.__API_BASE__` (em `assets/js/config.js` — gravado no deploy via variável `API_URL`)
3. `localStorage 'api_base'`
4. `http://localhost:3001`

## Deploy

Push na `main` → Actions publica a raiz no Pages. Para apontar ao back de produção,
defina a variável de repo `API_URL` (Settings → Variables → Actions).
