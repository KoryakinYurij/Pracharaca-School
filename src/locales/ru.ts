/**
 * Russian UI strings dictionary.
 * All user-facing text should be referenced from here.
 */
export const ru = {
    // ErrorBoundary — page variant
    'error.title': 'Произошла ошибка',
    'error.description': 'К сожалению, что-то пошло не так. Попробуйте обновить страницу или вернуться позже.',
    'error.reload': 'Обновить страницу',
    // ErrorBoundary — inline variant
    'error.sectionRender': 'Ошибка рендеринга секции',
    'error.retry': 'Повторить',

    // LessonPage
    'lesson.notFound': 'Урок не найден',
    'lesson.notFoundHint': 'Проверьте ссылку или вернитесь к списку уроков.',
    'lesson.backToTopics': 'К темам',
    'lesson.backToLessons': 'К урокам',
    'lesson.lessonLabel': 'Урок',
    'lesson.cardsAriaLabel': 'Карточки вопрос-ответ',

    // TopicPage
    'topic.notFound': 'Тема не найдена',
    'topic.notFoundHint': 'Проверьте ссылку или вернитесь на главную.',
    'topic.backToHome': 'На главную',
    'topic.backToTopics': 'К темам',
    'topic.lessonsAriaLabel': 'Список уроков',
    'topic.lessonsHeading': 'Уроки',

    // TopicsListingPage
    'topics.ariaLabel': 'Темы',
    'topics.heading': 'Темы',

    // PrevNextNav
    'nav.previous': 'Предыдущий',
    'nav.next': 'Следующий',
    'nav.ariaLabel': 'Навигация по урокам',

    // AnswerSection labels
    'section.summary': 'Выжимка',
    'section.details': 'Детали',
    'section.steps': 'Шаги',
    'section.example': 'Пример',
    'section.note': 'Заметка',
    'section.warning': 'Важно',
    'section.quote': 'Цитата',
    'section.definition': 'Определения',
    'section.checklist': 'Чеклист',
    'section.pitfalls': 'Частые ошибки',
    'section.dosdonts': 'Делай / Не делай',
    'section.compare': 'Сравнение',
    'section.mnemonic': 'Запоминалка',
    'section.references': 'Источники',

    // Adapters / Fallbacks
    'fallback.noData': 'Нет данных',
    'fallback.termN': 'Термин',
    'fallback.columnN': 'Колонка',
    'fallback.headerItem': 'Пункт',

    // Loader errors
    'loader.cantExtractSlug': 'Невозможно извлечь slug темы из пути',
    'loader.topicValidationError': 'Ошибка валидации данных темы в файле',
    'loader.lessonValidationError': 'Ошибка валидации данных урока в файле',
} as const
