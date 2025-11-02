# Imagem Node.js mais completa
FROM node:20-bullseye

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json (e package-lock.json se tiver)
COPY package*.json ./

# Limpa cache npm e instala dependências de forma limpa
RUN npm cache clean --force
RUN npm install --omit=dev --prefer-offline --no-audit

# Copia o restante do projeto
COPY ./src ./src

# Expõe porta (se usar Express)
EXPOSE 3000

# Comando para iniciar o bot
CMD ["npm", "start"]
