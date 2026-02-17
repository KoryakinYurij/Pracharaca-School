# Структура контента

## Файлы

Все материалы организованы по темам в папке `content/topics/`. Каждая тема имеет свою подпапку со следующим содержимым:

- **Метаданные темы**: `content/topics/<topic-slug>/meta.json`
- **Уроки**: `content/topics/<topic-slug>/lessons/<order>-<slug>.json`

Примеры путей:
- `content/topics/noble-notes/meta.json`
- `content/topics/noble-notes/lessons/01-introduction.json`

## meta.json

Файл `meta.json` содержит описание темы и параметры её отображения в списке.

```json
{
  "slug": "noble-notes",
  "order": 1,
  "title": "Красивый конспект",
  "subtitle": "Локальный формат обучения",
  "description": "Краткое описание темы для карточки на главной странице"
}
```

### Поля meta.json

| Поле | Тип | Описание |
|------|-----|----------|
| `slug` | `string` | Уникальный идентификатор темы (используется в URL) |
| `order` | `number` | Порядковый номер для сортировки в списке тем |
| `title` | `string` | Основное название темы |
| `subtitle` | `string` | Подзаголовок |
| `description` | `string` | Описание для карточки темы |

## Схема урока

Уроки располагаются в папке `lessons/` внутри папки темы.

```json
{
  "slug": "qa-craft",
  "order": 2,
  "title": "Композиция Q/A карточек",
  "intro": "Короткое вступление (опционально)",
  "cards": [
    {
      "q": "Вопрос?",
      "a": [
        { "kind": "summary", "body": "1-2 предложения" }
      ]
    }
  ]
}
```

## Типы секций ответа

Секции ответа имеют поле `kind`, определяющее тип рендеринга.

**Поддерживаемые kind:**

| Kind | Поля | Описание |
|------|------|----------|
| `summary` | `body` | Короткая выжимка |
| `details` | `body` | Основной развёрнутый ответ |
| `steps` | `items` или `body` | Пошаговый список |
| `example` | `body` | Конкретный сценарий |
| `note` | `body` | Уточняющая заметка |
| `warning` | `body` | Важное ограничение |
| `quote` | `body` | Формула-принцип |
| `definition` | `pairs` | Список терминов |
| `checklist` | `items` | Чеклист |
| `pitfalls` | `items` или `body` | Частые ошибки |
| `dosdonts` | `columns` | Делай / не делай |
| `compare` | `columns` или `table` | Сравнение |
| `mnemonic` | `body` | Запоминалка |
| `references` | `items` | Источники |

## Полная документация

Подробное руководство по структуре уроков и карточек: **[CONTENT_GUIDE.md](../CONTENT_GUIDE.md)**
