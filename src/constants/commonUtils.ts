import { ElementStates } from "../types/element-states";

export const waitTime = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const randomArr = (minLen: number, maxLen: number, minValue: number = 0, maxValue: number = 100): number[] => {
  const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const length = getRandomInt(minLen, maxLen);
  return Array.from({ length }, () => getRandomInt(minValue, maxValue));
};

export type TArrayElement = {
  value: string;
  state: ElementStates;
}

export const modifyArrayElementState = (
  func: React.Dispatch<React.SetStateAction<TArrayElement[]>>,
  arr: TArrayElement[],
  index: number,
  state: ElementStates,
  value?: string
) => {
  func(arr => arr.map((item, currIndex) => {
    if (currIndex === Number(index)) {
      return value != null ? { value, state } : { ...item, state }
    } else {
      return item;
    }
  }))
}

type TupdateCircleState = {
  value: string;
  state: ElementStates;
}
export const updateCircleState = (
  setFunc: React.Dispatch<React.SetStateAction<TupdateCircleState[]>>,
  index: number,
  state: ElementStates,
  value?: string
) => {
  setFunc(prevArr => prevArr.map((element, currIndex) => {
    if (currIndex === index) {
      return { ...element, state, value: value ?? element.value };
    }
    return element;
  }));
}

