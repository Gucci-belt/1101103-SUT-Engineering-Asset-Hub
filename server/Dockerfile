FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "src/index.js"]
