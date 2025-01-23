ARG NODE_VERSION
ARG PORT

FROM node:${NODE_VERSION} AS builder
ENV PORT=${PORT}
ARG GITLAB_REGISTRY_TOKEN
RUN apk --no-cache add git=2.43.6-r0 \
     make=4.4.1-r2 \
     build-base=0.5-r3 \
     python3=3.11.11-r0 \
     py3-pip=23.3.1-r0

RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
USER nonroot

WORKDIR /src
COPY . /src/

RUN npm install
RUN npm run build \
    && npm prune --production

FROM node:${NODE_VERSION}
COPY --from=builder /src/definitions/ /definitions/
COPY --from=builder /src/lib/ /lib/
COPY --from=builder /src/locales/ /locales/
COPY --from=builder /src/middleware/ /middleware/
COPY --from=builder /src/node_modules/ /node_modules/
COPY --from=builder /src/routes/ /routes/
COPY --from=builder /src/src/ /src/
COPY --from=builder /src/static/ /static/
COPY --from=builder /src/utils/ /utils/
COPY --from=builder /src/views/ /views/
COPY --from=builder /src/app.js /
COPY --from=builder /src/gulpfile.js /
COPY --from=builder /src/package.json /
EXPOSE ${PORT}
CMD ["npm", "start"]
