export function getColorValue(name: string) {
  const cleanName = name.trim().toLowerCase().replace(/\s+/g, '')
  const colors = [
    { name: 'black', value: '#111827' },
    { name: 'white', value: '#f8fafc' },
    { name: 'red', value: '#ef4444' },
    { name: 'blue', value: '#3b82f6' },
    { name: 'skyblue', value: '#38bdf8' },
    { name: 'lightblue', value: '#7dd3fc' },
    { name: 'cyan', value: '#06b6d4' },
    { name: 'green', value: '#22c55e' },
    { name: 'yellow', value: '#facc15' },
    { name: 'orange', value: '#f97316' },
    { name: 'gold', value: '#f59e0b' },
    { name: 'silver', value: '#cbd5e1' },
    { name: 'magenta', value: '#d946ef' },
    { name: 'purple', value: '#8b5cf6' },
    { name: 'violet', value: '#7c3aed' },
    { name: 'pink', value: '#ec4899' },
    { name: 'gray', value: '#94a3b8' },
    { name: 'grey', value: '#94a3b8' },
    { name: 'brown', value: '#92400e' },
  ]
  const foundColor = colors.find((color) => color.name === cleanName)

  if (foundColor) {
    return foundColor.value
  }

  if (/^[a-z]+$/.test(cleanName)) {
    return cleanName
  }

  return '#94a3b8'
}
