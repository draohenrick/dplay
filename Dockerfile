# 1. Imagem base
FROM node:20

# 2. Diretório de trabalho
WORKDIR /usr/src/app

# 3. Copia apenas package.json (yarn.lock opcional)
COPY package.json ./

# 4. Ativa Corepack e prepara Yarn 4
RUN corepack enable && corepack prepare yarn@stable --activate

# 5. Instala dependências
# Se yarn.lock existir, ele será usado; se não, será gerado
RUN yarn install --immutable || yarn install

# 6. Copia todo o restante do projeto
COPY . .

# 7. Expõe a porta da aplicação (ajuste conforme sua app)
EXPOSE 3000

# 8. Comando para iniciar o bot
CMD ["node", "index.js"]
