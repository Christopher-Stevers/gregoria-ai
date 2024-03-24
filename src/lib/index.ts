export const capitalize = (value: string) => {
  const firstLetter = value.slice(0, 1);
  const otherLetters = value.slice(1);
  return firstLetter.toUpperCase().concat(otherLetters);
};

export const getUniqueArray = (array: string[]) => {
  return [...new Set(array)];
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
