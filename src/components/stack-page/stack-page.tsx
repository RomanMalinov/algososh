import { useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./stack-page.module.css";
import { useForm } from "../../hooks/use-form";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { operateStack, TArrayElement } from "./utils";

export const StackPage = () => {
  const { values, handleChange, setValues } = useForm({ inputValue: "" });
  const [elementsArray, setElementsArray] = useState<TArrayElement[]>([]);
  const [isLoading, setLoading] = useState({ add: false, delete: false, clear: false });

  const head = (element: TArrayElement) => (element === elementsArray[elementsArray.length - 1] ? "top" : null);

  return (
    <SolutionLayout title="Стек">
      <form className={styles.form}>
        <Input
          name="inputValue"
          type="text"
          value={values.inputValue}
          isLimitText
          maxLength={4}
          extraClass={styles.input}
          onChange={handleChange}
        />
        <Button
          extraClass={styles.button}
          text="Добавить"
          onClick={() => operateStack("add", values.inputValue, elementsArray, setElementsArray, setValues, setLoading)}
          disabled={!values.inputValue || isLoading.clear || isLoading.clear}
          isLoader={isLoading.add}
        />
        <Button
          text="Удалить"
          onClick={() => operateStack("delete", null, elementsArray, setElementsArray, setValues, setLoading)}
          disabled={elementsArray.length === 0 || isLoading.add || isLoading.clear}
          isLoader={isLoading.delete}
        />
        <Button
          text="Очистить"
          onClick={() => operateStack("clear", null, elementsArray, setElementsArray, setValues, setLoading)}
          disabled={elementsArray.length === 0 || isLoading.add || isLoading.delete}
          isLoader={isLoading.clear}
          extraClass={styles.clean}
        />
      </form>
      <div className={styles.array}>
        {elementsArray.map((element, index) => (
          <Circle key={index} letter={element.value} state={element.color} index={index} head={head(element)} />
        ))}
      </div>
    </SolutionLayout>
  );
};
