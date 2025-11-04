# 1. Define a imagem base
FROM node:20-alpine

# 2. Cria diretório da aplicação
WORKDIR /usr/src/app

# 3. Copia arquivos de configuração primeiro
COPY package.json yarn.lock* ./

# 4. Habilita o Corepack (para Yarn 4)
RUN corepack enable

# 5. Instala dependências
RUN yarn install

# 6. Copia o restante do código
COPY . .

# 7. Expõe a porta e inicia o app
EXPOSE 3000
CMD ["yarn", "start"]
