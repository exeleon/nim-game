import { simular_nim, preparar_matriz } from "./modules/nim.mjs";

window.onload = iniciar;

function iniciar() {
  const groups = document.getElementById("groups");
  const removeGroupButton = document.getElementById("removeGroupButton");
  const addGroupButton = document.getElementById("addGroupButton");
  const startButton = document.getElementById("startButton");
  const errorLabel = document.getElementById("errorLabel");
  const gameStep = document.getElementById("gameStep");
  const playerSection = document.getElementById("playerSection");
  const playerGroup = document.getElementById("playerGroup");
  const playerAmount = document.getElementById("playerAmount");
  const playerButton = document.getElementById("playerButton");
  const playerError = document.getElementById("playerError");
  const goTopButton = document.getElementById("goTopButton");
  const winner = document.getElementById("winner");

  let montones;

  function drawMatrix(matriz, title) {
    const matrizTable = document.createElement("table");

    for (let i = 0; i < matriz.length; i++) {
      const row = matriz[i];
      const matrizRow = document.createElement("tr");
      const rowNameCell = document.createElement("td");
      const rowAmountCell = document.createElement("td");
      rowNameCell.innerText = `Montón ${i + 1}`;
      rowAmountCell.innerText = `[${montones[i]}]`;
      matrizRow.appendChild(rowNameCell);
      matrizRow.appendChild(rowAmountCell);

      for (const column of row) {
        const matrizCell = document.createElement("td");
        matrizCell.innerText = column;
        matrizRow.appendChild(matrizCell);
      }
      matrizTable.appendChild(matrizRow);
    }

    const matrizContainer = document.createElement("div");
    matrizContainer.className = "matrix-container";
    const titleElement = document.createElement("p");
    titleElement.innerText = title;

    matrizContainer.appendChild(titleElement);
    matrizContainer.appendChild(matrizTable);
    gameStep.appendChild(matrizContainer);
    gameStep.style.display = "block";
  }

  function startGame() {
    const groupsArray = [];
    for (const child of groups.children) {
      if (child.tagName === "INPUT") {
        const amount = parseInt(child.value);
        if (amount > 0) {
          groupsArray.push(amount);
        } else {
          errorLabel.style.display = "block";
          return;
        }
      }
    }

    errorLabel.style.display = "none";
    winner.style.display = "none";
    gameStep.innerHTML = null;

    montones = groupsArray;
    // montones = [29, 11, 14];
    const matriz = preparar_matriz(montones);
    drawMatrix(matriz, "Estado inicial");

    playerGroup.innerHTML = null;
    matriz.forEach((_, index) => {
      const option = document.createElement("option");
      option.value = index.toString();
      option.innerText = (index + 1).toString();
      playerGroup.appendChild(option);
    });

    const firstMovementRadio = document.getElementsByName("firstMovementRadio");

    const firstMovement = Array.from(firstMovementRadio.values()).find(
      (e) => e.checked
    );

    if (firstMovement.value === "machine") {
      machineTurn();
    } else {
      playerSection.style.display = "flex";
    }
  }

  function verifyWinner() {
    const isWinner = montones.every((monton) => monton === 0);
    return isWinner;
  }

  function drawWinner(playerWins) {
    winner.children[0].innerText = playerWins
      ? "Tú ganaste!"
      : "La maquina ganó!";
    winner.style.display = "flex";
    playerSection.style.display = "none";
  }

  function machineTurn() {
    const [matriz, nuevos_montones, heapIndex, retirados] =
      simular_nim(montones);
    montones = nuevos_montones;
    drawMatrix(
      matriz,
      `La maquina retiró ${retirados} del montón ${heapIndex + 1}`
    );
    if (verifyWinner()) {
      drawWinner(false);
      return;
    }

    playerSection.style.display = "flex";
  }

  function playerTurn() {
    const index = parseInt(playerGroup.value);
    const amount = parseInt(playerAmount.value);

    if (
      isNaN(index) ||
      isNaN(amount) ||
      index < 0 ||
      index >= montones.length ||
      amount <= 0 ||
      amount > montones[index]
    ) {
      playerError.style.display = "block";
      playerAmount.focus();
      return;
    }

    playerError.style.display = "none";
    montones[index] -= amount;
    const matriz = preparar_matriz(montones);
    drawMatrix(matriz, `Tú retiraste ${amount} del montón ${index + 1}`);

    playerAmount.value = null;
    playerAmount.focus();

    if (verifyWinner()) {
      drawWinner(true);
    } else {
      machineTurn();
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function addGroup() {
    const input = document.createElement("input");
    input.type = "number";
    groups.appendChild(input);
  }

  function removeGroup() {
    const childInput = groups.children[groups.children.length - 1];
    groups.removeChild(childInput);
  }

  removeGroupButton.onclick = removeGroup;

  addGroupButton.onclick = addGroup;

  startButton.onclick = startGame;

  playerButton.onclick = playerTurn;

  goTopButton.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
}
