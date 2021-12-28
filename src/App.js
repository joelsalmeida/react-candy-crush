import { useEffect, useState } from 'react';

const width = 8;
const candyColors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow'];

function App() {
  const [currentCandyArrangement, setCurrentCandyArrangement] = useState([]);

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
      for (let index = 0; index < 39; index++) {
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
      for (let index = 0; index < 47; index++) {
        const currentCandy = currentCandyArrangement[index];
        const columnThree = [index, index + width, index + width * 2];

        if (
          columnThree.every((candy) => currentCandyArrangement[candy] === currentCandy)
        ) {
          columnThree.forEach((candy) => (currentCandyArrangement[candy] = ''));
        }
      }
    };

    const timer = setInterval(() => {
      checkForColumnsOfFour();
      checkForColumnsOfThree();
      setCurrentCandyArrangement([...currentCandyArrangement]);
    }, 100);

    return () => clearInterval(timer);
  }, [currentCandyArrangement]);

  return (
    <div className="app">
      <div className="game">
        {currentCandyArrangement.map((candyColor, index) => (
          <img
            key={index}
            style={{ backgroundColor: candyColor }}
            alt={`Candy ${candyColor}`}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
