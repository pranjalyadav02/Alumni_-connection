export function containsProfanity(text: string): boolean {
  const words = ['badword']
  const lower = text.toLowerCase()
  return words.some(w => lower.includes(w))
}
