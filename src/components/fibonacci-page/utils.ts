export const calculateFibonaccifibonacciArray = (n: number): number[] => {
  const fibonacciArray: number[] = [1, 1];
  for (let i = 2; i < n + 1; i++) {
    fibonacciArray.push(fibonacciArray[i - 2] + fibonacciArray[i - 1]);
  }
  return fibonacciArray;
};
