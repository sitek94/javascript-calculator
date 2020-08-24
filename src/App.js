import React, { useState } from "react";

import Display from "./Display";
import { GridButton, LargeButton } from "./Button";
import Layout from "./Layout";

const DIGIT = "DIGIT";
const OPERATOR = "OPERATOR";

export default function App() {
  const [currentValue, setCurrentValue] = useState("0");
  const [memoryValue, setMemoryValue] = useState(null);
  const [lastClicked, setLastClicked] = useState(null);
  const [lastOperatorUsed, setLastOperatorUsed] = useState(null);
  const [history, setHistory] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);

  // DIGIT
  const handleDigitClick = (e) => {
    if (isDisabled) return;
    if (currentValueReachedLimit()) return;

    const digitClicked = e.target.value;

    // Prevent multiple zeros
    if (digitClicked === "00" && currentValue === "0") return;

    // Append zero before decimal point
    if (digitClicked === "." && currentValue === "0") {
      setCurrentValue("0.");
    }

    // If clicked on decimal and there is already decimal point
    if (digitClicked === "." && currentValue.includes(".")) return;

    // Clicked on digit right after clicking on equals
    if (lastOperatorUsed === "=") {
      setCurrentValue(digitClicked === "." ? "0." : digitClicked);
      setMemoryValue(null);
      setLastOperatorUsed(null);
      setHistory([]);

      // When current value is zero or is empty (after clearing negative operator)
    } else if (currentValue === "0" || currentValue === "") {
      setCurrentValue(digitClicked);

      // When previously clicked on digit or current value is negative sign
    } else if (lastClicked === DIGIT || currentValue === "-") {
      // Append clicked number to the end
      setCurrentValue(currentValue + digitClicked);

      // When last time clicked on operator
    } else if (lastClicked === OPERATOR) {
      // If clicked on decimal after clicking on operator
      if (digitClicked === ".") {
        setCurrentValue("0" + digitClicked);
      } else {
        setCurrentValue(digitClicked);
      }

      // Store current value in memory and set current value to clicked digit
      if (lastOperatorUsed !== "√") {
        setMemoryValue(currentValue);
      }
    }

    setLastClicked(DIGIT);
  };

  // OPERATOR
  const handleOperatorClick = (e) => {
    if (isDisabled) return;
    if (currentValue.slice(-1) === ".") return;

    const operatorClicked = e.target.value;

    // Clicked the same operator twice, do nothing
    if (lastClicked === OPERATOR && lastOperatorUsed === operatorClicked)
      return;

    // Clicked on square root right after clicking on equals
    if (operatorClicked === "√" && lastOperatorUsed === "=") {
      setHistory(["√" + currentValue]);
      setCurrentValue(Math.sqrt(currentValue).toString());
      setLastOperatorUsed("√");
    }
    // Clicked square root and nothing is in memory
    else if (operatorClicked === "√" && memoryValue === null) {
      // Calculate the value and append to history
      setCurrentValue(Math.sqrt(currentValue).toString());
      // setHistory(history.concat("√" + currentValue));
      setHistory(["√" + currentValue]);

      setLastClicked(OPERATOR);
      setLastOperatorUsed("√");
      return;

      // Clicked on square root and something is in memory
    } else if (operatorClicked === "√" && memoryValue) {
      setCurrentValue(
        (Math.sqrt(currentValue) + parseFloat(memoryValue)).toString()
      );
      setHistory(history.concat("√" + currentValue));
      setMemoryValue(null);
      setLastOperatorUsed("√");

      // Last clicked was square root
    } else if (lastOperatorUsed === "√") {
      // Append new operator to history
      setHistory(history.concat(operatorClicked));
      setLastOperatorUsed(operatorClicked);
      setMemoryValue(currentValue);
    }
    // Right after clicking on equals clicked on operator
    else if (lastOperatorUsed === "=") {
      setMemoryValue(currentValue);
      setHistory([currentValue, operatorClicked]);
      setLastOperatorUsed(operatorClicked);

      // When repeatedly clicking on operators
    } else if (lastClicked === OPERATOR) {
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
        setLastOperatorUsed(operatorClicked);
        // Update history
        setHistory(history.slice(0, -1).concat(operatorClicked));
      }

      // Last time clicked on a digit
    } else if (lastClicked === DIGIT) {
      updateResult();
      setHistory(history.concat([currentValue, operatorClicked]));
      setLastOperatorUsed(operatorClicked);
    }

    setLastClicked(OPERATOR);
  };

  // EQUALS
  const handleEqualsClick = () => {
    if (isDisabled) return;

    // If last clicked on equals or there is nothing to calculate
    if (lastOperatorUsed === "=" || lastOperatorUsed === null) return;

    // Last clicked on square root, already has the result
    if (lastOperatorUsed === "√") {
      setLastOperatorUsed(history.concat(["=", currentValue]));

      // Clicked on equals right after clicking on operator
    } else if (lastClicked === OPERATOR && !memoryValue) {
      setHistory(history.slice(0, -1).concat(["=", currentValue]));
    } else {
      // Update current value and history
      updateResult();
      setHistory(
        history.concat([
          currentValue,
          "=",
          calculate(memoryValue, currentValue, lastOperatorUsed)
        ])
      );
    }

    setLastClicked(OPERATOR);
    setLastOperatorUsed("=");
  };

  // CLEAR
  const handleClear = () => {
    if (isDisabled) return;

    setCurrentValue("0");
    setMemoryValue(null);
    setHistory([]);
    setLastClicked(null);
    setLastOperatorUsed(null);
  };

  // DELETE
  const handleDeleteClick = () => {
    if (isDisabled) return;
    if (lastClicked === OPERATOR) return;

    // Last clicked on equals
    if (lastOperatorUsed === "=") {
      setMemoryValue(null);
      setHistory([]);

      // Current value is just one digit
    } else if (currentValue.length === 1) {
      setCurrentValue("0");
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
      currentValue[0] === "-" ? currentValue.slice(1) : "-" + currentValue
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

      setCurrentValue("LIMIT REACHED");
      setIsDisabled(true);
      return true;
    }
  };

  return (
    <Layout
      top={<Display topValue={history.join(" ")} bottomValue={currentValue} />}
      middle={
        <>
          <GridButton id="clear" value="AC" onClick={handleClear} />
          <GridButton value="DEL" onClick={handleDeleteClick} />
          <GridButton
            id="plus-minus"
            value="+/-"
            onClick={handlePlusMinusClick}
          />
          <GridButton id="sqrt" value="&radic;" onClick={handleOperatorClick} />

          <GridButton id="seven" value="7" onClick={handleDigitClick} />
          <GridButton id="eight" value="8" onClick={handleDigitClick} />
          <GridButton id="nine" value="9" onClick={handleDigitClick} />
          <GridButton id="divide" value="/" onClick={handleOperatorClick} />

          <GridButton id="four" value="4" onClick={handleDigitClick} />
          <GridButton id="five" value="5" onClick={handleDigitClick} />
          <GridButton id="six" value="6" onClick={handleDigitClick} />
          <GridButton id="multiply" value="x" onClick={handleOperatorClick} />

          <GridButton id="one" value="1" onClick={handleDigitClick} />
          <GridButton id="two" value="2" onClick={handleDigitClick} />
          <GridButton id="three" value="3" onClick={handleDigitClick} />
          <GridButton id="subtract" value="-" onClick={handleOperatorClick} />

          <GridButton id="zero" value="0" onClick={handleDigitClick} />
          <GridButton id="double-zero" value="00" onClick={handleDigitClick} />
          <GridButton id="decimal" value="." onClick={handleDigitClick} />
          <GridButton id="add" value="+" onClick={handleOperatorClick} />
        </>
      }
      bottom={<LargeButton id="equals" value="=" onClick={handleEqualsClick} />}
    />
  );
}

function calculate(a, b, operation) {
  a = parseFloat(a);
  b = parseFloat(b);

  let result;
  switch (operation) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "x":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
    default:
      break;
  }
  return result.toString();
}
