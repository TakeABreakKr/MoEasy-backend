FROM node:20.15.0-slim AS builder  
WORKDIR /app
COPY package*.json ./  
RUN npm ci  
COPY . .  
RUN npm run build 

FROM node:20.15.0-slim  
WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules
COPY package*.json ./ 
EXPOSE 5000
CMD ["node", "dist/src/main.js"] 