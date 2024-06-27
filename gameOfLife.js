document.addEventListener("DOMContentLoaded", () => {
	const boardElement = document.getElementById('board');
	const startButton = document.getElementById('startButton');
	const resetButton = document.getElementById('resetButton');
	const rows = 30;
	const cols = 30;
	let board = createBoard(rows, cols);
	let nextBoard = createBoard(rows, cols);
	let intervalId;
	let gameRunning = false; // Track if the game is currently running

	// Initialize the board for user interaction
	initializeBoard(board);
	renderBoard(board, boardElement);

	// Add event listener for cell clicks
	boardElement.addEventListener('click', (event) => {
		 if (!gameRunning) { // Allow cell toggling only if game is not running
			  const cell = event.target;
			  const row = cell.dataset.row;
			  const col = cell.dataset.col;
			  if (board[row][col] === 1) {
					board[row][col] = 0;
			  } else {
					board[row][col] = 1;
			  }
			  renderBoard(board, boardElement);
		 }
	});

	// Add event listener for start button
	startButton.addEventListener('click', () => {
		 if (!gameRunning) { // Start the game only if it's not already running
			  gameRunning = true;
			  if (intervalId) {
					clearInterval(intervalId);
			  }
			  intervalId = setInterval(() => {
					updateBoard(board, nextBoard);
					renderBoard(board, boardElement);
					// Swap boards
					[board, nextBoard] = [nextBoard, board];

					// Check if all cells are dead
					if (isGameOver(board)) {
						 clearInterval(intervalId);
						 gameRunning = false;
						 alert("Game Over! All cells are dead.");
					}
			  }, 200);
		 }
	});

	// Add event listener for reset button
	resetButton.addEventListener('click', () => {
		 if (!gameRunning) { // Reset only if game is not running
			  initializeBoard(board);
			  renderBoard(board, boardElement);
		 } else { // Reset even if game is running
			  gameRunning = false;
			  clearInterval(intervalId);
			  initializeBoard(board);
			  renderBoard(board, boardElement);
		 }
	});
});

// Create a 2D array representing the board
function createBoard(rows, cols) {
	const board = [];
	for (let i = 0; i < rows; i++) {
		 board[i] = [];
		 for (let j = 0; j < cols; j++) {
			  board[i][j] = 0;
		 }
	}
	return board;
}

// Initialize the board with dead cells
function initializeBoard(board) {
	for (let i = 0; i < board.length; i++) {
		 for (let j = 0; j < board[i].length; j++) {
			  board[i][j] = 0; // All cells start dead
		 }
	}
}

// Render the board
function renderBoard(board, boardElement) {
	boardElement.innerHTML = '';
	boardElement.style.gridTemplateColumns = `repeat(${board[0].length}, 20px)`;
	board.forEach((row, rowIndex) => {
		 row.forEach((cell, colIndex) => {
			  const div = document.createElement('div');
			  div.className = 'cell';
			  div.dataset.row = rowIndex;
			  div.dataset.col = colIndex;
			  if (cell === 1) div.classList.add('alive');
			  else div.classList.add('dead');
			  boardElement.appendChild(div);
		 });
	});
}

// Update the board according to the Game of Life rules
function updateBoard(board, nextBoard) {
	for (let i = 0; i < board.length; i++) {
		 for (let j = 0; j < board[i].length; j++) {
			  const liveNeighbors = countLiveNeighbors(board, i, j);
			  if (board[i][j] === 1) {
					// Any live cell with fewer than two or more than three live neighbours dies
					nextBoard[i][j] = liveNeighbors < 2 || liveNeighbors > 3 ? 0 : 1;
			  } else {
					// Any dead cell with exactly three live neighbours becomes a live cell
					nextBoard[i][j] = liveNeighbors === 3 ? 1 : 0;
			  }
		 }
	}
}

// Count the number of live neighbors around a given cell
function countLiveNeighbors(board, x, y) {
	const directions = [
		 [-1, -1], [-1, 0], [-1, 1],
		 [0, -1],         [0, 1],
		 [1, -1], [1, 0], [1, 1]
	];
	let liveNeighbors = 0;
	directions.forEach(([dx, dy]) => {
		 const newX = x + dx;
		 const newY = y + dy;
		 if (newX >= 0 && newX < board.length && newY >= 0 && newY < board[0].length) {
			  liveNeighbors += board[newX][newY];
		 }
	});
	return liveNeighbors;
}

// Check if all cells are dead
function isGameOver(board) {
	for (let i = 0; i < board.length; i++) {
		 for (let j = 0; j < board[i].length; j++) {
			  if (board[i][j] === 1) {
					return false; // Found a live cell, game is not over
			  }
		 }
	}
	return true; // All cells are dead
}