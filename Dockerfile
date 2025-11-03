# 1. Imagem base
FROM node:20

# 2. Diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia package.json e package-lock.json
COPY package.json package-lock.json ./

# 4. Limpa cache npm, usa registry limpo e instala dependências de produção
RUN npm config set registry https://registry.npmjs.org/ \
    && rm -rf node_modules \
    && npm cache clean --force \
    && npm install --omit=dev --legacy-peer-deps --force --no-audit --no-fund

# 5. Copia o restante do projeto
COPY . .

# 6. Expõe porta do bot
EXPOSE 3000

# 7. Inicializa o bot
CMD ["node", "src/index.js"]
