# 1. Imagem base
FROM node:20

# 2. Define o diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia package.json e yarn.lock para aproveitar cache do Docker
COPY package.json yarn.lock ./

# 4. Ativa Corepack e prepara Yarn v4
RUN corepack enable && corepack prepare yarn@stable --activate

# 5. Instala dependências de produção usando Yarn 4
RUN yarn install --immutable --immutable-cache --check-cache --inline-builds

# 6. Copia o restante do projeto
COPY . .

# 7. Expõe porta (ajuste conforme necessário)
EXPOSE 3000

# 8. Comando de start (ajuste conforme seu package.json)
CMD ["node", "index.js"]
