const display=document.getElementById('display');
const buttonsContainer=document.getElementById('calculator-buttons');
const modeButtons=document.querySelectorAll('.modes li');
const themeSelect=document.getElementById('theme');

let currentMode='basic';
let expression='';

// Buttons ordered logically
const buttonsConfig={
    basic:[
        '7','8','9','/','C',
        '4','5','6','*','%',
        '1','2','3','-','^',
        '0','.','=','+'
    ],
    casio:[
        '7','8','9','/','sqrt',
        '4','5','6','*','%',
        '1','2','3','-','^',
        '0','.','=','+',
        '(' ,')','sin','cos','tan','C'
    ]
};

// Generate buttons
function generateButtons(mode){
    buttonsContainer.innerHTML='';
    buttonsConfig[mode].forEach(btn=>{
        const button=document.createElement('button');
        button.textContent=btn;
        button.addEventListener('click',()=>handleInput(btn));
        buttonsContainer.appendChild(button);
    });
}

// Handle input
function handleInput(value){
    if(value==='C'){expression=''; display.value='';}
    else if(value==='='){try{display.value=evalExpression(expression); expression=display.value;}catch{display.value='Error'; expression='';}}
    else if(['sin','cos','tan','sqrt','^','%'].includes(value)){
        expression+=convertFunction(value);
        display.value=expression;
    } else{expression+=value; display.value=expression;}
}

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

function evalExpression(exp){return Function('"use strict";return ('+exp+')')();}

// Switch modes
modeButtons.forEach(btn=>{
    btn.addEventListener('click',()=>{
        modeButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        currentMode=btn.dataset.mode;
        generateButtons(currentMode);
        expression=''; display.value='';
    });
});

// Theme switch
themeSelect.addEventListener('change',()=>{document.body.setAttribute('data-theme',themeSelect.value);});

// Keyboard support
document.addEventListener('keydown',(e)=>{
    const key=e.key.toLowerCase();
    const allowedKeys='0123456789+-*/().';
    if(allowedKeys.includes(key)) handleInput(key);
    else if(key==='enter') handleInput('=');
    else if(key==='backspace'){expression=expression.slice(0,-1); display.value=expression;}
    else if(key==='escape') handleInput('C');
    else if(key==='^') handleInput('^');
    else if(currentMode==='casio'){
        if(key==='s') handleInput('sin');
        if(key==='c') handleInput('cos');
        if(key==='t') handleInput('tan');
        if(key==='r') handleInput('sqrt');
    }
});

// Initial load
generateButtons(currentMode);
