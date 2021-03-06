function evaluate() {
	if (pushCurrentNum() && evalArray.length >= 3) {
		equHistory[equHistory.length] = evalArray.join('');

		// Do multiplication and division first
		while (evalArray.includes('÷') || evalArray.includes('×')) {
			index = evalArray.findIndex((x) => {
				if (x === '÷' || x === '×') {
					return true;
				}
				else return false;
			});
			let operator = evalArray[index];
			let n1 = evalArray[index - 1];
			let n2 = evalArray[index + 1];
			evalArray[index - 1] = operate(operator, n1, n2);
			evalArray.splice(index, 2);
		}

		// All other operations
		while (evalArray.length >= 3) {
			evalArray[0] = operate(evalArray[1], evalArray[0], evalArray[2]);
			evalArray.splice(1, 2); 
		}
		currentNum = evalArray[0].toString();
		equHistory[equHistory.length - 1] += '=' + evalArray[0];
		evalArray = [];
		updateDisplay();
	}
}

function operate (operator, n1, n2) {
	switch (operator) {
		case '+':
			return add(n1, n2);
			break;
		case '-':
			return subtract(n1, n2);
			break;
		case '×':
		case '*':
		case 'x': 
		case 'X':
			return multiply(n1, n2);
			break;
		case '÷':
		case '/':
			if (n2 == 0) {
				alert("You fool! You can't divide by zero!");
				return "I can't even";
			}
			return divide(n1, n2);
			break;
		default:
			return 'Invalid input';
			break;
	}
}

function add (a, b) {
	return a + b;
}

function subtract (a, b) {
	return a - b;
}

function multiply (a, b) {
	return +(a * b).toFixed(2);
}

function divide (a, b) {
	return a / b;
}

function numPress(num) {
	if (currentNum === '0') currentNum = '';
	num = pressHelper(num);
	currentNum += num;
	updateDisplay();
}

function opPress(op) {
	op = pressHelper(op);
	if (pushCurrentNum()) {
		evalArray.push(op);
		updateDisplay();
	}
}

function pressHelper(event) {
	let keyPressed;
	if (event.target.type === "button") {
		keyPressed = event.target.textContent.trim();
	} else if (event.target.localName === "body") {
		keyPressed = event.key.trim();
		switch (keyPressed) {
			case '/':
				keyPressed = '÷';
				break;
			case '*':
			case 'x': 
			case 'X':
				keyPressed = '×';
				break;
		}
	}
	return keyPressed;
}

function decPress() {
	if (!currentNum.includes('.')) {
		currentNum += '.';
		updateDisplay();
	}
}

function delPress() {
	currentNum = currentNum.substr(0, currentNum.length - 1);
	updateDisplay();
}

function pushCurrentNum() {
	if (!isNaN(parseFloat(currentNum))) {
		evalArray.push(parseFloat(currentNum));
		currentNum = '';
		return true;
	}
	else return false;
}

function updateDisplay() {
	// Update History
	const historyField = document.querySelector('.historyCon');
	let formattedHistory = equHistory.map((equa) => {return '<span class="history">' + equa + '</span>'})
	historyField.innerHTML = formattedHistory.join('');
	historyField.scrollTop = historyField.scrollHeight;
	if (currentNum === "I can't even") currentNum = '0';
	// Update Current Input
	const current = document.querySelector('.current');
	let displayValue = evalArray.join('');
	displayValue += currentNum;
	current.textContent = displayValue;
}

function clearAll() {
	evalArray = [];
	currentNum = '0';
	equHistory = [];
	updateDisplay();
}

let evalArray = [];
let currentNum = '0';
let equHistory = [];

const numButtons = document.querySelectorAll(".int");
numButtons.forEach((button) => {
	button.addEventListener('click', numPress);
});

const ops = document.querySelectorAll('.op')
ops.forEach((button) => {
	button.addEventListener('click', opPress)
});

const equals = document.querySelector('#equals')
equals.addEventListener('click', evaluate);

const clear = document.querySelector('.clear');
clear.addEventListener('click', clearAll);

const dec = document.querySelector('.decimal');
dec.addEventListener('click', decPress)

const del = document.querySelector('.delete');
del.addEventListener('click', delPress);

window.onkeydown = (e) => {
	if (parseInt(e.key) || e.key === '0') {
		numPress(e);
	}
	const opPatt = new RegExp('[\-\/\+\*xX]');
	if (opPatt.test(e.key)) {
		opPress(e);
	}
	switch (e.key) {
		case 'Enter':
		case '=':
			evaluate();
			break;
		case '.':
			decPress();
			break;
		case 'Backspace':
		case 'Delete':
			delPress();
			break;
	}
}