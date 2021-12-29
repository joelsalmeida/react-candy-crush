import { useCallback, useEffect, useState } from 'react';
import ScoreBoard from './components/ScoreBoard';
import blank from './images/blank.png';
import blueCandy from './images/blue-candy.png';
import greenCandy from './images/green-candy.png';
import orangeCandy from './images/orange-candy.png';
import purpleCandy from './images/purple-candy.png';
import redCandy from './images/red-candy.png';
import yellowCandy from './images/yellow-candy.png';

const width = 8;
const candyColors = [
  blank,
  blueCandy,
  greenCandy,
  orangeCandy,
  purpleCandy,
  redCandy,
  yellowCandy,
];

const pointX3 = 10;
const pointX4 = 25;

function App() {
  const [currentCandyArrangement, setCurrentCandyArrangement] = useState([]);

  const [candyDragged, setCandyDragged] = useState(null);
  const [candyDropped, setCandyDropped] = useState(null);
  const [score, setScore] = useState(0);

  const createBoard = () => {
    const randomCandyArrangement = [];

    for (let index = 0; index < width * width; index++) {
      const randomCandyColorsIndex = Math.floor(Math.random() * candyColors.length);
      const randomCandy = candyColors[randomCandyColorsIndex];

      randomCandyArrangement.push(randomCandy);
    }

    setCurrentCandyArrangement(randomCandyArrangement);
  };

  const checkForColumnsOfFour = useCallback(() => {
    for (let index = 0; index <= 39; index++) {
      const currentCandy = currentCandyArrangement[index];
      const columnFour = [index, index + width, index + width * 2, index + width * 3];
      const isNotBlank = currentCandyArrangement[index] !== blank;

      if (
        columnFour.every(
          (candy) => currentCandyArrangement[candy] === currentCandy && isNotBlank
        )
      ) {
        columnFour.forEach((candy) => (currentCandyArrangement[candy] = blank));
        setScore((score) => score + pointX4);
        return true;
      }
    }
  }, [currentCandyArrangement]);

  const checkForColumnsOfThree = useCallback(() => {
    for (let index = 0; index <= 47; index++) {
      const currentCandy = currentCandyArrangement[index];
      const columnThree = [index, index + width, index + width * 2];
      const isNotBlank = currentCandyArrangement[index] !== blank;

      if (
        columnThree.every((candy) => currentCandyArrangement[candy] === currentCandy) &&
        isNotBlank
      ) {
        columnThree.forEach((candy) => (currentCandyArrangement[candy] = blank));
        setScore((score) => score + pointX3);
        return true;
      }
    }
  }, [currentCandyArrangement]);

  const checkForRowsOfFour = useCallback(() => {
    for (let index = 0; index < 64; index++) {
      const currentCandy = currentCandyArrangement[index];
      const rowFour = [index, index + 1, index + 2, index + 3];
      const toIgnore = [
        5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55,
        62, 63, 64,
      ];
      const isNotBlank = currentCandyArrangement[index] !== blank;

      if (toIgnore.includes(index)) continue;

      if (
        rowFour.every((candy) => currentCandyArrangement[candy] === currentCandy) &&
        isNotBlank
      ) {
        rowFour.forEach((candy) => (currentCandyArrangement[candy] = blank));
        setScore((score) => score + pointX4);
        return true;
      }
    }
  }, [currentCandyArrangement]);

  const checkForRowsOfThree = useCallback(() => {
    for (let index = 0; index < 64; index++) {
      const currentCandy = currentCandyArrangement[index];
      const rowThree = [index, index + 1, index + 2];
      const toIgnore = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];
      const isNotBlank = currentCandyArrangement[index] !== blank;

      if (toIgnore.includes(index)) continue;

      if (
        rowThree.every((candy) => currentCandyArrangement[candy] === currentCandy) &&
        isNotBlank
      ) {
        rowThree.forEach((candy) => (currentCandyArrangement[candy] = blank));
        setScore((score) => score + pointX3);
        return true;
      }
    }
  }, [currentCandyArrangement]);

  const addGravity = useCallback(() => {
    for (let index = 0; index <= 55; index++) {
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(index);

      if (isFirstRow && currentCandyArrangement[index] === blank) {
        const randomNumber = Math.floor(Math.random() * candyColors.length);
        currentCandyArrangement[index] = candyColors[randomNumber];
      }

      if (currentCandyArrangement[index + width] === blank) {
        currentCandyArrangement[index + width] = currentCandyArrangement[index];
        currentCandyArrangement[index] = blank;
      }
    }
  }, [currentCandyArrangement]);

  useEffect(() => createBoard(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColumnsOfFour();
      checkForColumnsOfThree();

      checkForRowsOfFour();
      checkForRowsOfThree();

      addGravity();

      setCurrentCandyArrangement([...currentCandyArrangement]);
    }, 100);

    return () => clearInterval(timer);
  }, [
    addGravity,
    checkForColumnsOfFour,
    checkForColumnsOfThree,
    checkForRowsOfFour,
    checkForRowsOfThree,
    currentCandyArrangement,
  ]);

  const dragStart = ({ target }) => {
    setCandyDragged(target);
  };

  const dragDrop = ({ target }) => {
    setCandyDropped(target);
  };

  const dragEnd = () => {
    const candyDraggedId = parseInt(candyDragged.getAttribute('data-id'));
    const candyDroppedId = parseInt(candyDropped.getAttribute('data-id'));

    const validMoves = [
      candyDraggedId - 1,
      candyDraggedId + 1,
      candyDraggedId - width,
      candyDraggedId + width,
    ];

    const validMove = validMoves.includes(candyDroppedId);
    if (!validMove) return;

    currentCandyArrangement[candyDroppedId] = candyDragged.getAttribute('src');
    currentCandyArrangement[candyDraggedId] = candyDropped.getAttribute('src');

    const columnOfFour = checkForColumnsOfFour();
    const rowOfFour = checkForRowsOfFour();
    const columnOfThree = checkForColumnsOfThree();
    const rowOfThree = checkForRowsOfThree();

    if (
      candyDroppedId &&
      validMove &&
      (columnOfFour || rowOfFour || columnOfThree || rowOfThree)
    ) {
      setCandyDragged(null);
      setCandyDropped(null);
    } else {
      currentCandyArrangement[candyDraggedId] = candyDragged.getAttribute('src');
      currentCandyArrangement[candyDroppedId] = candyDropped.getAttribute('src');
      setCurrentCandyArrangement([...currentCandyArrangement]);
    }
  };

  return (
    <div className="app">
      <span className="title">Crush Candy</span>

      <div className="game">
        {currentCandyArrangement.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={`Candy ${candyColor}`}
            data-id={index}
            draggable={true}
            onDragEnter={(event) => event.preventDefault()}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={(event) => event.preventDefault()}
            onDragStart={dragStart}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>

      <ScoreBoard score={score} />
    </div>
  );
}

export default App;
