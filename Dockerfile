# Usa Node 18 (leve e compatível com venom-bot)
FROM node:18-alpine

# Define diretório de trabalho
WORKDIR /app

# Instala git (necessário para dependências com repositórios git)
RUN apk add --no-cache git

# Copia apenas os arquivos de dependências primeiro
COPY package.json yarn.lock ./

# Ativa o Corepack (para usar Yarn moderno)
RUN corepack enable

# Instala dependências (modo compatível com Yarn 4)
RUN yarn install --mode skip-build --network-timeout 100000

# Copia o restante do projeto
COPY . .

# Expõe a porta do servidor (caso use Express)
EXPOSE 3000

# Comando de inicialização
CMD ["yarn", "start"]
