FROM node:18

WORKDIR /app

# ARG для принудительной пересборки при изменении (можно передать BUILD_DATE)
ARG BUILD_DATE=unknown
ENV BUILD_DATE=${BUILD_DATE}

# Копируем package файлы для кэширования зависимостей
COPY package.json package-lock.json ./

# Устанавливаем зависимости (используем npm ci для более надежной установки)
RUN npm ci

# Копируем все исходные файлы
# Важно: этот слой будет пересобираться при изменении любых файлов в проекте
# Docker сравнивает хэши файлов, поэтому изменения в src/, public/, styles/ будут обнаружены
COPY . .

# Собираем приложение в папку /app/build
RUN npm run build

# Создаем скрипт для копирования файлов в volume при запуске контейнера
RUN echo '#!/bin/sh\n\
echo "Copying build files to volume..."\n\
if [ -d "/app/build" ] && [ -d "/app/build-volume" ]; then\n\
  rm -rf /app/build-volume/*\n\
  cp -r /app/build/* /app/build-volume/\n\
  echo "Build files successfully copied to volume"\n\
else\n\
  echo "Error: Build directory or volume directory not found"\n\
fi\n\
echo "Keeping container alive..."\n\
tail -f /dev/null' > /copy-build.sh && chmod +x /copy-build.sh

# Запускаем скрипт копирования при старте контейнера
CMD ["/copy-build.sh"]
