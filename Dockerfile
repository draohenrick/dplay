# Imagem oficial Node.js
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock.json (se houver)
COPY package*.json ./

# Limpa cache npm e instala dependências
RUN npm cache clean --force
RUN npm install --omit=dev --legacy-peer-deps --force

# Copia o restante do projeto
COPY ./src ./src

# Expõe porta (se usar Express)
EXPOSE 3000

# Comando para iniciar o bot
CMD ["npm", "start"]
