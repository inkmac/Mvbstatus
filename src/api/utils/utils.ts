export function zipLongest(keys: string[], values: string[], fillValue: string = ''): Record<string, string> {
  if (keys.length < values.length)
    throw new Error('keys.length must be longer than values.length')

  const length = keys.length
  const result: Record<string, string> = {}

  for (let i = 0; i < length; i++) {
    result[keys[i]] = values[i] || fillValue
  }

  return result;
}