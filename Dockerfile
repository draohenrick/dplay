# Usar imagem Node.js completa (não alpine)
FROM node:20-bullseye

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock.json se houver
COPY package*.json ./

# Remove node_modules caso existam
RUN rm -rf node_modules

# Limpa cache npm e instala pacotes forçando download limpo
RUN npm cache clean --force
RUN npm install --omit=dev --force --no-audit --prefer-offline --no-fund --no-package-lock

# Copia o restante do projeto
COPY ./src ./src

# Expõe porta do Express
EXPOSE 3000

# Comando para iniciar o bot
CMD ["npm", "start"]
