import { useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./stack-page.module.css";
import { useForm } from "../../hooks/use-form";
import { Input } from "../ui/input/input";
import { ElementStates } from "../../types/element-states";
import { waitTime } from "../../constants/commonUtils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Stack } from "./utils";

type TArrayElement = {
  value: string;
  state: ElementStates;
};

export const ElementStack = new Stack<TArrayElement>();

export const StackPage = () => {
  const { values, handleChange, setValues } = useForm({ stack: "" });
  const [elementsArray, setElementsArray] = useState<TArrayElement[]>([]);
  const [isAddingLoading, setAddingLoading] = useState(false);
  const [isDeletingLoading, setDeletingLoading] = useState(false);
  const [isClearingLoading, setClearingLoading] = useState(false);

  const pushToStack = async (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    if (values.stack) {
      setAddingLoading(true);
      ElementStack.push({
        value: values.stack,
        state: ElementStates.Changing,
      });
      setElementsArray([...ElementStack.getElements()]);
      setValues({ stack: "" });
      await waitTime(SHORT_DELAY_IN_MS);
      ElementStack.peak().state = ElementStates.Default;
      setElementsArray([...ElementStack.getElements()]);
      setAddingLoading(false);
    }
  };

  const deleteFromStack = () => {
    setClearingLoading(true);
    ElementStack.clear();
    setElementsArray([]);
    setClearingLoading(false);
  };

  const resetStack = async () => {
    if (ElementStack.getElements().length !== 0) {
      if (ElementStack.peak()) {
        ElementStack.peak().state = ElementStates.Changing;
      }
      setDeletingLoading(true);
      setElementsArray([...ElementStack.getElements()]);
      await waitTime(SHORT_DELAY_IN_MS);
      ElementStack.pop();
      if (ElementStack.peak()) {
        ElementStack.peak().state = ElementStates.Default;
      }
      setElementsArray([...ElementStack.getElements()]);
      setDeletingLoading(false);
    }
  };

  return (
    <SolutionLayout title="Стек">
      <form className={styles.form}>
        <Input
          name="stack"
          type="text"
          value={values.stack}
          isLimitText
          maxLength={4}
          extraClass={styles.input}
          onChange={handleChange}
        />
        <Button
          text="Добавить"
          type="submit"
          onClick={pushToStack}
          disabled={!values.stack || isClearingLoading || isAddingLoading}
          isLoader={isAddingLoading}
        />
        <Button
          extraClass={styles.button}
          text="Удалить"
          onClick={resetStack}
          disabled={elementsArray.length === 0 || isAddingLoading || isClearingLoading}
          isLoader={isDeletingLoading}
        />
        <Button
          text="Очистить"
          onClick={deleteFromStack}
          disabled={elementsArray.length === 0 || isAddingLoading || isDeletingLoading}
          isLoader={isClearingLoading}
        />
      </form>
      <div className={styles.array}>
        {elementsArray &&
          elementsArray.map((element, index) => (
            <Circle
              key={index}
              letter={element.value}
              state={element.state}
              index={index}
              head={ElementStack.head(element) ? "top" : null}
            />
          ))}
      </div>
    </SolutionLayout>
  );
};
