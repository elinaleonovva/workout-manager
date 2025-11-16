#!/bin/bash

# Скрипт для пересборки фронтенда без кэша

echo "Остановка контейнеров..."
docker-compose down

echo "Удаление старого образа фронтенда..."
docker rmi workout-manager-frontend 2>/dev/null || true

echo "Пересборка фронтенда без кэша..."
docker-compose build --no-cache frontend

echo "Запуск контейнеров..."
docker-compose up -d

echo "Проверка логов фронтенда..."
docker-compose logs -f frontend

