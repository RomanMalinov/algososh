import { useState } from "react";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./queue-page.module.css";
import { useForm } from "../../hooks/use-form";
import { Queue } from "./utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { waitTime } from "../../constants/commonUtils";

export type TQueueElement = {
  value: string;
  state: ElementStates;
};

const ElementQueue = new Queue<TQueueElement | null>(7);

const defaultQueue: TQueueElement[] = Array.from({ length: 7 }, () => ({
  value: "",
  state: ElementStates.Default,
}));

export const QueuePage = () => {
  const { values, handleChange, setValues } = useForm({ string: "" });
  const [queueElements, setQueueElements] = useState<TQueueElement[]>(defaultQueue);
  const [queue, setQueue] = useState(ElementQueue);
  const [isAddingLoading, setAddingLoading] = useState(false);
  const [isDeletingLoading, setDeletingLoading] = useState(false);
  const [isClearingLoading, setClearingLoading] = useState(false);

  const pushToQueue = async () => {
    if (values.string) {
      setAddingLoading(true);
      setValues({ string: "" });
      ElementQueue.enqueue({ value: values.string, state: ElementStates.Default });
      setQueue(ElementQueue);
      queueElements[queue.getTail() - 1] = {
        value: "",
        state: ElementStates.Changing,
      };
      setQueueElements([...queueElements]);
      await waitTime(SHORT_DELAY_IN_MS);
      queueElements[queue.getTail() - 1] = {
        value: values.string,
        state: ElementStates.Changing,
      };
      setQueueElements([...queueElements]);
      queueElements[queue.getTail() - 1] = {
        value: values.string,
        state: ElementStates.Default,
      };
      setQueueElements([...queueElements]);
      setAddingLoading(false);
    }
  };

  const deleteFromQueue = async () => {
    setDeletingLoading(true);
    queue.dequeue();
    setQueue(queue);
    queueElements[queue.getHead() - 1] = {
      value: queueElements[queue.getHead() - 1].value,
      state: ElementStates.Changing,
    };
    setQueueElements([...queueElements]);
    await waitTime(SHORT_DELAY_IN_MS);
    queueElements[queue.getHead() - 1] = {
      value: "",
      state: ElementStates.Default,
    };
    setQueueElements([...queueElements]);
    setDeletingLoading(false);
  };

  const resetQueue = () => {
    setClearingLoading(true);
    ElementQueue.clear();
    setQueue(ElementQueue);
    setQueueElements(
      Array.from({ length: 7 }, () => ({
        value: "",
        state: ElementStates.Default,
      }))
    );
    setClearingLoading(false);
  };

  const head = (index: number) => (index === queue.getHead() && !queue.isEmpty()) ? "head" : null;
  const tail = (index: number) => (index === queue.getTail() - 1 && !queue.isEmpty()) ? "tail" : null;

  return (
    <SolutionLayout title="Очередь">
      <form className={styles.form}>
        <Input
          extraClass={styles.input}
          type="text"
          name="string"
          value={values.string}
          isLimitText
          maxLength={4}
          onChange={handleChange}
        />
        <Button
          type="submit"
          text="Добавить"
          isLoader={isAddingLoading}
          onClick={pushToQueue}
          disabled={!values.string || isDeletingLoading || isClearingLoading}
        />
        <Button
          extraClass={styles.button}
          text="Удалить"
          isLoader={isDeletingLoading}
          disabled={queue.isEmpty() || isAddingLoading || isClearingLoading}
          onClick={deleteFromQueue}
        />
        <Button
          text="Очистить"
          onClick={resetQueue}
          disabled={queue.isEmpty() || isAddingLoading || isDeletingLoading}
          isLoader={isClearingLoading}
        />
      </form>
      <div className={styles.array}>
        {queueElements && queueElements.map((element, index) => (
          <Circle
            key={index}
            state={element.state}
            letter={element.value}
            index={index}
            head={head(index)}
            tail={tail(index)}
          />
        ))}
      </div>
    </SolutionLayout>
  );
};
