FROM node:20

WORKDIR /usr/src/app

# Instala dependências do sistema para Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates fonts-liberation libnss3 libatk1.0-0 \
    libatk-bridge2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxrandr2 \
    libasound2 libgbm1 libgtk-3-0 chromium \
    && rm -rf /var/lib/apt/lists/*

# Atualiza npm
RUN npm install -g npm@11

# Copia package.json e package-lock.json
COPY package*.json ./

# Limpa cache do npm
RUN npm cache clean --force

# Define registro confiável e instala dependências
RUN npm set registry https://registry.npmjs.org/ \
    && npm install --omit=dev --legacy-peer-deps --prefer-offline

# Copia o restante do projeto
COPY . .

# Define variável do Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expõe a porta
EXPOSE 8080

# Inicia o bot
CMD ["node", "src/index.js"]
