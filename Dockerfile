# Usa Node.js com Alpine
FROM node:18-alpine

WORKDIR /app

# Instala git e outras dependências do sistema
RUN apk add --no-cache git

# Copia apenas os arquivos de dependências
COPY package.json yarn.lock ./

# Ativa Corepack e instala dependências (sem lock estrito)
RUN corepack enable
RUN yarn install --network-timeout 100000 --check-files || yarn install --network-timeout 100000 --check-files

# Copia o restante do projeto
COPY . .

CMD ["yarn", "start"]
