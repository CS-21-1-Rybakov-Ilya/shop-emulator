FROM node:21.2.0

WORKDIR /shop-emulator

# Копируем файлы package.json и package-lock.json в рабочую директорию
COPY package.json .
COPY package-lock.json .

RUN npm install

# Копируем остальные файлы приложения в рабочую директорию
COPY . .

EXPOSE 3000


CMD ["node", "app.js"]
