const STARTING_POSITION = 4;
const DEFAULT_ROTATION = 0;
const LEFT_ARROW_CODE = 37;
const UP_ARROW_CODE = 38;
const RIGHT_ARROW_CODE = 39;
const DOWN_ARROW_CODE = 40;

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startButton = document.querySelector("#start_button");
  const width = 10;

  const tetrominoes = {
    lTetromino: [
      [1, 2, width + 1, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 2],
      [1, width + 1, width * 2, width * 2 + 1],
      [width, width * 2, width * 2 + 1, width * 2 + 2],
    ],
    zTetromino: [
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
      [0, width, width + 1, width * 2 + 1],
      [width + 1, width + 2, width * 2, width * 2 + 1],
    ],
    tTetromino: [
      [1, width, width + 1, width + 2],
      [1, width + 1, width + 2, width * 2 + 1],
      [width, width + 1, width + 2, width * 2 + 1],
      [1, width, width + 1, width * 2 + 1],
    ],
    oTetromino: [
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
      [0, 1, width, width + 1],
    ],
    iTetromino: [
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
      [1, width + 1, width * 2 + 1, width * 3 + 1],
      [width, width + 1, width + 2, width + 3],
    ],
  };

  let current_position = STARTING_POSITION;
  let current_rotation = DEFAULT_ROTATION;

  let current_tetromino =
    tetrominoes[
      Object.keys(tetrominoes)[
        Math.floor(Math.random() * Object.keys(tetrominoes).length)
      ]
    ];
  let current = current_tetromino[current_rotation];

  const draw = () => {
    current.forEach((index) => {
      squares[current_position + index].classList.add("tetromino");
    });
  };

  const erase = () => {
    current.forEach((index) => {
      squares[current_position + index].classList.remove("tetromino");
    });
  };

  draw();
  timerId = setInterval(moveDown, 1000);

  function control(e) {
    switch (e.keyCode) {
      case 37:
        moveLeft();
        break;
      case 39:
        moveRight();
        break;
      case 38:
        rotate();
        break;
      case 40:
        moveDown();
        break;
    }
  }

  function isAtRightEdge() {
    return current.some(
      (index) => (current_position + index) % width === width - 1
    );
  }
  function isAtLeftEdge() {
    return current.some((index) => (current_position + index) % width === 0);
  }

  function rotate() {
    erase();
    current_rotation++;
    if (current_rotation === current.length) current_rotation = 0;

    while (isAtRightEdge() || isAtLeftEdge()) {
      if (isAtRightEdge()) {
        current_position--;
      } else if (isAtLeftEdge()) {
        current_position++;
      }
    }

    current = current_tetromino[current_rotation];
    draw();
  }

  document.addEventListener("keydown", control);

  function moveDown() {
    const isBelowTaken = current.some((index) =>
      squares[current_position + index + width].classList.contains("taken")
    );
    if (isBelowTaken) return;
    erase();
    current_position += width;
    draw();
    setTimeout(freeze, 600);
  }

  function freeze() {
    /* 
    If a tetromino reaches the bottom of the grid,
    freeze it and draw a new tetromino 
    */

    // If the tetromino reaches a div with the class "taken", freeze it
    if (
      current.some((index) =>
        squares[current_position + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        // Set the squares that are overlapped by the tetromino as taken
        squares[current_position + index].classList.add("taken")
      );
      // Create a new tetromino
      current_tetromino =
        tetrominoes[
          Object.keys(tetrominoes)[
            Math.floor(Math.random() * Object.keys(tetrominoes).length)
          ]
        ];
      current = current_tetromino[current_rotation];
      current_position = STARTING_POSITION;
    }
  }

  function moveLeft() {
    // erase the current tetromino
    erase();

    // Check if reached the left side of the grid
    const isAtLeftEdge = current.some(
      (index) => (current_position + index) % width === 0
    );
    if (!isAtLeftEdge) {
      current_position -= 1;
    }

    // Check if there is a taken space on the left
    const isLeftTaken = current.some((index) =>
      squares[current_position + index].classList.contains("taken")
    );
    if (isLeftTaken) {
      current_position += 1;
    }

    draw();
  }

  function moveRight() {
    // erase the current tetromino
    erase();

    // Check if reached the right side of the grid
    const isAtRightEdge = current.some(
      (index) => (current_position + index) % width === width - 1
    );
    if (!isAtRightEdge) current_position += 1;

    // Check if there is a taken space on the right
    const isRightTaken = current.some((index) =>
      squares[current_position + index].classList.contains("taken")
    );
    if (isRightTaken) current_position -= 1;

    draw();
  }
});
