import { z } from 'zod'

export const AnswerKindSchema = z.enum([
    'summary',
    'details',
    'steps',
    'example',
    'note',
    'warning',
    'quote',
    'definition',
    'checklist',
    'pitfalls',
    'dosdonts',
    'compare',
    'mnemonic',
    'references',
])

export const AnswerPairDataSchema = z.object({
    term: z.string(),
    desc: z.string(),
})

export const AnswerColumnDataSchema = z.object({
    title: z.string(),
    items: z.array(z.string()),
})

export const AnswerTableDataSchema = z.object({
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
})

export const AnswerSectionDataSchema = z.object({
    kind: AnswerKindSchema,
    title: z.string().optional(),
    body: z.string().optional(),
    items: z.array(z.string()).optional(),
    pairs: z.array(AnswerPairDataSchema).optional(),
    columns: z.array(AnswerColumnDataSchema).optional(),
    table: AnswerTableDataSchema.optional(),
    variant: z.string().optional(),
    visualHint: z.string().optional(),
    author: z.string().optional(),
    migration: z.record(z.string(), z.unknown()).optional(),
})

export const QACardDataSchema = z.object({
    q: z.string(),
    a: z.array(AnswerSectionDataSchema),
})

export const LessonDataSchema = z.object({
    slug: z.string(),
    order: z.number(),
    title: z.string(),
    intro: z.string().optional(),
    cards: z.array(QACardDataSchema),
})

export const TopicDataSchema = z.object({
    slug: z.string(),
    order: z.number(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    lessonCount: z.number().optional(),
})
