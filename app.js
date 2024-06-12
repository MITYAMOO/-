// 電卓のオブジェクトを作成
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
  };
  
  // 数字ボタンが押されたときの処理
  function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
  
    if (waitingForSecondOperand === true) {
      calculator.displayValue = digit;
      calculator.waitingForSecondOperand = false;
    } else {
      calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
  }
  
  // 小数点ボタンが押されたときの処理
  function inputDecimal(dot) {
    if (calculator.waitingForSecondOperand === true) {
      calculator.displayValue = '0.';
      calculator.waitingForSecondOperand = false;
      return;
    }
  
    if (!calculator.displayValue.includes(dot)) {
      calculator.displayValue += dot;
    }
  }
  
  // 演算子ボタンが押されたときの処理
  function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);
  
    if (operator && calculator.waitingForSecondOperand) {
      calculator.operator = nextOperator;
      return;
    }
  
    if (firstOperand === null) {
      calculator.firstOperand = inputValue;
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
      calculator.firstOperand = result;
    }
  
    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
  }
  
  // イコールボタンが押されたときの処理
  function handleEqual() {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);
  
    if (firstOperand === null || !operator) {
      return;
    }
  
    const result = calculate(firstOperand, inputValue, operator);
    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.firstOperand = null;
    calculator.operator = null;
    calculator.waitingForSecondOperand = false;
  }
  
  // 関数ボタンが押されたときの処理
  function handleFunction(func) {
    const { displayValue } = calculator;
    const inputValue = parseFloat(displayValue);
    let result;
  
    try {
        if (func === 'sin') {
            result = math.sin(math.unit(inputValue, 'deg')); // 角度をラジアンに変換してsinを計算
        } else if (func === 'cos') {
            result = math.cos(math.unit(inputValue, 'deg')); // 角度をラジアンに変換してcosを計算
        } else if (func === 'tan') {
            result = math.tan(math.unit(inputValue, 'deg')); // 角度をラジアンに変換してtanを計算
        } else if (func === 'log') {
            result = math.log10(inputValue); // 常用対数を計算
        } else if (func === 'sqrt') {
            result = math.sqrt(inputValue); // 平方根を計算
        } else if (func === 'pow') {
            result = math.pow(inputValue, 2); // 2乗を計算
        }
    } catch (e) {
        result = 'Error';
    }

  
    calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
    calculator.waitingForSecondOperand = false;
  }
  
  // 電卓のリセット処理
  function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
  }
  
  // 計算処理
  function calculate(firstOperand, secondOperand, operator) {
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
  
  // 画面表示を更新
  function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
  }
  
  // ボタンクリックのイベントリスナー
  const keys = document.querySelector('.calculator-keys');
  keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
      return;
    }
  
    if (target.classList.contains('operator')) {
      handleOperator(target.value);
      updateDisplay();
      return;
    }
  
    if (target.classList.contains('decimal')) {
      inputDecimal(target.value);
      updateDisplay();
      return;
    }
  
    if (target.classList.contains('all-clear')) {
      resetCalculator();
      updateDisplay();
      return;
    }
  
    if (target.classList.contains('function')) {
      handleFunction(target.value);
      updateDisplay();
      return;
    }
  
    if (target.classList.contains('equal-sign')) {
      handleEqual();
      updateDisplay();
      return;
    }
  
    inputDigit(target.value);
    updateDisplay();
  });

  // キーボード入力のイベントリスナー
document.addEventListener('keydown', handleKeyboardInput);

function handleKeyboardInput(event) {
    const { key } = event;
  
  // 数字キーが押された場合
  if (/\d/.test(key)) {
    inputDigit(key); // ここを変更
    updateDisplay();
    return;
  }


  // 演算子キーが押された場合
  if (['+', '-', '*', '/', '='].includes(key)) {
    if (key === '=') {
      handleEqual();
    } else {
      handleOperator(key);
    }
    updateDisplay();
    return;
  }

  // 小数点キーが押された場合
  if (key === '.') {
    inputDecimal('.');
    updateDisplay();
    return;
  }

  // 関数キーが押された場合
  const functionKeys = ['s', 'c', 't', 'l', 'r', 'p'];
  if (functionKeys.includes(key)) {
    const funcMap = {
      s: 'sin',
      c: 'cos',
      t: 'tan',
      l: 'log',
      r: 'sqrt',
      p: 'pow',
    };
    handleFunction(funcMap[key]);
    updateDisplay();
    return;
  }

  // クリアキー (Escapeキー) が押された場合
  if (key === 'Escape') {
    resetCalculator();
    updateDisplay();
    return;
  }
}