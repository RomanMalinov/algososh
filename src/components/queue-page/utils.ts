import { SHORT_DELAY_IN_MS } from "../../constants/delays";
import { waitTime, updateCircleState } from "../../constants/commonUtils";
import { ElementStates } from "../../types/element-states";

type TQueueElement = {
  value: string;
  state: ElementStates;
};

export const addToQueue = async (
  item: string,
  queue: TQueueElement[],
  head: number,
  tail: number,
  setQueue: React.Dispatch<React.SetStateAction<TQueueElement[]>>,
  setHead: React.Dispatch<React.SetStateAction<number>>,
  setTail: React.Dispatch<React.SetStateAction<number>>
) => {
  updateCircleState(setQueue, tail + 1, ElementStates.Changing);
  await waitTime(SHORT_DELAY_IN_MS);
  const newQueue = [...queue];
  newQueue[tail + 1] = { value: item, state: ElementStates.Default };
  setQueue(newQueue);
  if (head === -1 || queue[head].value === '') {
    setHead(head + 1);
  }
  setTail(tail + 1);
};

export const removeFromQueue = async (
  queue: TQueueElement[],
  head: number,
  tail: number,
  setQueue: React.Dispatch<React.SetStateAction<TQueueElement[]>>,
  setHead: React.Dispatch<React.SetStateAction<number>>,
  setTail: React.Dispatch<React.SetStateAction<number>>
) => {
  updateCircleState(setQueue, head, ElementStates.Changing);
  await waitTime(SHORT_DELAY_IN_MS);
  const newQueue = [...queue];
  newQueue[head] = { value: '', state: ElementStates.Default };
  setQueue(newQueue);
  if (head < tail) {
    setHead(head + 1);
  }
  if (head === tail) {
    setHead(-1);
    setTail(-1);
  }
};
