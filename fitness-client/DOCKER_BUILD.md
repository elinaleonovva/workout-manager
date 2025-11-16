# Инструкция по сборке Docker образа фронтенда

## Проблема с кэшированием

Если после изменений в коде фронтенд не обновляется в Docker, это может быть связано с кэшированием слоев Docker.

## Решение

### Вариант 1: Пересборка без кэша (рекомендуется)
```bash
docker-compose build --no-cache frontend
docker-compose up -d
```

### Вариант 2: Полная пересборка всех сервисов
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Вариант 3: Удаление volume и пересборка
```bash
docker-compose down -v
docker-compose build --no-cache frontend
docker-compose up -d
```

## Как это работает

1. Dockerfile копирует все исходные файлы (`COPY . .`)
2. Запускается сборка (`npm run build`)
3. Собранные файлы копируются в volume `/app/build-volume`
4. Nginx обслуживает файлы из этого volume

## Проверка

После пересборки проверьте логи:
```bash
docker-compose logs frontend
```

Вы должны увидеть сообщение: "Build files successfully copied to volume"

