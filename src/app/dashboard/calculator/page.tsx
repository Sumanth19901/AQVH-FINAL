'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function CalculatorPage() {
  const router = useRouter();
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const performCalculation = () => {
    if (operator && firstOperand !== null) {
      const secondOperand = parseFloat(displayValue);
      switch (operator) {
        case '+':
          return firstOperand + secondOperand;
        case '-':
          return firstOperand - secondOperand;
        case '*':
          return firstOperand * secondOperand;
        case '/':
          return firstOperand / secondOperand;
        default:
          return secondOperand;
      }
    }
    return parseFloat(displayValue);
  };

  const handleOperator = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = performCalculation();
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const handleEquals = () => {
    if (!operator || firstOperand === null) return;

    const result = performCalculation();
    setDisplayValue(String(result));
    setFirstOperand(result); 
    setWaitingForSecondOperand(true); 
    setOperator(null);
  };


  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
       <div className="flex items-center gap-4 mb-4">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-lg font-semibold md:text-xl">Calculator</h1>
      </div>
        <main className="grid flex-1 items-start gap-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Calculator</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 rounded-lg bg-muted p-4 text-right text-4xl font-mono text-foreground">
                    {displayValue}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <Button variant="secondary" className="col-span-2 text-xl" onClick={clearAll}>C</Button>
                    <Button variant="secondary" className="text-xl" onClick={() => handleOperator('/')}>&divide;</Button>
                    <Button variant="secondary" className="text-xl" onClick={() => handleOperator('*')}>&times;</Button>
                    
                    <Button className="text-xl" onClick={() => inputDigit('7')}>7</Button>
                    <Button className="text-xl" onClick={() => inputDigit('8')}>8</Button>
                    <Button className="text-xl" onClick={() => inputDigit('9')}>9</Button>
                    <Button variant="secondary" className="text-xl" onClick={() => handleOperator('-')}>-</Button>

                    <Button className="text-xl" onClick={() => inputDigit('4')}>4</Button>
                    <Button className="text-xl" onClick={() => inputDigit('5')}>5</Button>
                    <Button className="text-xl" onClick={() => inputDigit('6')}>6</Button>
                    <Button variant="secondary" className="text-xl" onClick={() => handleOperator('+')}>+</Button>

                    <Button className="text-xl" onClick={() => inputDigit('1')}>1</Button>
                    <Button className="text-xl" onClick={() => inputDigit('2')}>2</Button>
                    <Button className="text-xl" onClick={() => inputDigit('3')}>3</Button>
                    <Button variant="secondary" className="row-span-2 text-2xl" onClick={handleEquals}>=</Button>

                    <Button className="col-span-2 text-xl" onClick={() => inputDigit('0')}>0</Button>
                    <Button className="text-xl" onClick={inputDecimal}>.</Button>
                </div>
            </CardContent>
          </Card>
        </main>
    </div>
  );
}
