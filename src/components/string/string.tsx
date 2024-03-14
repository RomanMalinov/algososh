import { useState } from "react";
import styles from "./string.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { ElementStates } from "../../types/element-states";
import { Input } from "../ui/input/input";
import { DELAY_IN_MS } from "../../constants/delays";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { waitTime } from "./utils";
import { useForm } from "../../hooks/use-form";

export type TArrayElement = {
  value: string;
  color: ElementStates;
};

const reverseStringArray = async (
  arr: TArrayElement[] | [],
  setArr: React.Dispatch<React.SetStateAction<TArrayElement[]>>
) => {
  const length = arr.length;
  const mid = Math.floor(length / 2);

  for (let i = 0; i < mid; i++) {
    const j = length - 1 - i;

    [arr[i], arr[j]] = [arr[j], arr[i]];

    arr[i].color = arr[j].color = ElementStates.Changing;
    setArr([...arr]);

    await waitTime(DELAY_IN_MS);

    arr[i].color = arr[j].color = ElementStates.Modified;
    setArr([...arr]);
  }
};

export const StringComponent = () => {
  const { values, handleChange } = useForm({ string: "" });
  const [elementsArray, setElementsArray] = useState<Array<TArrayElement>>([]);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const string = values.string.trim();
    const arr = string.split("").map((value) => ({ value, color: ElementStates.Default }));
    setElementsArray([...arr]);
    await waitTime(DELAY_IN_MS);
    await reverseStringArray(arr, setElementsArray);
    setLoading(false);
  };

  return (
    <SolutionLayout title="Строка">
      <form
        className={styles.form}
        onSubmit={(e: React.FormEvent) => handleSubmit(e)}
      >
        <Input
          maxLength={11}
          isLimitText
          value={values.string}
          name="string"
          onChange={handleChange}
        />
        <Button
          text="Развернуть"
          type="submit"
          disabled={!values.string}
          isLoader={isLoading}
        />
      </form>
      <div className={styles.array}>
        {elementsArray &&
          elementsArray.map((element, index) => (
            <Circle
              key={index}
              letter={element.value}
              state={element.color}
            />
          ))}
      </div>
    </SolutionLayout>
  );
};
