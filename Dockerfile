# Usa imagem oficial Node.js
FROM node:20-alpine

# Define diretório de trabalho
WORKDIR /usr/src/app

# Copia package.json e package-lock.json para instalar dependências
COPY package.json package-lock.json ./

# Limpa cache e instala dependências de forma confiável
RUN npm cache clean --force
RUN npm ci --omit=dev --legacy-peer-deps --force

# Copia o restante do projeto
COPY ./src ./src

# Expõe a porta (opcional, se usar express)
EXPOSE 3000

# Comando para iniciar o bot
CMD ["npm", "start"]
