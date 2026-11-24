<div align="center">

# Reelzy

[English](README.md) | **Português**

  <p>Um aplicativo para rastreamento de mídia, para descobrir filmes e séries, gerenciar listas privadas e acompanhar o progresso de assistidos na web e em plataformas nativas.</p>
  <div>
    <img src="https://img.shields.io/badge/Language-TypeScript-3178c6.svg" alt="Language: TypeScript"/>
    <img src="https://img.shields.io/badge/App-Expo-000020.svg" alt="App: Expo"/>
    <img src="https://img.shields.io/badge/API-NestJS-e0234e.svg" alt="API: NestJS"/>
    <img src="https://img.shields.io/badge/Database-PostgreSQL-4169e1.svg" alt="Database: PostgreSQL"/>
    <img src="https://img.shields.io/badge/Package%20Manager-pnpm-f69220.svg" alt="Package Manager: pnpm"/>
  </div>
  <br>
</div>


# Links Rápidos


- [Descrição](#descrição)
- [Tecnologias](#tecnologias)
- [Recursos](#recursos)


## Descrição

O Reelzy é um repositório de composição que reúne um aplicativo Expo voltado ao produto e uma API REST NestJS. O aplicativo tem como alvo primário a Expo Web, incluindo comportamento de PWA instalável, mantendo a mesma base de código executável em iOS e Android através do Expo.

O projeto está organizado como um superprojeto Git com dois submódulos independentes: `reelzy-app/` para o cliente e `reelzy-api/` para o backend. Cada submódulo mantém seu próprio `package.json`, lockfile e verificações, enquanto o repositório raiz coordena o desenvolvimento integrado.


## Tecnologias

- **TypeScript** — Linguagem principal no aplicativo e na API.
- **Expo / React Native** — Framework de aplicação multiplataforma com Expo Router e React Native Web.
- **React Native Reusables / NativeWind / Tailwind CSS** — Base de componentes de UI e abordagem de estilização do aplicativo.
- **TanStack Query** — Cache de dados remotos e gerenciamento de mutações no aplicativo.
- **NestJS** — API REST modular com suporte a exportação OpenAPI.
- **PostgreSQL / Drizzle ORM / Drizzle Kit** — Banco de dados relacional, camada de acesso ao schema e migrações SQL.
- **TMDB API** — Provedor externo de catálogo usado pelo adaptador do backend.
- **pnpm** — Gerenciador de pacotes usado pelo workspace raiz e por ambos os submódulos.
- **Docker Compose** — Serviço PostgreSQL local para desenvolvimento.


## Recursos

### Autenticação e Sessão

- Registro e login com e-mail e senha.
- Fluxo de sessão web com cookie de mesma origem e proteção CSRF para escritas autenticadas.
- Fluxo de sessão nativa com armazenamento de token bearer no SecureStore.
- Restauração de sessão da conta, logout e exclusão de conta com confirmação de senha.

### Descoberta de Catálogo

- Busca paginada no catálogo com filtros `all`, `movie` e `tv`.
- Endpoints de detalhes de filme, série, temporada e episódio.
- Adaptador de catálogo com apoio do TMDB e normalização no servidor.
- Resolução canônica de catálogo para dados privados do usuário.

### Listas Privadas

- Criar, renomear, excluir e recuperar listas privadas.
- Adicionar e remover filmes ou séries das listas.
- Itens de lista paginados e verificações de propriedade.

### Experiência do Aplicativo

- Interface Expo Web responsiva com layouts para mobile e desktop.
- Navegação por abas para explorar, listas e busca.
- Padrões compartilhados de detalhe, cartão e interação de scroll/cabeçalho.
- Isolamento de cache baseado em TanStack Query para dados privados do usuário.