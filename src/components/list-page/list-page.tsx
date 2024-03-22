import { useState, useEffect } from "react";
import styles from "./list-page.module.css";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import { useForm } from "../../hooks/use-form";
import { ElementStates } from "../../types/element-states";
import { waitTime, modifyArrayElementState, randomArr } from "../../constants/commonUtils";
import { DELAY_IN_MS } from "../../constants/delays";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { ArrowIcon } from "../ui/icons/arrow-icon";
import { HEAD, TAIL } from "../../constants/element-captions";
import { LinkedList } from "./linked-list";


export type TArrayElement = {
  value: string;
  state: ElementStates;
}

type TInput = {
  string: string;
  index: number | null;
};

const linkedList = new LinkedList<string>()

export const ListPage = () => {
  const { values, handleChange, setValues } = useForm<TInput>({ string: '', index: null })
  const [listArray, setlistArray] = useState<TArrayElement[]>([]);
  const [deletingValue, setDeletingValue] = useState<string>('');
  const [currentEltIndex, setCurrentEltIndex] = useState<number>(-1);
  const [operationState, setOperationState] = useState({
    addHead: false,
    addTail: false,
    delHead: false,
    delTail: false,
    addAtIndex: false,
    delAtIndex: false,
  });
  const [isLoading, setLoading] = useState({
    addToHeadBtn: false,
    addTail: false,
    delHead: false,
    delTail: false,
    addAtIndex: false,
    delAtIndex: false,
  });

  useEffect(() => {
    if (linkedList.getLength() < 4) {
      randomArr(4 - linkedList.getLength(), 4 - linkedList.getLength()).map(i => linkedList.prepend(i.toString()))
    }
    setlistArray(linkedList.toArray().map(i => {
      return { value: i.value, state: ElementStates.Default }
    }))
  }, []);

  const updateArrayElements = (obj: LinkedList<string>) => {
    setlistArray(obj.toArray().map(i => ({ value: i.value, state: ElementStates.Default })));
  };

  const addElementHead = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading({ ...isLoading, addToHeadBtn: true });
    setOperationState({ ...operationState, addHead: true });
    linkedList.append(values.string);
    await waitTime(DELAY_IN_MS);
    setOperationState({ ...operationState, addHead: false });
    updateArrayElements(linkedList);
    modifyArrayElementState(setlistArray, listArray, 0, ElementStates.Modified);
    await waitTime(DELAY_IN_MS);
    modifyArrayElementState(setlistArray, listArray, 0, ElementStates.Default);
    setLoading({ ...isLoading, addToHeadBtn: false });
    setValues({ ...values, string: '' });
  };

  const addElementTail = async () => {
    setLoading({ ...isLoading, addTail: true });
    setOperationState({ ...operationState, addTail: true });
    linkedList.prepend(values.string);
    await waitTime(DELAY_IN_MS);
    setOperationState({ ...operationState, addTail: false });
    updateArrayElements(linkedList);
    modifyArrayElementState(setlistArray, listArray, listArray.length, ElementStates.Modified);
    await waitTime(DELAY_IN_MS);
    modifyArrayElementState(setlistArray, listArray, listArray.length, ElementStates.Default);
    setLoading({ ...isLoading, addTail: false });
    setValues({ ...values, string: '' });
  };

  const deleteElementFromHead = async () => {
    setLoading({ ...isLoading, delHead: true });
    setOperationState({ ...operationState, delHead: true });
    setDeletingValue(listArray[0].value);
    linkedList.deleteHead();
    modifyArrayElementState(setlistArray, listArray, 0, ElementStates.Default, '');
    await waitTime(DELAY_IN_MS);
    updateArrayElements(linkedList);
    setLoading({ ...isLoading, delHead: false });
    setOperationState({ ...operationState, delHead: false });
  };

  const deleteElementFromTail = async () => {
    setLoading({ ...isLoading, delTail: true });
    setOperationState({ ...operationState, delTail: true });
    setDeletingValue(listArray[listArray.length - 1].value);
    linkedList.deleteTail();
    modifyArrayElementState(setlistArray, listArray, listArray.length - 1, ElementStates.Default, '');
    await waitTime(DELAY_IN_MS);
    updateArrayElements(linkedList);
    setLoading({ ...isLoading, delHead: false });
    setOperationState({ ...operationState, delHead: false });
  };

  const addElementByIndex = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (values.index !== null && values.index >= 0) {
      setLoading({ ...isLoading, addAtIndex: true });
      setOperationState({ ...operationState, addAtIndex: true });
      linkedList.addByIndex(values.string, values.index);
      for (let i = 0; i <= values.index; i++) {
        setCurrentEltIndex(i);
        modifyArrayElementState(setlistArray, listArray, i - 1, ElementStates.Changing);
        await waitTime(DELAY_IN_MS);
      }
      await waitTime(DELAY_IN_MS);
      updateArrayElements(linkedList);
      setOperationState({ ...operationState, addAtIndex: false });
      modifyArrayElementState(setlistArray, listArray, values.index, ElementStates.Modified);
      await waitTime(DELAY_IN_MS);
      modifyArrayElementState(setlistArray, listArray, values.index, ElementStates.Default);
      setLoading({ ...isLoading, addAtIndex: false });
      setCurrentEltIndex(-1);
      setValues({ string: '', index: null })
    }
  };

  const deleteElementByIndex = async () => {
    if (values.index !== null && values.index >= 0) {
      setLoading({ ...isLoading, delAtIndex: true });
      linkedList.delByIndex(values.index);
      for (let i = 0; i <= values.index; i++) {
        setCurrentEltIndex(i);
        modifyArrayElementState(setlistArray, listArray, i, ElementStates.Changing);
        await waitTime(DELAY_IN_MS);
      }
      setOperationState({ ...operationState, delAtIndex: true });
      setDeletingValue(listArray[values.index].value);
      modifyArrayElementState(setlistArray, listArray, values.index, ElementStates.Default, '');
      await waitTime(DELAY_IN_MS);
      setOperationState({ ...operationState, delAtIndex: false });
      updateArrayElements(linkedList);
      setLoading({ ...isLoading, delAtIndex: false });
      setValues({ ...values, index: null });
    }
  };

  return (
    <SolutionLayout title="Связный список">
      <section className={styles.formConteiner} >
        <form className={styles.form} onSubmit={addElementHead}>
          <Input
            extraClass={styles.input}
            type="text"
            maxLength={4}
            isLimitText
            value={values.string}
            name="string"
            onChange={handleChange}
          />
          <Button
            extraClass={styles.shortButton}
            text="Добавить в head"
            type="submit"
            isLoader={isLoading.addToHeadBtn}
            disabled={values.string.length === 0 || listArray.length === 10}
          />
          <Button
            extraClass={styles.shortButton}
            text="Добавить в tail"
            isLoader={isLoading.addTail}
            disabled={values.string.length === 0 || listArray.length === 10}
            onClick={addElementTail}
          />
          <Button
            extraClass={styles.shortButton}
            text="Удалить из head"
            isLoader={isLoading.delHead}
            disabled={listArray.length === 0}
            onClick={deleteElementFromHead}
          />
          <Button
            extraClass={styles.shortButton}
            text="Удалить из tail"
            isLoader={isLoading.delTail}
            disabled={listArray.length === 0}
            onClick={deleteElementFromTail}
          />
        </form>
        <form className={styles.form} onSubmit={addElementByIndex}>
          <Input
            extraClass={styles.input}
            type="number"
            min={0}
            max={listArray.length - 1}
            isLimitText
            value={values.index === null ? '' : values.index}
            onChange={handleChange}
            name="index"
          />
          <Button
            extraClass={styles.longButton}
            text="Добавить по индексу"
            type="submit"
            isLoader={isLoading.addAtIndex}
            disabled={
              values.index === null
              || values.index < 0
              || values.index > listArray.length - 1
              || values.string.length === 0
              || listArray.length === 10
            }
          />
          <Button
            extraClass={styles.longButton}
            text="Удалить по индексу"
            isLoader={isLoading.delAtIndex}
            disabled={
              values.index === null
              || values.index < 0
              || values.index > listArray.length - 1
              || listArray.length === 0
            }
            onClick={deleteElementByIndex}
          />
        </form>
      </section>
      <ul className={styles.array}>
        {
          listArray && listArray.map((element, index) => {
            return (
              <li key={index} className={styles.li}>
                <Circle key={index} index={index} letter={element.value} state={element.state}
                  head={
                    (operationState.addHead && index === 0)
                      || (operationState.addTail && index === listArray.length - 1)
                      || (operationState.addAtIndex && index === currentEltIndex)
                      ? <Circle isSmall letter={values.string} state={ElementStates.Changing} />
                      : null
                        || index === 0 ? HEAD : null
                  }
                  tail={
                    ((operationState.delHead && index === 0)
                      || (operationState.delTail && index === listArray.length - 1)
                      || (operationState.delAtIndex && index === currentEltIndex)
                      ? <Circle isSmall letter={deletingValue} state={ElementStates.Changing} />
                      : null)
                      || index === listArray.length - 1 ? TAIL : null
                  }
                />
                {index !== listArray.length - 1 && <ArrowIcon />}
              </li>
            )
          })
        }
      </ul>

    </SolutionLayout>
  );
};
