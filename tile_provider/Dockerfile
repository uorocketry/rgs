FROM oven/bun:1 AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

RUN bun test
RUN bun build /usr/src/app/index.ts --compile --outfile tile_provider

FROM base AS release
COPY --from=prerelease /usr/src/app/tile_provider /usr/local/bin/tile_provider

RUN mkdir /var/lib/tile_provider
RUN chown bun:bun /var/lib/tile_provider

USER bun
EXPOSE 8080/tcp
ENTRYPOINT [ "/usr/local/bin/tile_provider", "--database", "/var/lib/tile_provider/tiles.db", "--port", "8080" ]