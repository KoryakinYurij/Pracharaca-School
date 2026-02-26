import { ru } from './ru'

export type LocaleKey = keyof typeof ru

/** Simple string lookup. Returns the Russian string for the given key. */
export function t(key: LocaleKey): string {
    return ru[key]
}
