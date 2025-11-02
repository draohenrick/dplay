# Imagem Node oficial
FROM node:20-bullseye

# Diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json (e package-lock.json se existir)
COPY package*.json ./

# Limpa node_modules e cache
RUN rm -rf node_modules
RUN npm cache clean --force

# Instala dependências forçando download limpo
RUN npm install --omit=dev --force --no-audit --no-fund

# Copia o restante do projeto
COPY ./src ./src

# Expõe porta do Express
EXPOSE 3000

# Start
CMD ["npm", "start"]
