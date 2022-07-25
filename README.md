# Skyviewer

Visualizador do catálogo de imagens e informações de monitoramento do Skynet.

Desenvolvido com [Nuxt.js](https://nuxtjs.org).

## Desenvolvimento

_Configure a URL e token de autenticação dos back-ends locais (skyviewer-api, skynetViz, skynet) ou da web no .env:_

```bash
API_URL='http://localhost:8000'
SKYNET_API_URL='http://localhost:8002/'
SKYNET_API_TOKEN='Token secret'
```

_Rodar projeto e testes:_

```bash
# instalar dependencias
$ npm install

# rodar localmente em localhost:3000 com hot reload
$ npm run dev

# build para produção e iniciar servidor
$ npm run build
$ npm run start

# gerar projeto estático
$ npm run generate
```

### Visual Studio Code

_Extensões recomendadas:_

-   Vetur
-   ESLint
-   Prettier - Code formatter
-   Sass
-   ENV

_Configurações recomendadas:_

-   Formatter do Vetur: Prettier (exceto para Sass)
-   Ativar Format on save
-   Ativar Trim trailing whitespace