import React, { useState } from 'react';

import Display from './Display';
import { GridButton, LargeButton } from './Button';
import Layout from './Layout';

const DIGIT = 'DIGIT';
const OPERATOR = 'OPERATOR';

export default function App() {
  const [currentValue, setCurrentValue] = useState('0');
  const [memoryValue, setMemoryValue] = useState(null);
  const [lastClicked, setLastClicked] = useState(null);
  const [lastOperatorUsed, setLastOperatorUsed] = useState(null);
  const [history, setHistory] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  // DIGIT
  const handleDigit = (digit) => {
    if (isDisabled) return;
    if (currentValueReachedLimit()) return;

    // Prevent multiple zeros
    if (digit === '00' && currentValue === '0') return;

    // Append zero before decimal point
    if (digit === '.' && currentValue === '0') {
      setCurrentValue('0.');
    }

    // If clicked on decimal and there is already decimal point
    if (digit === '.' && currentValue.includes('.')) return;

    // Clicked on digit right after clicking on equals
    if (lastOperatorUsed === '=') {
      setCurrentValue(digit === '.' ? '0.' : digit);
      setMemoryValue(null);
      setLastOperatorUsed(null);
      setHistory([]);

      // When current value is zero or is empty (after clearing negative operator)
    } else if (currentValue === '0' || currentValue === '') {
      setCurrentValue(digit);

      // When previously clicked on digit or current value is negative sign
    } else if (lastClicked === DIGIT || currentValue === '-') {
      // Append clicked number to the end
      setCurrentValue(currentValue + digit);

      // When last time clicked on operator
    } else if (lastClicked === OPERATOR) {
      // If clicked on decimal after clicking on operator
      if (digit === '.') {
        setCurrentValue('0' + digit);
      } else {
        setCurrentValue(digit);
      }

      // Store current value in memory and set current value to clicked digit
      if (lastOperatorUsed !== '√') {
        setMemoryValue(currentValue);
      }
    }

    setLastClicked(DIGIT);
  };

  // OPERATOR
  const handleOperator = (operator) => {
    if (isDisabled) return;
    if (currentValue.slice(-1) === '.') return;

    // Clicked the same operator twice, do nothing
    if (lastClicked === OPERATOR && lastOperatorUsed === operator) return;

    // Clicked on square root right after clicking on equals
    if (operator === '√' && lastOperatorUsed === '=') {
      setHistory(['√' + currentValue]);
      setCurrentValue(Math.sqrt(currentValue).toString());
      setLastOperatorUsed('√');
    }
    // Clicked square root and nothing is in memory
    else if (operator === '√' && memoryValue === null) {
      // Calculate the value and append to history
      setCurrentValue(Math.sqrt(currentValue).toString());
      // setHistory(history.concat("√" + currentValue));
      setHistory(['√' + currentValue]);

      setLastClicked(OPERATOR);
      setLastOperatorUsed('√');
      return;

      // Clicked on square root and something is in memory
    } else if (operator === '√' && memoryValue) {
      setCurrentValue(
        (Math.sqrt(currentValue) + parseFloat(memoryValue)).toString()
      );
      setHistory(history.concat('√' + currentValue));
      setMemoryValue(null);
      setLastOperatorUsed('√');

      // Last clicked was square root
    } else if (lastOperatorUsed === '√') {
      // Append new operator to history
      setHistory(history.concat(operator));
      setLastOperatorUsed(operator);
      setMemoryValue(currentValue);
    }
    // Right after clicking on equals clicked on operator
    else if (lastOperatorUsed === '=') {
      setMemoryValue(currentValue);
      setHistory([currentValue, operator]);
      setLastOperatorUsed(operator);

      // When repeatedly clicking on operators
    } else if (lastClicked === OPERATOR) {
      // Last time clicked on operator and then on subtract
      if (operator === '-') {
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
        setLastOperatorUsed(operator);
        // Update history
        setHistory(history.slice(0, -1).concat(operator));
      }

      // Last time clicked on a digit
    } else if (lastClicked === DIGIT) {
      updateResult();
      setHistory(history.concat([currentValue, operator]));
      setLastOperatorUsed(operator);
    }

    setLastClicked(OPERATOR);
  };

  // EQUALS
  const handleEquals = () => {
    if (isDisabled) return;

    // If last clicked on equals or there is nothing to calculate
    if (lastOperatorUsed === '=' || lastOperatorUsed === null) return;

    // Last clicked on square root, already has the result
    if (lastOperatorUsed === '√') {
      setLastOperatorUsed(history.concat(['=', currentValue]));

      // Clicked on equals right after clicking on operator
    } else if (lastClicked === OPERATOR && !memoryValue) {
      setHistory(history.slice(0, -1).concat(['=', currentValue]));
    } else {
      // Update current value and history
      updateResult();
      setHistory(
        history.concat([
          currentValue,
          '=',
          calculate(memoryValue, currentValue, lastOperatorUsed),
        ])
      );
    }

    setLastClicked(OPERATOR);
    setLastOperatorUsed('=');
  };

  // CLEAR
  const handleClear = () => {
    if (isDisabled) return;

    setCurrentValue('0');
    setMemoryValue(null);
    setHistory([]);
    setLastClicked(null);
    setLastOperatorUsed(null);
  };

  // DELETE
  const handleDelete = () => {
    if (isDisabled) return;
    if (lastClicked === OPERATOR) return;

    // Last clicked on equals
    if (lastOperatorUsed === '=') {
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
  const handlePlusMinus = () => {
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
      setCurrentValue(calculate(memoryValue, currentValue, lastOperatorUsed));
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
          <GridButton id="clear" keyCodes={[46]} value="AC" onClick={handleClear} />
          <GridButton keyCodes={[8]} value="DEL" onClick={handleDelete} />
          <GridButton id="plus-minus" value="+/-" onClick={handlePlusMinus} />
          <GridButton
            id="sqrt"
            value="&radic;"
            onClick={handleOperator}
          />

          <GridButton id="seven" keyCodes={[55,103]} value="7" onClick={handleDigit} />
          <GridButton id="eight" keyCodes={[56,104]} value="8" onClick={handleDigit} />
          <GridButton id="nine" keyCodes={[57,105]} value="9" onClick={handleDigit} />
          <GridButton
            id="divide"
            keyCodes={[111,191]}
            value="/"
            onClick={handleOperator}
          />

          <GridButton id="four" keyCodes={[52,100]} value="4" onClick={handleDigit} />
          <GridButton id="five" keyCodes={[53,101]} value="5" onClick={handleDigit} />
          <GridButton id="six" keyCodes={[54,102]} value="6" onClick={handleDigit} />
          <GridButton
            id="multiply"
            keyCodes={[106]}
            value="x"
            onClick={handleOperator}
          />

          <GridButton id="one" keyCodes={[49,97]} value="1" onClick={handleDigit} />
          <GridButton id="two" keyCodes={[50,98]} value="2" onClick={handleDigit} />
          <GridButton id="three" keyCodes={[51,99]} value="3" onClick={handleDigit} />
          <GridButton
            id="subtract"
            keyCodes={[189,109]}
            value="-"
            onClick={handleOperator}
          />

          <GridButton id="zero" keyCodes={[48,96]} value="0" onClick={handleDigit} />
          <GridButton
            id="double-zero"
            value="00"
            onClick={handleDigit}
          />
          <GridButton
            id="decimal"
            keyCodes={[190,110]}
            value="."
            onClick={handleDigit}
          />
          <GridButton
            id="add"
            keyCodes={[107]}
            value="+"
            onClick={handleOperator}
          />
        </>
      }
      bottom={
        <LargeButton
          id="equals"
          keyCodes={[187,13]}
          value="="
          onClick={handleEquals}
        />
      }
    />
  );
}

function calculate(a, b, operation) {
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
