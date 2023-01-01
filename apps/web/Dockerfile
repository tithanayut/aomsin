FROM node:16-alpine AS base

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=web --docker

################################################################################

FROM node:16-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

RUN npm install -g pnpm

WORKDIR /app
 
COPY --from=base /app/out/json/ .
COPY --from=base /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile
 
COPY --from=base /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo run build --filter=web

################################################################################
 
FROM nginx:1.23.1 AS runner

COPY --from=builder /app/apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]