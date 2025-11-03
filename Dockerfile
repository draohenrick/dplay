# 1. Imagem base
FROM node:20

# 2. Define o diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia arquivos de dependências primeiro (para cache do Docker)
COPY package.json yarn.lock ./

# 4. Ativa Corepack e prepara Yarn 4+
RUN corepack enable \
    && corepack prepare yarn@stable --activate

# 5. Instala dependências de produção usando Yarn 4
RUN yarn install --immutable --immutable-cache --inline-builds

# 6. Copia todo o restante do projeto
COPY . .

# 7. Define o comando de inicialização
CMD ["node", "index.js"]
