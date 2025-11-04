FROM node:18-alpine

WORKDIR /app

# Instala git e yarn clássico
RUN apk add --no-cache git curl && npm install -g yarn

# Copia dependências
COPY package.json yarn.lock ./

# Instala dependências com Yarn 1
RUN yarn install --network-timeout 100000

# Copia o restante do projeto
COPY . .

CMD ["yarn", "start"]
