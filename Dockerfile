FROM node:20.15.0-slim AS builder  
WORKDIR /app
COPY package*.json ./  
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:20.15.0-slim  
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY package*.json ./ 
EXPOSE 5000
USER node
CMD ["node", "dist/src/main.js"]