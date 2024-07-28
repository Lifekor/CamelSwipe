
export const abbreviateNumber = (value: number): string => {
  const suffixes = ['', 'k', 'M', 'B', 'T'];
  let suffixIndex = 0;

  while (value >= 1000 && suffixIndex < suffixes.length - 1) {
    value /= 1000;
    suffixIndex++;
  }

  return Math.floor(value) + suffixes[suffixIndex];
};