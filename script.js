// script.js

// สร้างปุ่มด้วยลูป
const buttons = [
  { label: "AC", classes: "btn-clear bg-[#858585]", dataAttr: "btn-clear" },
  {
    label: "+/-",
    classes: "btn-plus-minus bg-[#858585]",
    dataAttr: "btn-plus-minus",
  },
  { label: "%", classes: "btn-percent bg-[#858585]", dataAttr: "btn-percent" },
  {
    label: "÷",
    classes: "btn-operation bg-[#f0a608] text-black",
    dataAttr: "btn-operation",
    value: "/",
  },

  {
    label: "7",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "7",
  },
  {
    label: "8",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "8",
  },
  {
    label: "9",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "9",
  },
  {
    label: "×",
    classes: "btn-operation bg-[#f0a608] text-black",
    dataAttr: "btn-operation",
    value: "*",
  },

  {
    label: "4",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "4",
  },
  {
    label: "5",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "5",
  },
  {
    label: "6",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "6",
  },
  {
    label: "-",
    classes: "btn-operation bg-[#f0a608] text-black",
    dataAttr: "btn-operation",
    value: "-",
  },

  {
    label: "1",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "1",
  },
  {
    label: "2",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "2",
  },
  {
    label: "3",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "3",
  },
  {
    label: "+",
    classes: "btn-operation bg-[#f0a608] text-black",
    dataAttr: "btn-operation",
    value: "+",
  },

  {
    label: '<i class="fa-solid fa-delete-left"></i>',
    classes: "btn-delete bg-[#404040] text-white",
    dataAttr: "btn-delete",
    isHTML: true,
  },
  {
    label: "0",
    classes: "btn-number bg-[#404040] text-white",
    dataAttr: "btn-number",
    value: "0",
  },
  {
    label: ".",
    classes: "btn-decimalpoint bg-[#404040] text-white",
    dataAttr: "btn-decimalpoint",
    value: ".",
  },
  {
    label: "=",
    classes: "btn-equal bg-[#f0a608] text-black",
    dataAttr: "btn-equal",
  },
];

const container = document.querySelector(".calc-buttons");

buttons.forEach((btn) => {
  const button = document.createElement("button");
  button.className = `${btn.classes} border-0 rounded-full h-[100px] w-[100px] text-2xl cursor-pointer select-none flex justify-center items-center transition-colors duration-200`;
  if (btn.dataAttr) {
    button.setAttribute(`data-${btn.dataAttr}`, "");
  }
  if (btn.value) {
    button.setAttribute("data-value", btn.value);
  }
  if (btn.isHTML) {
    button.innerHTML = btn.label;
  } else {
    button.textContent = btn.label;
  }
  container.appendChild(button);
});

// ดึง Element ต่าง ๆ จาก DOM
const numberButtons = document.querySelectorAll("[data-btn-number]");
const operationButtons = document.querySelectorAll("[data-btn-operation]");
const equalButton = document.querySelector("[data-btn-equal]");
const clearButton = document.querySelector("[data-btn-clear]");
const plusMinusButton = document.querySelector("[data-btn-plus-minus]");
const percentButton = document.querySelector("[data-btn-percent]");
const decimalButton = document.querySelector("[data-btn-decimalpoint]");
const currentScreen = document.querySelector("[data-current]");
const historyScreen = document.querySelector("[data-history]");
const deleteButton = document.querySelector("[data-btn-delete]");

class Calculator {
  constructor(currentScreen, historyScreen) {
    this.currentScreen = currentScreen;
    this.historyScreen = historyScreen;
    this.clear();
  }

  clear() {
    this.expression = ""; // เก็บสมการ
    this.currentOperand = "0";
    this.updateDisplay();
    this.updateHistoryDisplay();
  }

  deleteOne() {
    if (this.currentOperand.length > 1) {
      this.currentOperand = this.currentOperand.slice(0, -1);
    } else {
      this.currentOperand = "0";
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number;
    } else if (number === "." && this.currentOperand.includes(".")) {
      return;
    } else if (number === "." && this.currentOperand === "0") {
      this.currentOperand = "0.";
    } else {
      this.currentOperand += number;
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    this.expression += this.currentOperand + operation;
    this.updateHistoryDisplay();
    this.currentOperand = "0";
    this.updateDisplay();
  }

  compute() {
    this.expression += this.currentOperand;

    try {
      const result = eval(this.expression);
      this.historyScreen.innerText =
        this.formatExpression(this.expression) + " =";
      this.currentOperand = result.toString();
      this.expression = "";
    } catch (error) {
      this.currentOperand = "Error";
      this.expression = "";
    }

    this.updateDisplay();
  }

  toggleSign() {
    if (this.currentOperand.startsWith("-")) {
      this.currentOperand = this.currentOperand.slice(1);
    } else if (this.currentOperand !== "0") {
      this.currentOperand = "-" + this.currentOperand;
    }
    this.updateDisplay();
  }

  percent() {
    this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    this.updateDisplay();
  }

  updateDisplay() {
    this.currentScreen.innerText = this.currentOperand;
  }

  updateHistoryDisplay() {
    // ใช้ formatExpression เพื่อแปลง * เป็น × และ / เป็น ÷
    this.historyScreen.innerText = this.formatExpression(this.expression);
  }

  formatExpression(expression) {
    // แปลง * เป็น × และ / เป็น ÷ สำหรับแสดงผล
    return expression.replace(/\*/g, "×").replace(/\//g, "÷");
  }
}

const calculator = new Calculator(currentScreen, historyScreen);

numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.getAttribute("data-value"));
  });
});

operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.getAttribute("data-value"));
  });
});

equalButton.addEventListener("click", () => {
  calculator.compute();
});

clearButton.addEventListener("click", () => {
  calculator.clear();
});

plusMinusButton.addEventListener("click", () => {
  calculator.toggleSign();
});

percentButton.addEventListener("click", () => {
  calculator.percent();
});

decimalButton.addEventListener("click", () => {
  calculator.appendNumber(".");
});

deleteButton.addEventListener("click", () => {
  calculator.deleteOne();
});
