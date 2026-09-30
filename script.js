const display = document.getElementById("display");
const history = document.getElementById("history");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

function update() {
  display.textContent = current;
  history.textContent = previous !== null && operator
    ? `${previous} ${symbols[operator]}`
    : "";
}

function inputNumber(n) {
  if (justEvaluated) { current = "0"; justEvaluated = false; }
  if (n === "." && current.includes(".")) return;
  current = current === "0" && n !== "." ? n : current + n;
}

function compute(a, b, op) {
  a = parseFloat(a); b = parseFloat(b);
  if (op === "+") return a + b;
  if (op === "-") return a - b;
  if (op === "*") return a * b;
  if (op === "/") return b === 0 ? "Can't divide by 0" : a / b;
}

function format(value) {
  if (typeof value === "string") return value;
  return String(parseFloat(value.toPrecision(12)));
}

function chooseOperator(op) {
  if (operator && !justEvaluated) equals(true);
  previous = current;
  operator = op;
  justEvaluated = false;
  current = "0";
}

function equals(chain = false) {
  if (!operator || previous === null) return;
  const result = format(compute(previous, current, operator));
  if (!chain) history.textContent = `${previous} ${symbols[operator]} ${current} =`;
  current = result;
  previous = null;
  operator = null;
  justEvaluated = true;
  display.textContent = current;
  if (chain) justEvaluated = false;
}

function clearAll() {
  current = "0"; previous = null; operator = null; justEvaluated = false;
}

document.querySelector(".keys").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.num !== undefined) inputNumber(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "equals") { equals(); return; }
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "back") {
    current = current.length > 1 ? current.slice(0, -1) : "0";
  } else if (btn.dataset.action === "percent") {
    current = format(parseFloat(current) / 100);
  }
  update();
});

document.addEventListener("keydown", (e) => {
  const map = { Enter: "equals", "=": "equals", Backspace: "back", Escape: "clear" };
  const sel =
    /^[0-9.]$/.test(e.key) ? `[data-num="${e.key}"]` :
    /^[-+*\/]$/.test(e.key) ? `[data-op="${e.key}"]` :
    map[e.key] ? `[data-action="${map[e.key]}"]` : null;
  if (sel) { e.preventDefault(); document.querySelector(sel)?.click(); }
});

update();
