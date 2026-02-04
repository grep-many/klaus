export const recentData = <T>(length: number, data: T[]): T[] => {
  if (data.length <= 0 || length === 0) return [];
  return data.splice(-length);
};
