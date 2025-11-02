FROM node:20

WORKDIR /usr/src/app

# Dependências do sistema para Puppeteer
RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates fonts-liberation libnss3 libatk1.0-0 \
    libatk-bridge2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxrandr2 \
    libasound2 libgbm1 libgtk-3-0 chromium \
    && rm -rf /var/lib/apt/lists/*

# Atualiza npm
RUN npm install -g npm@11

# Copia apenas os arquivos de dependência primeiro
COPY package*.json ./

# Limpa cache e instala dependências a partir do package-lock.json limpo
RUN npm cache clean --force
RUN npm ci --omit=dev --legacy-peer-deps

# Copia o restante do projeto
COPY . .

# Variável do Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Porta
EXPOSE 8080

# Inicia o servidor
CMD ["node", "src/index.js"]
