# 1. Escolhe a imagem base Node LTS
FROM node:20-alpine

# 2. Define diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia package.json e yarn.lock primeiro (para cache de dependências)
COPY package.json yarn.lock ./

# 4. Ativa o Corepack e prepara Yarn v3+
RUN corepack enable && corepack prepare yarn@stable --activate

# 5. Instala dependências de produção
RUN yarn install --immutable --production

# 6. Copia todo o restante do projeto
COPY . .

# 7. Expõe a porta se necessário (opcional, para webhooks ou dashboard)
EXPOSE 3000

# 8. Define variável de ambiente se precisar (opcional)
ENV NODE_ENV=production

# 9. Comando para iniciar seu bot
CMD ["node", "index.js"]
