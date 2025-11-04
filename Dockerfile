# 1. Usa imagem Node.js base
FROM node:18-alpine

# 2. Define o diretório de trabalho
WORKDIR /app

# 3. Instala Git (necessário para dependências git)
RUN apk add --no-cache git

# 4. Copia os arquivos de configuração
COPY package.json yarn.lock ./

# 5. Ativa Corepack e instala dependências
RUN corepack enable
RUN yarn install

# 6. Copia o restante do código
COPY . .

# 7. Define o comando padrão
CMD ["yarn", "start"]
