import { useState } from "react";
import { SolutionLayout } from "../ui/solution-layout/solution-layout";
import styles from "./fibonacci-page.module.css";
import { Input } from "../ui/input/input";
import { Button } from "../ui/button/button";
import { Circle } from "../ui/circle/circle";
import { useForm } from "../../hooks/use-form";
import { waitTime } from "./utils";
import { SHORT_DELAY_IN_MS } from "../../constants/delays";

const calculateFibonaccifibonacciArray = (n: number): number[] => {
  const fibonacciArray: number[] = [1, 1];
  for (let i = 2; i < n + 1; i++) {
    fibonacciArray.push(fibonacciArray[i - 2] + fibonacciArray[i - 1]);
  }
  return fibonacciArray;
};

export const FibonacciPage = () => {
  const { values, handleChange } = useForm({ number: "" });
  const [fibonacciArray, setfibonacciArray] = useState<number[]>([]);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputNumber = parseInt(values.number);
    if (!isNaN(inputNumber) && inputNumber > 0 && inputNumber <= 20) {
      setLoading(true);
      setfibonacciArray([]);

      const fibfibonacciArray = calculateFibonaccifibonacciArray(inputNumber);
      for (let i = 0; i < fibfibonacciArray.length; i++) {
        await waitTime(SHORT_DELAY_IN_MS);
        setfibonacciArray((prevfibonacciArray) => [...prevfibonacciArray, fibfibonacciArray[i]]);

      }
      setLoading(false);
    }
  };

  return (
    <SolutionLayout title="Последовательность Фибоначчи">
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          maxLength={19}
          isLimitText
          value={values.number}
          onChange={handleChange}
          name="number"
        />
        <Button
          text="Рассчитать"
          type="submit"
          isLoader={isLoading}
          disabled={isLoading}
        />
      </form>
      <div className={styles.array}>
        {
          fibonacciArray && fibonacciArray.map((item, index) => {
            return (
              <Circle key={index}
                index={index}
                letter={item.toString()}
              />
            )
          })
        }
      </div>
    </SolutionLayout>
  );
};
