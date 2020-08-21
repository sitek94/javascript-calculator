import React, { useState } from 'react';

function Button(props) {
  return <input type="button" className="button" {...props} />;
}

const ZERO = '0';
const DIGIT = 'DIGIT';
const OPERATOR = 'OPERATOR';
const EQUALS = '=';
const ADD = '+';
const SUBTRACT = '-';
const DIVIDE = '/';
const MULTIPLY = 'X';



function Calculator() {

  const [currentValue, setCurrentValue] = useState(ZERO);
  const [memoryValue, setMemoryValue] = useState(null);

  const [history, setHistory] = useState([]);

  const [activeOperator, setActiveOperator] = useState(null);

  // DIGIT, OPERATOR or null
  const [lastClicked, setLastClicked] = useState(null);

  // DIGIT
  const handleDigitClick = (e) => {
    const numberClicked = e.target.value;

    // If clicked on decimal and there is already decimal point 
    if (numberClicked === "." && currentValue.includes(".")) return;

    // When current value is zero or is empty (after clearing negative operator)
    if (currentValue === "0" || currentValue === "") {
      setCurrentValue(numberClicked);
    
      // When previously clicked on digit or current value is negative sign 
    } else if (lastClicked === DIGIT || currentValue === "-") {
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

  // DELETE
  const handleDeleteClick = () => {
    // If current value is just one digit, set current value to zero
    // otherwise remove last digit
    currentValue.length === 1
      ? setCurrentValue("0")
      : setCurrentValue(currentValue.slice(0, -1));

    setLastClicked(null);
  };

  // OPERATOR
  const handleOperatorClick = (e) => {
    const operatorClicked = e.target.value;

    // Clicked the same operator twice, do nothing
    if (activeOperator === operatorClicked) return;

    // When repeatedly clicking on operators
    if (lastClicked === OPERATOR) {

      // Last time clicked on operator and then on subtract
      if (operatorClicked === "-") {
        // Set current to negative value
        setCurrentValue("-");
        
      } else {
        // Last time changed the value to negative and clicked operator
        // again, so the user wants to change the operation
        if (currentValue === "-") {
          // Remove negative sign from current value
          setCurrentValue("");
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
    if (activeOperator === "=");

    updateResult();
    setHistory(history.concat([currentValue, "="]));
    setLastClicked(OPERATOR);
    setActiveOperator(EQUALS);
  }

  // CLEAR
  const handleClear = () => {
    setCurrentValue(ZERO);
    setMemoryValue(null);
    setHistory([]);
    setLastClicked(null);
    setActiveOperator(null);
  }

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
  }

  return (
    <div className="Calculator">
      <div className="display display__secondary">{history.join(' ')}</div>
      <div id="display" className="display display__primary">{currentValue}</div>

      <Button id="clear" value="AC" onClick={handleClear} />
      <Button id="" value="" />
      <Button id="divide" value="/" onClick={handleOperatorClick} />
      <Button id="multiply" value="X" onClick={handleOperatorClick} />

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
