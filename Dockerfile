FROM node:20-bullseye

WORKDIR /usr/src/app

# Copy package files first to leverage Docker cache
COPY package*.json ./

RUN apt-get update && apt-get install -y         wget gnupg ca-certificates fonts-liberation libnss3 libatk1.0-0         libatk-bridge2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxrandr2         libasound2 libgbm1 libgtk-3-0 chromium       && rm -rf /var/lib/apt/lists/*

RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/index.js"]
