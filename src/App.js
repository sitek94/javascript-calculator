import React, { useState } from 'react';

function Button(props) {
  return <input type="button" className="button" {...props} />;
}

const ZERO = '0';
const NUMBER = 'NUMBER';
const OPERATOR = 'OPERATOR';
const DELETE = 'DELETE';
const ADD = '+';
const SUBTRACT = 'SUBTRACT';
const DIVIDE = 'DIVIDE';
const MULTIPLY = 'MULTIPLY';

function Calculator() {
  const [currentValue, setCurrentValue] = useState(ZERO);
  const [memoryValue, setMemoryValue] = useState(null);
  const [history, setHistory] = useState([]);

  const [activeOperator, setActiveOperator] = useState(null);
  const [lastClicked, setLastClicked] = useState(null);

  // NUMBER
  const handleNumberClick = (e) => {
    const numberClicked = e.target.value;

    if (currentValue === ZERO) {
      // Replace zero with clicked number
      setCurrentValue(numberClicked);
    } else if (lastClicked === NUMBER) {
      // Append number to the current value
      setCurrentValue(currentValue + numberClicked);
    } else if (lastClicked === OPERATOR) {
      // Store current value in memory and replace
      // current value with number clicked
      setMemoryValue(currentValue);
      setCurrentValue(numberClicked);
    }

    setLastClicked(NUMBER);
  };

  // DELETE
  const handleDeleteClick = () => {
    currentValue.length === 1
      ? setCurrentValue(ZERO)
      : setCurrentValue(currentValue.slice(0, -1));

    setLastClicked(DELETE);
  };

  // OPERATOR
  const handleOperatorClick = (e) => {
    const operatorClicked = e.target.value;

    // When repeatedly clicking on operators
    if (lastClicked === OPERATOR) {
      setActiveOperator(operatorClicked);
      setHistory(history.slice(0, -1).concat(operatorClicked));

      // Clicked operator after clicking on number
    } else if (lastClicked === NUMBER) {
      // If there is something in memory calculate the result
      // Then clear memory
      if (memoryValue) {
        setCurrentValue(calculate(currentValue, memoryValue, activeOperator));
        setMemoryValue(null);

        // There is nothing in memory, update memory
      } else {
        setMemoryValue(currentValue);
      }

      setHistory(history.concat([currentValue, operatorClicked]));
    }

    setActiveOperator(operatorClicked);
    setLastClicked(OPERATOR);
  };

  return (
    <div className="Calculator">
      <div className="display display__secondary">{history.join(' ')}</div>
      <div className="display display__primary">{currentValue}</div>

      <Button id="one" value="1" />
      <Button id="two" value="2" />
      <Button id="three" value="3" />
      <Button id="add" value="+" />

      <Button id="seven" value="7" onClick={handleNumberClick} />
      <Button id="eight" value="8" onClick={handleNumberClick} />
      <Button id="nine" value="9" onClick={handleNumberClick} />
      <Button value="DEL" onClick={handleDeleteClick} />

      <Button id="four" value="4" onClick={handleNumberClick} />
      <Button id="five" value="5" onClick={handleNumberClick} />
      <Button id="six" value="6" onClick={handleNumberClick} />
      <Button id="subtract" value="-" />

      <Button id="one" value="1" />
      <Button id="two" value="2" />
      <Button id="three" value="3" />
      <Button id="add" value="+" />

      <Button value="" />
      <Button id="zero" value="0" />
      <Button value="" />
      <Button id="equals" value="=" />
    </div>
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
  a = parseFloat(a);
  b = parseFloat(b);

  switch (operation) {
    case ADD:
      return a + b;
    case SUBTRACT:
      return a - b;
    case MULTIPLY:
      return a * b;
    case DIVIDE:
      return a / b;
    default:
      return;
  }
}
