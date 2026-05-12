export const avg = (arr: number[]): number => {
  return arr.length
    ? Math.round(arr.reduce((sum, val) => sum + val, 0) / arr.length)
    : 0;
};
