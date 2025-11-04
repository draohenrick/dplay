FROM node:20

WORKDIR /usr/src/app

# Copia package.json e yarn.lock
COPY package.json yarn.lock ./

# Ativa Corepack e instala dependências
RUN corepack enable
RUN yarn install --immutable

# Copia o restante do projeto
COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
