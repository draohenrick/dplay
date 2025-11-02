# 1. Escolhe a imagem oficial do Node.js 20 (LTS)
FROM node:20

# 2. Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# 3. Copia apenas o package.json primeiro (para cache de dependências)
COPY package.json ./

# 4. Ativa Corepack e prepara Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# 5. Instala dependências de produção sem lockfile
RUN yarn install --production

# 6. Copia todo o restante do projeto
COPY . .

# 7. Expõe a porta que seu bot vai usar (ex: 3000)
EXPOSE 3000

# 8. Comando para iniciar o bot
CMD ["node", "index.js"]
