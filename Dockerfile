# Usa Node 20
FROM node:20

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Instala dependências do sistema para Puppeteer / Chromium
RUN apt-get update && apt-get install -y \
    wget gnupg ca-certificates fonts-liberation libnss3 libatk1.0-0 \
    libatk-bridge2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxrandr2 \
    libasound2 libgbm1 libgtk-3-0 chromium \
    && rm -rf /var/lib/apt/lists/*

# Atualiza npm para evitar problemas
RUN npm install -g npm@11

# Limpa cache do npm antes de instalar
RUN npm cache clean --force

# Copia arquivos de package primeiro para aproveitar cache
COPY package*.json ./

# Instala pacotes (somente produção)
RUN npm install --omit=dev --force

# Copia o restante do projeto
COPY . .

# Variável de ambiente para Puppeteer usar o Chromium instalado
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Expõe porta do servidor
EXPOSE 8080

# Comando para iniciar o bot
CMD ["node", "src/index.js"]
