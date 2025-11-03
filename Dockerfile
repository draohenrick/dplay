# 1. Imagem base
FROM node:20

# 2. Define o diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia apenas package.json e package-lock.json para aproveitar cache quando possível
COPY package.json package-lock.json ./

# 4. Limpa cache npm e força instalação limpa
RUN npm cache clean --force \
    && npm install --omit=dev --legacy-peer-deps --force --no-audit --no-fund

# 5. Copia todo o restante do projeto
COPY . .

# 6. Define variável de ambiente
ENV NODE_ENV=production

# 7. Expõe a porta que o bot vai usar
EXPOSE 3000

# 8. Comando de inicialização apontando para src/index.js
CMD ["node", "src/index.js"]
