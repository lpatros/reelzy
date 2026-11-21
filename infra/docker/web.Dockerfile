FROM node:24.22.1-bookworm-slim AS build
WORKDIR /app
ENV EXPO_NO_TELEMETRY=1
RUN npm install --global pnpm@12.3.4
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY app.json tsconfig.json babel.config.js metro.config.js global.css tailwind.config.js nativewind-env.d.ts ./
COPY public ./public
COPY src ./src
RUN pnpm build:web && chmod -R a+rX dist

FROM nginx:1.30-alpine
COPY --from=compose nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
