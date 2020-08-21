import React, { useState, useEffect } from 'react';

import Display from './Display';
import { Button, LargeButton } from './Button';
import Layout from './Layout';

const DIGIT = 'DIGIT';
const OPERATOR = 'OPERATOR';

function Calculator() {

  // DIGIT, OPERATOR or null
  const [lastClicked, setLastClicked] = useState(null);
  const [history, setHistory] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeOperator, setActiveOperator] = useState(null);
  const [memoryValue, setMemoryValue] = useState(null);
  const [currentValue, setCurrentValue] = useState('0');

  // DIGIT
  const handleDigitClick = (e) => {
    if (isDisabled) return;
    if (currentValue.length === 24 && lastClicked === DIGIT) {
      setTimeout(() => {
        setCurrentValue(currentValue);
        setIsDisabled(false);
      }, 1000);

      setCurrentValue("LIMIT REACHED");
      setIsDisabled(true);
      return;
    }
    

    const numberClicked = e.target.value;

    // If clicked on decimal and there is already decimal point
    if (numberClicked === '.' && currentValue.includes('.')) return;

    // Clicked on digit right after clicking on equals
    if (activeOperator === '=') {
      setCurrentValue(numberClicked);
      setMemoryValue(null);
      setActiveOperator(null);
      setHistory([]);

      // When current value is zero or is empty (after clearing negative operator)
    } else if (currentValue === '0' || currentValue === '') {
      setCurrentValue(numberClicked);

      // When previously clicked on digit or current value is negative sign
    } else if (lastClicked === DIGIT || currentValue === '-') {
      // Append clicked number to the end
      setCurrentValue(currentValue + numberClicked);

      // When last time clicked on operator
    } else if (lastClicked === OPERATOR) {
      // Store current value in memory and set current value to clicked digit
      setMemoryValue(currentValue);
      setCurrentValue(numberClicked);
    }

    setLastClicked(DIGIT);
  };

  // OPERATOR
  const handleOperatorClick = (e) => {
    if (isDisabled) return;

    const operatorClicked = e.target.value;

    // Clicked the same operator twice, do nothing
    if (lastClicked === OPERATOR && activeOperator === operatorClicked) return;

    // Right after clicking on equals clicked on operator
    if (activeOperator === '=') {
      setMemoryValue(currentValue);
      setHistory([currentValue, operatorClicked]);
      setActiveOperator(operatorClicked);

      // When repeatedly clicking on operators
    } else if (lastClicked === OPERATOR) {
      // Last time clicked on operator and then on subtract
      if (operatorClicked === '-') {
        // Set current to negative value
        setCurrentValue('-');
      } else {
        // Last time changed the value to negative and clicked operator
        // again, so the user wants to change the operation
        if (currentValue === '-') {
          // Remove negative sign from current value
          setCurrentValue('');
        }
        // Update operator clicked
        setActiveOperator(operatorClicked);
        // Update history
        setHistory(history.slice(0, -1).concat(operatorClicked));
      }

      // Last time clicked on a digit
    } else if (lastClicked === DIGIT) {
      updateResult();
      setHistory(history.concat([currentValue, operatorClicked]));
      setActiveOperator(operatorClicked);
    }

    setLastClicked(OPERATOR);
  };

  // EQUALS
  const handleEqualsClick = () => {
    if (isDisabled) return;

    // If last clicked on equals or there is nothing to calculate
    if (activeOperator === '=' || activeOperator === null) return;

    // Update current value and history
    updateResult();
    setHistory(
      history.concat([
        currentValue,
        '=',
        calculate(memoryValue, currentValue, activeOperator),
      ])
    );

    setLastClicked(OPERATOR);
    setActiveOperator('=');
  };

  // CLEAR
  const handleClear = () => {
    if (isDisabled) return;

    setCurrentValue('0');
    setMemoryValue(null);
    setHistory([]);
    setLastClicked(null);
    setActiveOperator(null);
  };

  // DELETE
  const handleDeleteClick = () => {
    if (isDisabled) return;
    if (lastClicked === OPERATOR) return;

    // Last clicked on equals
    if (activeOperator === '=') {
      setMemoryValue(null);
      setHistory([]);

      // Current value is just one digit
    } else if (currentValue.length === 1) {
      setCurrentValue('0');
    } else {
      // Remove last digit
      setCurrentValue(currentValue.slice(0, -1));
    }
  };

  // Updates result
  const updateResult = () => {
    // There is something in memory
    if (memoryValue) {
      // Calculate the result and clear memory
      setCurrentValue(calculate(memoryValue, currentValue, activeOperator));
      setMemoryValue(null);
    } else {
      // There is nothing in memory so update memory
      setMemoryValue(currentValue);
    }
  };

  const checkDigitLimit = () => {
    
  }

  return (
    <Layout
      top={<Display topValue={history.join(' ')} bottomValue={currentValue} />}
      middle={
        <>
          <Button id="clear" value="AC" onClick={handleClear} />
          <Button id="" value="" />
          <Button id="divide" value="/" onClick={handleOperatorClick} />
          <Button id="multiply" value="x" onClick={handleOperatorClick} />

          <Button id="seven" value="7" onClick={handleDigitClick} />
          <Button id="eight" value="8" onClick={handleDigitClick} />
          <Button id="nine" value="9" onClick={handleDigitClick} />
          <Button value="DEL" onClick={handleDeleteClick} />

          <Button id="four" value="4" onClick={handleDigitClick} />
          <Button id="five" value="5" onClick={handleDigitClick} />
          <Button id="six" value="6" onClick={handleDigitClick} />
          <Button id="subtract" value="-" onClick={handleOperatorClick} />

          <Button id="one" value="1" onClick={handleDigitClick} />
          <Button id="two" value="2" onClick={handleDigitClick} />
          <Button id="three" value="3" onClick={handleDigitClick} />
          <Button id="add" value="+" onClick={handleOperatorClick} />

          <Button value="" />
          <Button id="zero" value="0" onClick={handleDigitClick} />
          <Button id="decimal" value="." onClick={handleDigitClick} />
        </>
      }
      bottom={
        <LargeButton
          id="equals"
          value="="
          onClick={handleEqualsClick}
        />
      }
    />
  );
}

export default function App() {
  return (
    <div className="App">
      <Calculator />
    </div>
  );
}

function calculate(a, b, operation) {
  console.log(a, b, operation);

  a = parseFloat(a);
  b = parseFloat(b);

  let result;
  switch (operation) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case 'x':
      result = a * b;
      break;
    case '/':
      result = a / b;
      break;
    default:
      break;
  }
  return result.toString();
}
