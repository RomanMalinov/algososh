import { useState, useEffect } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./sorting-page.module.css"
import { RadioInput } from "../ui/radio-input/radio-input";
import { Button } from "../ui/button/button";
import { Column } from "../ui/column/column";
import { Direction } from "../../types/direction";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { ElementStates } from "../../types/element-states";
import { randomArr, swap, waitTime } from "./utils";

type TArrayElement = {
  value: number;
  state: ElementStates;
};

type TLoadingState = {
  ascLoading: boolean;
  descLoading: boolean;
  newArrLoading: boolean;
};

type TDisabledState = {
  ascLoading: boolean;
  descLoading: boolean;
  newArrLoading: boolean;
};

const initialButtonState = {
  ascLoading: false,
  descLoading: false,
  newArrLoading: false,
};

export const SortingPage = () => {
  const [array, setArray] = useState<Array<TArrayElement>>([]);
  const [sortType, setSortType] = useState<string>('select');
  const [isLoading, setIsLoading] = useState<TLoadingState>(initialButtonState);
  const [isDisabled, setIsDisabled] = useState<TDisabledState>(initialButtonState);

  useEffect(() => {
    setArray(randomArr(3, 17).map(i => {
      return { value: i, state: ElementStates.Default }
    }));
  }, []);

  const bubbleSort = async (arr: Array<TArrayElement>, direction: Direction) => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        arr[j].state = arr[j + 1].state = ElementStates.Changing;
        setArray([...arr]);
        await waitTime(SHORT_DELAY_IN_MS);
        if (direction === Direction.Ascending && arr[j].value > arr[j + 1].value) {
          swap(arr, j, j + 1);
        } else if (direction === Direction.Descending && arr[j].value < arr[j + 1].value) {
          swap(arr, j, j + 1);
        }
        arr[j].state = arr[j + 1].state = ElementStates.Default;
        setArray([...arr]);
      }
      arr[arr.length - i - 1].state = ElementStates.Modified;
      setArray([...arr]);
    }
  };

  const selectSort = async (arr: Array<TArrayElement>, direction: Direction) => {
    for (let i = 0; i < arr.length - 1; i++) {
      let min = i;
      for (let j = i + 1; j < arr.length; j++) {
        arr[i].state = arr[j].state = ElementStates.Changing;
        setArray([...arr]);
        await waitTime(SHORT_DELAY_IN_MS);
        if (direction === Direction.Ascending && arr[j].value < arr[min].value) {
          min = j;
        } else if (direction === Direction.Descending && arr[j].value > arr[min].value) {
          min = j;
        }
        arr[j].state = ElementStates.Default;
        setArray([...arr]);
      }
      swap(arr, i, min);
      arr[i].state = ElementStates.Modified;
      setArray([...arr]);
    }
    arr[arr.length - 1].state = ElementStates.Modified;
    setArray([...arr]);
  };

  const handleSort = async (direction: Direction) => {
    setIsLoading({ ...isLoading, ascLoading: direction === Direction.Ascending, descLoading: direction === Direction.Descending });
    setIsDisabled({ ...isDisabled, ascLoading: true, descLoading: true, newArrLoading: true });
    const sortingFunction = sortType === 'bubble' ? bubbleSort : selectSort;
    await sortingFunction(array, direction);
    setIsLoading({ ...isLoading, ascLoading: false, descLoading: false });
    setIsDisabled({ ...isDisabled, ascLoading: false, descLoading: false, newArrLoading: false });
  };

  const handleAscendingSort = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleSort(Direction.Ascending);
  };

  const handleDescendingSort = async () => {
    await handleSort(Direction.Descending);
  };

  const generateRandomArray = () => {
    setArray(randomArr(3, 17).map(value => ({ value, state: ElementStates.Default })));
  };

  return (
    <SolutionLayout title="Сортировка массива">
      <form className={styles.form} onSubmit={handleAscendingSort}>
        <RadioInput
          label="Выбор"
          onChange={() => setSortType("select")}
          checked={sortType === "select"}
        />
        <RadioInput
          extraClass={styles.radioInput}
          label="Пузырек"
          onChange={() => setSortType("bubble")}
          checked={sortType === "bubble"}
        />
        <Button
          extraClass={styles.buttonFixedSize}
          text="По возрастанию"
          isLoader={isLoading.ascLoading}
          type="submit"
          sorting={Direction.Ascending}
          disabled={isDisabled.ascLoading}
        />
        <Button
          extraClass={`${styles.button} ${styles.buttonFixedSize}`}
          text="По убыванию"
          isLoader={isLoading.descLoading}
          onClick={handleDescendingSort}
          sorting={Direction.Descending}
          disabled={isDisabled.descLoading}
        />
        <Button
          text="Новый массив"
          onClick={generateRandomArray}
          disabled={isDisabled.newArrLoading}
        />
      </form>
      <div className={styles.array}>
        {array.map((element, index) => (
          <Column
            key={index}
            index={element.value}
            state={element.state} />
        ))}
      </div>
    </SolutionLayout>
  );
};
