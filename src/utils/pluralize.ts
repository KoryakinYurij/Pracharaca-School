/**
 * Возвращает правильную форму существительного в зависимости от числа.
 * @param count Число
 * @param forms Массив из трех форм: [один, два-четыре, много] (например: ['урок', 'урока', 'уроков'])
 */
export function pluralizeRu(count: number, forms: [string, string, string]): string {
  const mod10 = Math.abs(count) % 10
  const mod100 = Math.abs(count) % 100

  let word = forms[2]

  if (mod100 > 10 && mod100 < 20) {
    word = forms[2]
  } else if (mod10 > 1 && mod10 < 5) {
    word = forms[1]
  } else if (mod10 === 1) {
    word = forms[0]
  }

  return `${count} ${word}`
}
