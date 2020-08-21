import React, { useState } from 'react';

import Display from './Display';
import { GridButton, LargeButton } from './Button';
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
    if (currentValueReachedLimit()) return;

    const numberClicked = e.target.value;

    // Prevent multiple zeros
    if (numberClicked === '00' && currentValue === '0') return;

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

  // PLUS/MINUS
  const handlePlusMinusClick = () => {
    if (isDisabled) return;

    // Append/remove minus sign
    setCurrentValue(
      currentValue[0] === '-' ? currentValue.slice(1) : '-' + currentValue
    );
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

  // Digit limit
  const currentValueReachedLimit = () => {
    if (currentValue.length >= 23 && lastClicked === DIGIT) {
      setTimeout(() => {
        setCurrentValue(currentValue);
        setIsDisabled(false);
      }, 1000);

      setCurrentValue('LIMIT REACHED');
      setIsDisabled(true);
      return true;
    }
  };

  return (
    <Layout
      top={<Display topValue={history.join(' ')} bottomValue={currentValue} />}
      middle={
        <>
          <GridButton id="clear" value="AC" onClick={handleClear} />
          <GridButton
            id="plus-minus"
            value="+/-"
            onClick={handlePlusMinusClick}
          />
          <GridButton id="divide" value="/" onClick={handleOperatorClick} />
          <GridButton id="multiply" value="x" onClick={handleOperatorClick} />

          <GridButton id="seven" value="7" onClick={handleDigitClick} />
          <GridButton id="eight" value="8" onClick={handleDigitClick} />
          <GridButton id="nine" value="9" onClick={handleDigitClick} />
          <GridButton value="DEL" onClick={handleDeleteClick} />

          <GridButton id="four" value="4" onClick={handleDigitClick} />
          <GridButton id="five" value="5" onClick={handleDigitClick} />
          <GridButton id="six" value="6" onClick={handleDigitClick} />
          <GridButton id="subtract" value="-" onClick={handleOperatorClick} />

          <GridButton id="one" value="1" onClick={handleDigitClick} />
          <GridButton id="two" value="2" onClick={handleDigitClick} />
          <GridButton id="three" value="3" onClick={handleDigitClick} />
          <GridButton id="add" value="+" onClick={handleOperatorClick} />

          <GridButton id="zero" value="0" onClick={handleDigitClick} />
          <GridButton id="double-zero" value="00" onClick={handleDigitClick} />
          <GridButton id="decimal" value="." onClick={handleDigitClick} />
        </>
      }
      bottom={<LargeButton id="equals" value="=" onClick={handleEqualsClick} />}
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
