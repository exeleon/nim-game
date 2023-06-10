import { simular_nim, preparar_matriz } from "./modules/nim.mjs";

window.onload = main;

function main() {
  const heapsContainer = document.getElementById("heapsContainer");
  const removeHeapButton = document.getElementById("removeHeapButton");
  const addHeapButton = document.getElementById("addHeapButton");
  const startButton = document.getElementById("startButton");
  const settingsError = document.getElementById("settingsError");
  const gameSteps = document.getElementById("gameSteps");
  const player = document.getElementsByClassName("player")[0];
  const playerHeap = document.getElementById("playerHeap");
  const playerAmount = document.getElementById("playerAmount");
  const playerButton = document.getElementById("playerButton");
  const playerError = document.getElementById("playerError");
  const goTopButton = document.getElementById("goTopButton");
  const winner = document.getElementsByClassName("winner")[0];

  let heaps;
  let moveCounter = 0;

  function drawMatrix(matrix, title) {
    const matrixTable = document.createElement("table");

    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i];
      const matrixRow = document.createElement("tr");
      const rowNameCell = document.createElement("td");
      const rowAmountCell = document.createElement("td");
      rowNameCell.innerText = `Montón ${i + 1}`;
      rowAmountCell.innerText = `[${heaps[i]}]`;
      matrixRow.appendChild(rowNameCell);
      matrixRow.appendChild(rowAmountCell);

      for (const cell of row) {
        const matrixCell = document.createElement("td");
        matrixCell.innerText = cell;
        matrixRow.appendChild(matrixCell);
      }
      matrixTable.appendChild(matrixRow);
    }

    const matrixContainer = document.createElement("div");
    const titleElement = document.createElement("p");
    matrixContainer.className = "matrix-container";
    titleElement.innerText = `${moveCounter++}. ${title}`;

    matrixContainer.appendChild(titleElement);
    matrixContainer.appendChild(matrixTable);
    gameSteps.appendChild(matrixContainer);
    gameSteps.style.display = "block";
  }

  function startGame() {
    const heapsArray = [];
    for (const child of heapsContainer.children) {
      if (child.tagName === "INPUT") {
        const amount = parseInt(child.value);
        if (amount > 0) {
          heapsArray.push(amount);
        } else {
          settingsError.style.display = "block";
          return;
        }
      }
    }

    moveCounter = 0;
    heaps = heapsArray;
    settingsError.style.display = "none";
    winner.style.display = "none";
    gameSteps.innerHTML = null;
    playerHeap.innerHTML = null;

    const matrix = preparar_matriz(heaps);
    drawMatrix(matrix, "Estado inicial");

    matrix.forEach((_, index) => {
      const option = document.createElement("option");
      option.value = index.toString();
      option.innerText = (index + 1).toString();
      playerHeap.appendChild(option);
    });

    const firstMovementRadio = document.getElementsByName("firstMovementRadio");
    const firstMovement = Array.from(firstMovementRadio.values()).find(
      (e) => e.checked
    );

    if (firstMovement.value === "cpu") {
      machineMove();
    } else {
      player.style.display = "flex";
    }
  }

  function verifyWinner() {
    const isWinner = heaps.every((heap) => heap === 0);
    return isWinner;
  }

  function drawWinner(playerWins) {
    winner.children[0].innerText = playerWins
      ? "Tú ganaste!"
      : "La computadora ganó!";
    winner.style.display = "flex";
    player.style.display = "none";
  }

  function machineMove() {
    const [matrix, newHeaps, heapIndex, takenAmount] = simular_nim(heaps);

    heaps = newHeaps;
    drawMatrix(
      matrix,
      `La computadora retiró ${takenAmount} del montón ${heapIndex + 1}`
    );

    if (verifyWinner()) {
      drawWinner(false);
      return;
    }

    player.style.display = "flex";
  }

  function playerMove() {
    const heapIndex = parseInt(playerHeap.value);
    const takenAmount = parseInt(playerAmount.value);

    if (
      isNaN(heapIndex) ||
      isNaN(takenAmount) ||
      heapIndex < 0 ||
      heapIndex >= heaps.length ||
      takenAmount <= 0 ||
      takenAmount > heaps[heapIndex]
    ) {
      playerError.style.display = "block";
      playerAmount.focus();
      return;
    }

    playerError.style.display = "none";
    heaps[heapIndex] -= takenAmount;
    const matrix = preparar_matriz(heaps);
    drawMatrix(
      matrix,
      `Tú retiraste ${takenAmount} del montón ${heapIndex + 1}`
    );

    playerAmount.value = null;
    playerAmount.focus();

    if (verifyWinner()) {
      drawWinner(true);
    } else {
      machineMove();
    }

    scrollTo(document.body.scrollHeight);
  }

  function addHeap() {
    const input = document.createElement("input");
    input.type = "number";
    input.min = 1;
    heapsContainer.appendChild(input);
  }

  function removeHeap() {
    if (heapsContainer.children.length > 1) {
      const childInput =
        heapsContainer.children[heapsContainer.children.length - 1];
      heapsContainer.removeChild(childInput);
    }
  }

  function scrollTo(top) {
    window.scrollTo({ top, behavior: "smooth" });
  }

  removeHeapButton.onclick = removeHeap;
  addHeapButton.onclick = addHeap;
  startButton.onclick = startGame;
  playerButton.onclick = playerMove;
  goTopButton.onclick = () => scrollTo(0);
}
