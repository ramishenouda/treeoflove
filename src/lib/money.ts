export function parseEurosToCents(value: string) {
  const trimmed = value.trim().replace(',', '.')
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null
  const [whole, fraction = ''] = trimmed.split('.')
  const cents = Number(whole) * 100 + Number((fraction + '00').slice(0, 2))
  if (!Number.isInteger(cents) || cents <= 0) return null
  return cents
}

export function eurosFromCents(cents: number) {
  return Number((cents / 100).toFixed(2))
}
