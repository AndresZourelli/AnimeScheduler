export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  console.log(list.map((anime) => anime.title));
  result.splice(endIndex, 0, removed);
  console.log(result.map((anime) => anime.title));
  return result;
};

export const isStringNullOrEmpty = (value: string): boolean => {
  return !value || !value.trim();
};

export const isStringNullOrUndefined = (value: string): boolean => {
  return value === null || value === undefined;
};
