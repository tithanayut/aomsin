FROM node:16-alpine AS base

RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app

RUN npm install -g turbo

COPY . .

RUN turbo prune --scope=api --docker

################################################################################

FROM node:16-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN apk update

RUN npm install -g pnpm prisma

WORKDIR /app
 
COPY --from=base /app/out/json/ .
COPY --from=base /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile
 
COPY --from=base /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm prisma generate --schema=/app/apps/api/src/prisma/schema.prisma

RUN pnpm turbo run build --filter=api

################################################################################
 
FROM node:16-alpine AS runner

WORKDIR /app

COPY --from=builder /app .

WORKDIR /app/apps/api

EXPOSE 5000

CMD [ "node", "dist/main.js" ]