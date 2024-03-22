import React, { useState } from "react";
import { HEAD, TAIL } from "../../constants/element-captions";
import { ElementStates } from "../../types/element-states";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { Input } from "../ui/input/input";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./queue-page.module.css";
import { useForm } from "../../hooks/use-form";
import { addToQueue, removeFromQueue } from "./utils";

type TQueueElement = {
  value: string;
  state: ElementStates;
};

export const QueuePage: React.FC = () => {
  const { values, handleChange, setValues } = useForm({ string: '' });
  const [queueElements, setQueueElements] = useState<Array<TQueueElement>>(Array(7).fill({ value: '', state: ElementStates.Default }));
  const [head, setHead] = useState<number>(-1);
  const [tail, setTail] = useState<number>(-1);
  const [isLoading, setLoading] = useState<{ enqueueBtn: boolean, dequeueBtn: boolean }>({ enqueueBtn: false, dequeueBtn: false });

  const handleAddToQueue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (tail < queueElements.length - 1) {
      setLoading({ ...isLoading, enqueueBtn: true });
      await addToQueue(values.string, queueElements, head, tail, setQueueElements, setHead, setTail);
      setLoading({ ...isLoading, enqueueBtn: false });
      setValues({ string: '' });
    }
  };

  const handleRemoveFromQueue = async () => {
    if (head <= tail) {
      setLoading({ ...isLoading, dequeueBtn: true });
      await removeFromQueue(queueElements, head, tail, setQueueElements, setHead, setTail);
      setLoading({ ...isLoading, dequeueBtn: false });
    }
  };

  const handleQueueClear = async () => {
    setQueueElements(Array(7).fill({ value: '', state: ElementStates.Default }));
    setHead(-1);
    setTail(-1);
  };

  return (
    <SolutionLayout title="Очередь">
      <form className={styles.form} onSubmit={handleAddToQueue}>
        <Input
          extraClass={styles.input}
          name="string"
          value={values.string}
          isLimitText
          maxLength={4}
          onChange={handleChange}
        />
        <Button
          type="submit"
          text="Добавить"
          isLoader={isLoading.enqueueBtn}
          disabled={values.string.length === 0 || tail === queueElements.length - 1}
        />
        <Button
          extraClass={styles.button}
          text="Удалить"
          isLoader={isLoading.dequeueBtn}
          onClick={handleRemoveFromQueue}
          disabled={head < 0}
        />
        <Button
          text="Очистить"
          onClick={handleQueueClear}
          disabled={head < 0}
          extraClass={styles.ml}
        />
      </form>
      <div className={styles.array}>
        {queueElements.map((element, index) => (
          <Circle
            key={index}
            index={index}
            letter={element.value}
            state={element.state}
            head={index === head ? HEAD : ''}
            tail={index === tail ? TAIL : ''}
          />
        ))}
      </div>
    </SolutionLayout>
  );
};
