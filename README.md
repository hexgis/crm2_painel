# CMR

Visualizador de dados baseado no CMR1.

Desenvolvido com [Nuxt.js](https://nuxtjs.org).

## Desenvolvimento

_Configure a URL do back-end local (CMR-api) ou da web no .env:_

```bash
API_URL='https://cmr.funai.gov.br/priority_api/'
# API_URL='http://0.0.0.0:8080/'
MONITORING_VECTOR2TILES='true'
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
