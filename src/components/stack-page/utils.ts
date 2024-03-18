import { useState, Dispatch, SetStateAction } from "react";
import { ElementStates } from "../../types/element-states";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { waitTime } from "../../constants/commonUtils";

export type TArrayElement = {
  value: string;
  color: ElementStates;
};

export const operateStack = async (
  action: string,
  inputValue: string | null,
  elementsArray: TArrayElement[],
  setElementsArray: Dispatch<SetStateAction<TArrayElement[]>>,
  setValues: Dispatch<SetStateAction<{ inputValue: string }>>,
  setLoading: Dispatch<SetStateAction<{ add: boolean; delete: boolean; clear: boolean }>>
): Promise<void> => {
  if (action === "clear") {
    setLoading((prevState) => ({ ...prevState, [action]: true }));
    setElementsArray([]);
  } else if (action === "delete" && elementsArray.length > 0) {
    setLoading((prevState) => ({ ...prevState, [action]: true }));
    await waitTime(SHORT_DELAY_IN_MS);
    setElementsArray((prevStack) => prevStack.slice(0, -1));
  } else if (action === "add" && inputValue) {
    setLoading((prevState) => ({ ...prevState, [action]: true }));
    setElementsArray((prevElementsArray) => [
      ...prevElementsArray,
      { value: inputValue, color: ElementStates.Changing },
    ]);
    setValues({ inputValue: "" });
    await waitTime(SHORT_DELAY_IN_MS);
    setElementsArray((prevElementsArray) => {
      const newStack = [...prevElementsArray];
      const peakItem = newStack[newStack.length - 1];
      if (peakItem) peakItem.color = ElementStates.Default;
      return newStack;
    });
  }
  setLoading((prevState) => ({ ...prevState, [action]: false }));
};
