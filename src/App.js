import { useEffect, useState } from 'react';

const width = 8;
const candyColors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow'];

function App() {
  const [currentCandyArrangement, setCurrentCandyArrangement] = useState();

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

  return <div className="App">Candy Crush</div>;
}

export default App;
