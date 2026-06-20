FROM node:20-alpine AS dev

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# ---------------------------------------------------------------------------
FROM node:20-alpine AS prod

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci --legacy-peer-deps --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
