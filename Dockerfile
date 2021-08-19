ARG NODE_VERSION
ARG PORT

FROM node:${NODE_VERSION} AS builder
ENV PORT=${PORT}
RUN apk --no-cache update && apk --no-cache add git=2.24.4-r0
WORKDIR /src
COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
RUN npm install
COPY . /src/
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
RUN apk --no-cache add libcrypto1.1=1.1.1k-r0 libssl1.1=1.1.1k-r0 apk-tools=2.10.8-r0
CMD ["npm", "start"]
