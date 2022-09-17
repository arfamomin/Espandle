const tileDisplay = document.querySelector('.tile-container'); //picks out tile div from html
const keyboard = document.querySelector('.key-container');////picks out key div from html
const messageDisplay = document.querySelector('.message-container');////picks out message div from html
const hintDisplay = document.querySelector('.hint-container');////picks out message div from html

const palabras = 
[
  [
    'MITAD', 
    'PALMA',
    'TOPAR', 
    'GUSTO',
    'BORDE',
    'TOMAR',
    'BAÑAR',
    'CARTA',
    'CEDAR',
    'ROZAR',
    'FALLA',
    'SUCIO',
    'CHICO',
    'PODER',
    'SOBRA',
    'TOCAR',
    'ÉXITO',
    'POBRE',
    'LEJOS',
    'CULPA',
    'GALLO',
    'ANTES',
    'GUAPO',
    'CURSO',
    'ARROZ',
    'ÁCIDO',
    'JUSTO'
  ],
  
  [
    'half, middle',
    'palm tree',
    'to run into, bump into',
    'pleasure, taste, preference',
    'edge',
    'to take, drink',
    'to bathe, take a bath',
    'letter, (playing) card',
    'to transfer, to give in',
    'to touch (lightly)',
    'flaw, failure',
    'dirty, filthy',
    'kid',
    'to be able to, power', 
    'excess, surplus, leftover',
    'to touch, play (instrument)',
    'success',
    'poor',
    'far away',
    'blame, fault',
    'rooster',
    'before',
    'handsome, beautiful',
    'course, direction',
    'rice',
    'acid',
    'fair, just'
  ]
]

//chooses random word from matrix and stores it's defintiton
const index = Math.floor(Math.random() * palabras[0].length)
const word = palabras[0][index]
const english = palabras[1][index]

//const word = 'GALLO' //was used for tesing 

/*Data Structure 1 - USES A STATIC ARRAY*/
const keys = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<<', 'Á', 'É', 'Í', 'Ó', 'Ú', 'Ü', 'Ñ'];

/*Data Structure 2 - USES A MATRIX*/ 
const guessRows = [
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' '],
  [' ', ' ', ' ', ' ', ' ']
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

//appends show hint button onto screen
const hintElement = document.createElement('p')
hintElement.textContent = 'Show Hint'
hintDisplay.append(hintElement)

//displays translation if hint is clicked
hintElement.onclick = function()
{
  hintElement.textContent = english
}

//gives id to each tile on each row 
guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement('div')
  rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement('div')
    tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + "-tile-" + guessIndex)
    tileElement.classList.add('tile')
    rowElement.append(tileElement)
  })
  tileDisplay.append(rowElement)
})


keys.forEach(key => {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = key
  buttonElement.setAttribute('id', key)
  buttonElement.addEventListener('click', () => handleClick(key))
  keyboard.append(buttonElement)
})

//gives "ENTER" and delete key function and calls addLetter
const handleClick = (letter) => {
  console.log('clicked', letter)
  if (letter === "<<"){
    console.log ('delete letter')
    deleteLetter()
    return
  }
  if (letter === 'ENTER'){
      console.log('check row')
      checkRow()
      return 
  }
  addLetter(letter)
}

//adds letter clicked keyboard to tiles if possible
const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6 ){
    const tile = document.getElementById('guessRow-' + currentRow + "-tile-" + currentTile)
  tile.textContent = letter
  guessRows[currentRow][currentTile] = letter
  tile.setAttribute('data', letter)
  currentTile++
  console.log ('guessRows', guessRows)
  }
}

//when press back space
const deleteLetter = () => {
  if (currentTile > 0){
     currentTile--
  const tile = document.getElementById('guessRow-' + currentRow + "-tile-" + currentTile)
  tile.textContent = ' '
  guessRows[currentRow][currentTile] = ''
  tile.setAttribute('data', '')
  }
}

//when press enter 
const checkRow = () => {
  const guess = guessRows[currentRow].join('')
  
  if (currentTile > 4){
    console.log('guess is ' + guess, 'wordle is ' + word)
    flipTile()
    
    if (word == guess){
      showMessage('¡Excelente!')
      isGameOver = true
      return
    } else {
      if (currentRow >= 5) {
        isGameOver = false
        showMessage ('Fin del Juego. The correct word is ' + word)  
        return
      } 
      if (currentRow < 5)
        currentRow++
        currentTile = 0
    }
  }
}

//adds the pop-up message 
const showMessage = (message) => {
  const messageElement = document.createElement('p')
  messageElement.textContent = message
  messageDisplay.append(messageElement)
  setTimeout(() => messageDisplay.removeChild(messageElement), 8000)
}

//changes key to green, yellow, or grey after guess is submitted 
const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter)
  key.classList.add(color)
}

//changes tile to green, yellow, or grey after guess is submitted 
const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWord = word
    let found = true
    const guess = []

    /*Data Structure 3 - USES A STACK*/
    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter == word[index]) {
            guess.color = 'green-overlay'
            found = true
            checkWord = checkWord.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWord.includes(guess.letter) && found != true) {
            guess.color = 'yellow-overlay'
            checkWord = checkWord.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}

//Improvements to be made: 1) Allow any size word 2) add how to play/information pop-up 