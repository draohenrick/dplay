# Usa Node 18 (leve e compatível com venom-bot)
FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Instala git (necessário para dependências com repositórios git)
RUN apk add --no-cache git

# Copia apenas os arquivos de dependências primeiro
COPY package.json yarn.lock ./

# Habilita Corepack (necessário para Yarn moderno)
RUN corepack enable

# Instala dependências (modo compatível com Yarn 4)
RUN yarn install --mode skip-builds --network-timeout 100000

# Copia o restante do projeto
COPY . .

# Expõe a porta (caso tenha servidor express)
EXPOSE 3000

# Comando de inicialização
CMD ["yarn", "start"]
