# 1. Imagem Node.js 20
FROM node:20

# 2. Define diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia package.json e yarn.lock (se existir)
COPY package.json yarn.lock* ./

# 4. Ativa Corepack e prepara Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# 5. Instala dependências de produção
RUN yarn install --immutable --immutable-cache --check-cache --inline-builds

# 6. Copia o restante do projeto
COPY . .

# 7. Expõe porta do bot
EXPOSE 3000

# 8. Comando para rodar o bot
CMD ["node", "index.js"]
