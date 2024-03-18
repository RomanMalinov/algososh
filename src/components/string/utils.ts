import { ElementStates } from "../../types/element-states";
import { waitTime } from "../../constants/commonUtils";
import { DELAY_IN_MS } from "../../constants/delays";

export type TArrayElement = {
  value: string;
  color: ElementStates;
};

export const reverseStringArray = async (
  arr: TArrayElement[] | [],
  setArr: React.Dispatch<React.SetStateAction<TArrayElement[]>>
) => {
  const length = arr.length;
  const mid = Math.floor(length / 2);

  const newArr = [...arr];

  for (let i = 0; i < mid; i++) {
    const j = length - 1 - i;

    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];

    newArr[i].color = newArr[j].color = ElementStates.Changing;
    setArr([...newArr]);

    await waitTime(DELAY_IN_MS);

    newArr[i].color = newArr[j].color = ElementStates.Modified;
    setArr([...newArr]);
  }
};
