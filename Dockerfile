FROM node:20.15.0-alpine AS builder
WORKDIR /app
COPY package*.json ./  
RUN npm ci  
COPY . .  
RUN npm run build

FROM builder AS dependency
WORKDIR /app

COPY package*.json ./
RUN npm ci --production

FROM node:20.15.0-alpine
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=dependency /app/node_modules /app/node_modules
COPY package*.json ./ 
EXPOSE 5000
CMD ["node", "dist/src/main.js"] 