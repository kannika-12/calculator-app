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

  // ล้างค่าทั้งหมด
  // รีเซ็ตทุกสถานะและจอแสดงผล
  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = undefined;
    this.readyToReset = false;
    this.isNegative = false; // เพิ่มตัวแปรสำหรับเก็บเครื่องหมาย
    this.historyScreen.innerText = "";
    this.isPercent = false;
    this.updateDisplay();
  }
  deleteOne() {
    if (this.readyToReset) return; // ถ้ารอรีเซ็ตไม่ต้องลบ

    this.currentOperand = this.currentOperand.toString().slice(0, -1);

    if (this.currentOperand === "") {
      this.currentOperand = "0"; // ถ้าลบจนหมด ให้แสดงเป็น 0
    }

    this.updateDisplay();
  }

  // ใส่ตัวเลขหรือจุดทศนิยมลงไป
  // ถ้ามีการคำนวณเสร็จแล้ว กดตัวเลขใหม่ → ล้างค่าจอปัจจุบัน
  appendNumber(number) {
    if (this.readyToReset) {
      this.currentOperand = "";
      this.readyToReset = false;
      this.isPercent = false; // ✅ ต้องรีเซ็ตเสมอ
    }
    if (number === "." && this.currentOperand.includes(".")) return;
    this.currentOperand += number.toString();
    this.updateDisplay();
  }

  // เลือกเครื่องหมายคำนวณ (+ - × ÷)
  // ถ้ามีค่าก่อนหน้า → คำนวณก่อน แล้วค่อยเลือกเครื่องหมายใหม่
  // กดปุ่มใหม่แล้วเตรียมให้ป้อนค่าถัดไป (reset จอป้อนตัวเลข)
  chooseOperation(operation) {
    if (this.currentOperand === "" && this.historyScreen.innerText !== "") {
      this.historyScreen.innerText = this.historyScreen.innerText.replace(
        /[+\-×÷]\s$/,
        `${this.formatOperator(operation)} `
      );
      this.operation = operation;
      return;
    }

    if (this.currentOperand === "") return;

    this.historyScreen.innerText = `${
      this.currentOperand
    } ${this.formatOperator(operation)} `;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.operation = operation;
  }

  // ทำการคำนวณจริง
  // ดึงค่าก่อนหน้า และค่าปัจจุบันมาคิดตามเครื่องหมายที่เลือก
  // แสดงผลลัพธ์และอัพเดทจอแสดงผล
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = this.getCurrentValue();

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "-":
        computation = prev - current;
        break;
      case "*":
        computation = prev * current;
        break;
      case "/":
        computation = current === 0 ? "Error" : prev / current;
        break;
      case "%":
        computation = current / 100;
        break;

      default:
        return;
    }

    this.currentOperand = computation.toString();

    this.historyScreen.innerText = `${prev} ${this.formatOperator(
      this.operation
    )} ${current}`; // แสดงวิธีคิด: "1 + 5"

    this.operation = undefined;
    this.previousOperand = "";
    this.readyToReset = true;
    this.isNegative = false;
    this.isPercent = false;

    this.updateDisplay();
  }

  // สลับเครื่องหมาย +/− ของค่าปัจจุบัน
  // ใช้ตัวแปร isNegative เพื่อสลับสถานะ (แค่เปลี่ยนตอนแสดงผล ไม่เปลี่ยนค่าจริง)
  toggleSign() {
    if (this.currentOperand === "") return;
    this.isNegative = !this.isNegative; // สลับเครื่องหมาย (แค่โชว์)
    this.updateDisplay();
  }

  // เปลี่ยนค่าปัจจุบันให้เป็นเปอร์เซ็นต์ (หาร 100)
  // เช่น กด 4 → เปลี่ยนเป็น 0.04 (แต่จะแสดงผลเป็น 4%)
  percent() {
    // เช็คว่ามีค่าหรือยัง และกด % ไปแล้วหรือยัง
    if (this.currentOperand === "" || this.isPercent) return;

    const current = parseFloat(this.currentOperand);

    // แปลงเปอร์เซ็นต์เป็นทศนิยม
    const percentValue = current / 100;

    // เซ็ตค่าที่แปลงแล้วกลับไป
    this.currentOperand = percentValue.toString();

    // เซ็ตสถานะว่ากด % แล้ว เพื่อไม่ให้กดซ้ำ
    this.isPercent = true;

    // อัปเดตหน้าจอ
    this.updateDisplay();
  }

  // คืนค่าปัจจุบัน (พร้อมเครื่องหมาย) สำหรับใช้ในการคำนวณ
  getCurrentValue() {
    let value = parseFloat(this.currentOperand);
    if (this.isNegative) {
      value = value * -1;
    }
    if (this.isPercent) {
      value = value / 100; // เวลาคำนวณจริง ค่อยหาร 100
    }

    return value;
  }

  // แปลงเครื่องหมาย * เป็น × และ / เป็น ÷ เพื่อความสวยงาม
  formatOperator(op) {
    if (op === "*") return "×";
    if (op === "/") return "÷";
    return op || "";
  }

  // อัพเดทค่าที่จอแสดงผล
  // ถ้าค่าน้อยกว่า 1 และไม่ใช่ 0 → แสดงเป็นเปอร์เซ็นต์
  // ถ้ามี isNegative → ใส่เครื่องหมายลบหน้า
  updateDisplay() {
    let displayValue = this.currentOperand || "0";

    if (this.isPercent) {
      displayValue = Math.abs(parseFloat(displayValue)) * 100 + "%"; // ✅ ใช้ Math.abs เพื่อโชว์แบบบวก
      if (this.isNegative && displayValue !== "0%") {
        displayValue = "-" + displayValue; // ✅ ใส่ลบเอง
      }
    } else {
      if (this.isNegative && displayValue !== "0") {
        displayValue = "-" + displayValue;
      }
    }

    this.currentScreen.innerText = displayValue;
  }
}

// สร้างตัวแปร calculator
const calculator = new Calculator(currentScreen, historyScreen);

// ตัวเลข
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.getAttribute("data-value"));
  });
});

// เครื่องหมาย + - × ÷
operationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    calculator.chooseOperation(button.getAttribute("data-value"));
  });
});

// เท่ากับ
equalButton.addEventListener("click", () => {
  calculator.compute();
});

// ล้าง
clearButton.addEventListener("click", () => {
  calculator.clear();
});

// เปลี่ยนเครื่องหมาย +/-
plusMinusButton.addEventListener("click", () => {
  calculator.toggleSign();
});

// เปอร์เซ็นต์
percentButton.addEventListener("click", () => {
  calculator.percent();
});

// จุดทศนิยม
decimalButton.addEventListener("click", () => {
  calculator.appendNumber(".");
});
deleteButton.addEventListener("click", () => {
  calculator.deleteOne();
});

