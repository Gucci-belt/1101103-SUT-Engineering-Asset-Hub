FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

RUN chmod +x node_modules/.bin/prisma

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

# Fix permissions for USER node
RUN chown -R node:node /app

USER node

CMD ["node", "src/index.js"]
