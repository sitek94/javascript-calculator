import React, { useState } from 'react';

function Button(props) {
  return <input type="button" className="button" {...props} />;
}

const ZERO = '0';
const NUMBER = 'NUMBER';
const OPERATOR = 'OPERATOR';
const DELETE = 'DELETE';
const EQUALS = 'EQUALS';
const ADD = '+';
const SUBTRACT = '-';
const DIVIDE = '/';
const MULTIPLY = 'X';
const DECIMAL = 'DECIMAL';

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
    }
    else if (currentValue === "") {
      setCurrentValue(numberClicked);
    
    } else if (lastClicked === NUMBER || lastClicked === DECIMAL || currentValue === "-") {
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

    // Clicked the same operator twice
    if (activeOperator === operatorClicked) return;

    // When repeatedly clicking on operators
    if (lastClicked === OPERATOR) {

      // Last time clicked on operator and then on subtract
      if (operatorClicked === SUBTRACT) {
        setCurrentValue("-");
        

      } else if (currentValue === "-") {
        setCurrentValue("");
        setActiveOperator(operatorClicked);
        setHistory(history.slice(0, -1).concat(operatorClicked));
        return;
      } else {

        setActiveOperator(operatorClicked);
        setHistory(history.slice(0, -1).concat(operatorClicked));
      }

      // Clicked operator after clicking on number
    } else if (lastClicked === NUMBER) {
      // If there is something in memory calculate the result
      // Then clear memory
      if (memoryValue) {
        
        setCurrentValue(calculate(memoryValue, currentValue, activeOperator));
        setMemoryValue(null);

        // There is nothing in memory, update memory
      } else {
        setMemoryValue(currentValue);
      }

      setHistory(history.concat([currentValue, operatorClicked]));
      setActiveOperator(operatorClicked);
    }
    
    setLastClicked(OPERATOR);
  };

  // DECIMAL
  const handleDecimalClick = () => {
    if (lastClicked === DECIMAL || currentValue.includes(".")) return;

    setCurrentValue(currentValue + ".");
    setLastClicked(DECIMAL);
  }

  

  // EQUALS
  const handleEqualsClick = () => {
    updateResult();
    setHistory(history.concat([currentValue, "="]));
    setLastClicked(OPERATOR);
    setActiveOperator(EQUALS);
  }

  // CLEAR
  const handleClearClick = () => {
    setCurrentValue(ZERO);
    setMemoryValue(null);
    setHistory([]);
    setLastClicked(null);
    setActiveOperator(null);
  }

  const updateResult = () => {
    // If there is something in memory calculate the result
      // Then clear memory
      if (memoryValue) {
        setCurrentValue(calculate(memoryValue, currentValue, activeOperator));
        setMemoryValue(null);

        // There is nothing in memory, update memory
      } else {
        setMemoryValue(currentValue);
      }
  }

  return (
    <div className="Calculator">
      <div className="display display__secondary">{history.join(' ')}</div>
      <div id="display" className="display display__primary">{currentValue}</div>

      <Button id="clear" value="AC" onClick={handleClearClick} />
      <Button id="" value="" />
      <Button id="divide" value="/" onClick={handleOperatorClick} />
      <Button id="multiply" value="X" onClick={handleOperatorClick} />

      <Button id="seven" value="7" onClick={handleNumberClick} />
      <Button id="eight" value="8" onClick={handleNumberClick} />
      <Button id="nine" value="9" onClick={handleNumberClick} />
      <Button value="DEL" onClick={handleDeleteClick} />

      <Button id="four" value="4" onClick={handleNumberClick} />
      <Button id="five" value="5" onClick={handleNumberClick} />
      <Button id="six" value="6" onClick={handleNumberClick} />
      <Button id="subtract" value="-" onClick={handleOperatorClick} />

      <Button id="one" value="1" onClick={handleNumberClick} />
      <Button id="two" value="2" onClick={handleNumberClick} />
      <Button id="three" value="3" onClick={handleNumberClick} />
      <Button id="add" value="+" onClick={handleOperatorClick} />

      <Button value="" />
      <Button id="zero" value="0" onClick={handleNumberClick} />
      <Button id="decimal" value="." onClick={handleDecimalClick} />
      <Button id="equals" value="=" onClick={handleEqualsClick} />
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
  console.log(a, b, operation);
  
  a = parseFloat(a);
  b = parseFloat(b);

  let result;
  switch (operation) {
    case ADD:
      result = a + b;
      break;
    case SUBTRACT:
      result = a - b;
      break
    case MULTIPLY:
      result = a * b;
      break;
    case DIVIDE:
      result = a / b;
      break;
    default:
      break;
  }
  return result.toString();
}
