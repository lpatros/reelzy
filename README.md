<div align="center">

# Reelzy

**English** | [Português](README-PTBR.md)

  <p>A media tracking app for discovering movies and TV shows, managing private lists, and tracking watched progress across web and native platforms.</p>
  <div>
    <img src="https://img.shields.io/badge/Language-TypeScript-3178c6.svg" alt="Language: TypeScript"/>
    <img src="https://img.shields.io/badge/App-Expo-000020.svg" alt="App: Expo"/>
    <img src="https://img.shields.io/badge/API-NestJS-e0234e.svg" alt="API: NestJS"/>
    <img src="https://img.shields.io/badge/Database-PostgreSQL-4169e1.svg" alt="Database: PostgreSQL"/>
    <img src="https://img.shields.io/badge/Package%20Manager-pnpm-f69220.svg" alt="Package Manager: pnpm"/>
  </div>
  <br>
</div>


# Quick Links


- [Description](#description)
- [Technologies](#technologies)
- [Features](#features)


## Description

Reelzy is a composition repository that brings together a product-facing Expo application and a NestJS REST API. The app primarily targets Expo Web, including installable PWA behavior, while keeping the same codebase runnable on iOS and Android through Expo.

The project is organized as a Git superproject with two independent submodules: `reelzy-app/` for the client and `reelzy-api/` for the backend. Each submodule maintains its own `package.json`, lockfile, and checks, while the root repository coordinates integrated development.


## Technologies

- **TypeScript** — Primary language across the app and API.
- **Expo / React Native** — Cross-platform application framework with Expo Router and React Native Web.
- **React Native Reusables / NativeWind / Tailwind CSS** — UI component base and styling approach for the app.
- **TanStack Query** — Remote data caching and mutation management in the app.
- **NestJS** — Modular REST API with OpenAPI export support.
- **PostgreSQL / Drizzle ORM / Drizzle Kit** — Relational database, schema access layer, and SQL migrations.
- **TMDB API** — External catalog provider used by the backend adapter.
- **pnpm** — Package manager used by the root workspace and both submodules.
- **Docker Compose** — Local PostgreSQL service for development.


## Features

### Authentication and Session

- Email and password registration/login.
- Web session flow with same-origin cookie and CSRF protection for authenticated writes.
- Native session flow with bearer token storage in SecureStore.
- Account session restore, logout, and account deletion with password confirmation.

### Catalog Discovery

- Paginated catalog search with `all`, `movie`, and `tv` filters.
- Movie, TV series, season, and episode detail endpoints.
- TMDB-backed catalog adapter with server-side normalization.
- Canonical catalog resolution for private user data.

### Private Lists

- Create, rename, delete, and retrieve private lists.
- Add and remove movies or TV series from lists.
- Paginated list items and ownership checks.

### App Experience

- Responsive Expo Web interface with mobile and desktop layouts.
- Tab-based browsing for explore, lists, and search.
- Shared detail, card, and scroll/header interaction patterns.
- TanStack Query-based cache isolation for private user data.
