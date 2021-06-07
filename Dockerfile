ARG NODE_VERSION
ARG PORT

FROM node:${NODE_VERSION} AS builder
ENV PORT=${PORT}
COPY . .
RUN apk --no-cache update && apk --no-cache add git=2.24.4-r0
RUN npm install
RUN npm run build
RUN npm prune --production

FROM node:${NODE_VERSION}
COPY --from=builder /definitions/ /definitions/
COPY --from=builder /lib/ /lib/
COPY --from=builder /locales/ /locales/
COPY --from=builder /middleware/ /middleware/
COPY --from=builder /node_modules/ /node_modules/
COPY --from=builder /routes/ /routes/
COPY --from=builder /src/ /src/
COPY --from=builder /static/ /static/
COPY --from=builder /utils/ /utils/
COPY --from=builder /views/ /views/
COPY --from=builder /app.js /
COPY --from=builder /gulpfile.js /
COPY --from=builder /package.json /
EXPOSE ${PORT}
RUN apk --no-cache add libcrypto1.1=1.1.1k-r0 libssl1.1=1.1.1k-r0
CMD ["npm", "start"]
