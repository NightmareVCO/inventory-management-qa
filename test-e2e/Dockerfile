FROM mcr.microsoft.com/playwright:v1.55.0-noble

RUN corepack enable && corepack prepare pnpm@latest --activate

USER pwuser
WORKDIR /home/pwuser/app

COPY --chown=pwuser:pwuser package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY --chown=pwuser:pwuser . .


CMD ["pnpm", "test:ci"]
