// -------------------------
// 1. Get DOM elements
// -------------------------
const display = document.getElementById('display');
const buttonsContainer = document.getElementById('calculator-buttons');
const modeButtons = document.querySelectorAll('.modes li');
const themeSelect = document.getElementById('theme');

let currentMode = 'basic';
let expression = "";

// -------------------------
// 2. Define buttons for each mode (in order)
// -------------------------
const buttonsConfig = {
  basic: [
    '7','8','9','/','C',
    '4','5','6','*','%',
    '1','2','3','-','^',
    '0','.','=','+'
  ],
  casio: [
    '7','8','9','/','sqrt',
    '4','5','6','*','%',
    '1','2','3','-','^',
    '0','.','=','+',
    '(' ,')','sin','cos','tan','C'
  ]
};

// -------------------------
// 3. Generate buttons dynamically
// -------------------------
function generateButtons(mode){
  buttonsContainer.innerHTML = ''; // clear previous buttons

  buttonsConfig[mode].forEach(btn => {
    const button = document.createElement('button');
    button.textContent = btn;
    
    // Add click event using DOM
    button.addEventListener('click', () => handleInput(btn));
    
    buttonsContainer.appendChild(button);
  });
}

// -------------------------
// 4. Handle button input
// -------------------------
function handleInput(value){
  if(value === 'C'){ // Clear
    expression = '';
    display.value = '';
  }
  else if(value === '='){ // Evaluate
    try{
      display.value = evalExpression(expression);
      expression = display.value; // save result
    } catch {
      display.value = 'Error';
      expression = '';
    }
  }
  else if(['sin','cos','tan','sqrt','^','%'].includes(value)){
    expression += convertFunction(value);
    display.value = expression;
  }
  else { // numbers & operators
    expression += value;
    display.value = expression;
  }
}

// -------------------------
// 5. Convert special functions
// -------------------------
function convertFunction(func){
  switch(func){
    case 'sqrt': return 'Math.sqrt(';
    case 'sin': return 'Math.sin(';
    case 'cos': return 'Math.cos(';
    case 'tan': return 'Math.tan(';
    case '^': return '**';
    case '%': return '/100';
  }
}

// -------------------------
// 6. Evaluate expression
// -------------------------
function evalExpression(exp){
  return Function('"use strict";return ('+exp+')')();
}

// -------------------------
// 7. Mode switching
// -------------------------
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentMode = btn.dataset.mode;
    generateButtons(currentMode);

    expression = '';
    display.value = '';
  });
});

// -------------------------
// 8. Theme switching
// -------------------------
themeSelect.addEventListener('change', () => {
  document.body.setAttribute('data-theme', themeSelect.value);
});

// -------------------------
// 9. Keyboard support
// -------------------------
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  const allowedKeys = '0123456789+-*/().';

  if(allowedKeys.includes(key)) handleInput(key);
  else if(key === 'enter') handleInput('=');
  else if(key === 'backspace'){
    expression = expression.slice(0,-1);
    display.value = expression;
  }
  else if(key === 'escape') handleInput('C');
  else if(key === '^') handleInput('^');
  
  if(currentMode === 'casio'){
    if(key === 's') handleInput('sin');
    if(key === 'c') handleInput('cos');
    if(key === 't') handleInput('tan');
    if(key === 'r') handleInput('sqrt');
  }
});

// -------------------------
// 10. Initial load
// -------------------------
generateButtons(currentMode);
