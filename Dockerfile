# 1. Imagem base
FROM node:20

# 2. Define o diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia apenas package.json e package-lock.json para aproveitar cache do Docker
COPY package.json package-lock.json ./

# 4. Instala dependências (produção)
RUN npm install --omit=dev --legacy-peer-deps --force

# 5. Copia todo o restante do projeto
COPY . .

# 6. Define variável de ambiente (opcional, ajuste se precisar)
ENV NODE_ENV=production

# 7. Expõe a porta que seu app utiliza
EXPOSE 3000

# 8. Comando de inicialização
CMD ["node", "src/index.js"]
