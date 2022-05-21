const bodyEl = document.querySelector("body")
const tableEl = document.querySelector("table")

//white = false
// black = true
let whosTurn = false;
let isSelected = false

function updateTurn() {
  let el = document.querySelector("h1")
  el.textContent = `Whos Turn is it:  ${whosTurn ? "Black Pawns" : "White Pawns"}`
}

function StartGame() {
  let newElement = document.createElement("h1")
  newElement.textContent = `Whos Turn is it:  ${whosTurn ? "Black Pawns" : "White Pawns"}`
  bodyEl.prepend(newElement)

  for (let i = 0; i < 8; i++) {
    const Rows = document.createElement("tr")
    Rows.setAttribute("data-info", i)

    for (let j = 0; j < 8; j++) {
      const cellEl = document.createElement("td")
      cellEl.addEventListener("click", selectedPawn)
      cellEl.setAttribute("hasPawn", "")
      cellEl.setAttribute("position", `${[i, j]}`)

      cellEl.setAttribute("class", `${(j + i) % 2 ? "whiteCell" : "blackCell"}`)

      if (i == 0) {
        cellEl.textContent = "WPawn"
        cellEl.setAttribute("hasPawn", true)
      }
      if (i == 7) {
        cellEl.textContent = "BPawn"
        cellEl.setAttribute("hasPawn", true)
      }
      Rows.append(cellEl)
    }
    tableEl.append(Rows)
  }

  updateTurn()
}

function selectedPawn(e) {
  let selectedPawn = e.target
  let whichPlayer = selectedPawn.textContent
  let player = whosTurn ? "BPawn" : "WPawn"

  if (whichPlayer !== player) return

  let position = e.target.getAttribute("position")
  let row = parseInt(position[0])
  let col = parseInt(position[2])
  let nextCell = document.querySelector(`td[position="${whosTurn ? row - 1 : row + 1},${col}"]`)
  let crossLeft = nextCell.previousSibling
  let crossRight = nextCell.nextSibling


  if (selectedPawn.getAttribute("selected")) {
    removeFormat(selectedPawn, nextCell, crossLeft, crossRight)
    return
  }

  if (selectedPawn.getAttribute("haspawn") && !isSelected) {
    selectedPawn.classList.add("selected")
    selectedPawn.setAttribute("selected", true)
    nextCell.classList.add("temp")
    nextCell.addEventListener("click", movePawn, { once: true })
    isSelected = true
  }

  if (crossLeft?.textContent !== player && crossLeft?.getAttribute("haspawn")) {
    crossLeft?.classList.add("canEat")
    crossLeft?.addEventListener("click", eatPawn, { once: true })
  }

  if (crossRight?.textContent !== player && crossRight?.getAttribute("haspawn")) {
    crossRight?.classList.add("canEat")
    crossRight?.addEventListener("click", eatPawn, { once: true })
  }
}

function movePawn(e) {
  let clickedEl = e.target
  let hasPawn = clickedEl.getAttribute("haspawn")

  if (hasPawn) return

  let selectedPawn = document.querySelector('td[selected="true"]')

  selectedPawn.setAttribute("haspawn", "")
  clickedEl.setAttribute("haspawn", true)
  clickedEl.textContent = whosTurn ? "BPawn" : "WPawn"
  selectedPawn.textContent = ""

  let position = clickedEl.getAttribute("position")
  let row = parseInt(position[0])

  let crossLeft = clickedEl.previousSibling
  let crossRight = clickedEl.nextSibling
  removeFormat(selectedPawn, clickedEl, crossLeft, crossRight)
  checkIfWon(row)
  whosTurn = !whosTurn
  updateTurn()
}

function removeFormat(oldPawn, newPawn, left, right) {

  newPawn?.removeEventListener("click", movePawn)
  left?.removeEventListener("click", eatPawn)
  right?.removeEventListener("click", eatPawn)

  oldPawn.setAttribute("selected", "")
  newPawn.classList.remove("selected", "canEat", "temp")
  left?.classList.remove("selected", "canEat", "temp")
  oldPawn.classList.remove("selected", "canEat", "temp")
  right?.classList.remove("selected", "canEat", "temp")
  isSelected = false
}

function eatPawn(e) {

  let clickedEl = e.target
  let selectedPawn = document.querySelector('td[selected="true"]')
  selectedPawn.setAttribute("haspawn", "")
  clickedEl.setAttribute("haspawn", true)
  clickedEl.textContent = whosTurn ? "BPawn" : "WPawn"
  selectedPawn.textContent = ""

  let position = selectedPawn.getAttribute("position")
  let row = parseInt(position[0])
  let col = parseInt(position[2])

  let nextCell = document.querySelector(`td[position="${whosTurn ? row - 1 : row + 1},${col}"]`)
  let crossLeft = nextCell.previousSibling
  let crossRight = nextCell.nextSibling

  removeFormat(selectedPawn, nextCell, crossLeft, crossRight)
  checkIfWon(row+1)
  whosTurn = !whosTurn
  updateTurn()
}

function checkIfWon(row){
  let player = whosTurn ? "BPawn" : "WPawn"
  if (row == 0 && player == "BPawn") {
    alert("Black Pawn is the winner")
  }

  if(row == 7 && player == "WPawn") {
    alert("White Pawn is the winner")
    
  }
}



StartGame()