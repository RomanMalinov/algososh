export const waitTime = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const randomArr = (minLen: number, maxLen: number, minValue: number = 0, maxValue: number = 100): number[] => {
  const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const length = getRandomInt(minLen, maxLen);
  return Array.from({ length }, () => getRandomInt(minValue, maxValue));
};

export const swap = <T>(array: T[], first: number, second: number): T[] => {
  [array[first], array[second]] = [array[second], array[first]];
  return array;
};
