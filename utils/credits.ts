/** Russian count for the word «кредит». */
export function creditsLabel(count: number): string {
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} кредит`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} кредита`;
  }
  return `${count} кредитов`;
}
