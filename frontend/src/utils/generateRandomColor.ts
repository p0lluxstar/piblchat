export function generateRandomColor(): string {
  const r = Math.floor(Math.random() * 156 + 50).toString(16);
  const g = Math.floor(Math.random() * 156 + 50).toString(16);
  const b = Math.floor(Math.random() * 156 + 50).toString(16);

  return `#${r.padStart(2, '0')}${g.padStart(2, '0')}${b.padStart(2, '0')}`;
}
