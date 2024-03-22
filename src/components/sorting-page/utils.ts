import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { waitTime } from "../../constants/commonUtils";
import { Direction } from "../../types/direction";
import { ElementStates } from "../../types/element-states";

export const swap = <T>(array: T[], first: number, second: number): T[] => {
  [array[first], array[second]] = [array[second], array[first]];
  return array;
};

type TArrayElement = {
  value: number;
  state: ElementStates;
};


export const bubbleSort = async (arr: Array<TArrayElement>, direction: Direction, setArrayCallback: Function) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      arr[j].state = arr[j + 1].state = ElementStates.Changing;
      setArrayCallback([...arr]);
      await waitTime(SHORT_DELAY_IN_MS);
      if (direction === Direction.Ascending && arr[j].value > arr[j + 1].value) {
        swap(arr, j, j + 1);
      } else if (direction === Direction.Descending && arr[j].value < arr[j + 1].value) {
        swap(arr, j, j + 1);
      }
      arr[j].state = arr[j + 1].state = ElementStates.Default;
      setArrayCallback([...arr]);
    }
    arr[arr.length - i - 1].state = ElementStates.Modified;
    setArrayCallback([...arr]);
  }
};

export const selectSort = async (arr: Array<TArrayElement>, direction: Direction, setArrayCallback: Function) => {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      arr[i].state = arr[j].state = ElementStates.Changing;
      setArrayCallback([...arr]);
      await waitTime(SHORT_DELAY_IN_MS);
      if (direction === Direction.Ascending && arr[j].value < arr[min].value) {
        min = j;
      } else if (direction === Direction.Descending && arr[j].value > arr[min].value) {
        min = j;
      }
      arr[j].state = ElementStates.Default;
      setArrayCallback([...arr]);
    }
    swap(arr, i, min);
    arr[i].state = ElementStates.Modified;
    setArrayCallback([...arr]);
  }
  arr[arr.length - 1].state = ElementStates.Modified;
  setArrayCallback([...arr]);
};
