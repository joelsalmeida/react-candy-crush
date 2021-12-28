import { useEffect, useState } from 'react';

const width = 8;
const candyColors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow'];

function App() {
  const [currentCandyArrangement, setCurrentCandyArrangement] = useState([]);

  const [candyDragged, setCandyDragged] = useState(null);
  const [candyDropped, setCandyDropped] = useState(null);

  const createBoard = () => {
    const randomCandyArrangement = [];

    for (let index = 0; index < width * width; index++) {
      const randomCandyColorsIndex = Math.floor(Math.random() * candyColors.length);
      const randomCandy = candyColors[randomCandyColorsIndex];

      randomCandyArrangement.push(randomCandy);
    }

    setCurrentCandyArrangement(randomCandyArrangement);
  };

  useEffect(() => createBoard(), []);

  useEffect(() => {
    const checkForColumnsOfFour = () => {
      for (let index = 0; index <= 39; index++) {
        const currentCandy = currentCandyArrangement[index];
        const columnFour = [index, index + width, index + width * 2, index + width * 3];

        if (
          columnFour.every((candy) => currentCandyArrangement[candy] === currentCandy)
        ) {
          columnFour.forEach((candy) => (currentCandyArrangement[candy] = ''));
        }
      }
    };

    const checkForColumnsOfThree = () => {
      for (let index = 0; index <= 47; index++) {
        const currentCandy = currentCandyArrangement[index];
        const columnThree = [index, index + width, index + width * 2];

        if (
          columnThree.every((candy) => currentCandyArrangement[candy] === currentCandy)
        ) {
          columnThree.forEach((candy) => (currentCandyArrangement[candy] = ''));
        }
      }
    };

    const checkForRowsOfFour = () => {
      for (let index = 0; index < 64; index++) {
        const currentCandy = currentCandyArrangement[index];
        const rowFour = [index, index + 1, index + 2, index + 3];
        const toIgnore = [
          5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55,
          62, 63, 64,
        ];

        if (toIgnore.includes(index)) continue;

        if (rowFour.every((candy) => currentCandyArrangement[candy] === currentCandy)) {
          rowFour.forEach((candy) => (currentCandyArrangement[candy] = ''));
        }
      }
    };

    const checkForRowsOfThree = () => {
      for (let index = 0; index < 64; index++) {
        const currentCandy = currentCandyArrangement[index];
        const rowThree = [index, index + 1, index + 2];
        const toIgnore = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64];

        if (toIgnore.includes(index)) continue;

        if (rowThree.every((candy) => currentCandyArrangement[candy] === currentCandy)) {
          rowThree.forEach((candy) => (currentCandyArrangement[candy] = ''));
        }
      }
    };

    const addGravity = () => {
      for (let i = 0; i <= 55; i++) {
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);

        if (isFirstRow && currentCandyArrangement[i] === '') {
          let randomNumber = Math.floor(Math.random() * candyColors.length);
          currentCandyArrangement[i] = candyColors[randomNumber];
        }

        if (currentCandyArrangement[i + width] === '') {
          currentCandyArrangement[i + width] = currentCandyArrangement[i];
          currentCandyArrangement[i] = '';
        }
      }
    };

    const timer = setInterval(() => {
      checkForColumnsOfFour();
      checkForColumnsOfThree();

      checkForRowsOfFour();
      checkForRowsOfThree();

      addGravity();

      setCurrentCandyArrangement([...currentCandyArrangement]);
    }, 100);

    return () => clearInterval(timer);
  }, [currentCandyArrangement]);

  const dragStart = ({ target }) => {
    setCandyDragged(target);
  };

  const dragDrop = ({ target }) => {
    setCandyDropped(target);
  };

  const dragEnd = ({ target }) => {
    const candyDraggedId = parseInt(candyDragged.getAttribute('data-id'));
    const candyDroppedId = parseInt(candyDropped.getAttribute('data-id'));

    currentCandyArrangement[candyDroppedId] = candyDragged.style.backgroundColor;
    currentCandyArrangement[candyDraggedId] = candyDropped.style.backgroundColor;
  };

  return (
    <div className="app">
      <div className="game">
        {currentCandyArrangement.map((candyColor, index) => (
          <img
            key={index}
            style={{ backgroundColor: candyColor }}
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
    </div>
  );
}

export default App;
