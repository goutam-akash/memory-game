import { useEffect, useState } from 'react';
import './App.css';

//Shuffle 
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [cardObjects, setCardObjects] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [flipping, setFlipping] = useState(false);

  const startGame = () => {
    const pictures = [
      "https://images.unsplash.com/photo-1626808642875-0aa545482dfb",
      "https://images.unsplash.com/photo-1546842931-886c185b4c8c",
      "https://images.unsplash.com/photo-1520763185298-1b434c919102",
      "https://images.unsplash.com/photo-1442458017215-285b83f65851",
      "https://images.unsplash.com/photo-1496483648148-47c686dc86a8",
      "https://images.unsplash.com/photo-1591181520189-abcb0735c65d",
    ];
    const cardObjects = shuffleArray([...pictures, ...pictures]).map((image, index) => ({
      index,
      image,
      flipped: false,
      solved: false,
    }));
    setCardObjects(cardObjects);
    setSelectedCards([]);
  };

  useEffect(() => {
    startGame();
  }, []);

  const handleCardClick = (clickedCard) => {
    if (clickedCard.flipped || clickedCard.solved || flipping) {
      return;
    }

    if (selectedCards.length === 2) {
      return;
    }

    // Flip the clicked card
    setCardObjects((prevCards) =>
      prevCards.map((card) =>
        card.index === clickedCard.index ? { ...card, flipped: true } : card
      )
    );
    setSelectedCards((prevSelected) => [...prevSelected, clickedCard]);

    if (selectedCards.length === 1) {
      setFlipping(true);
      const [firstCard] = selectedCards;

      if (firstCard.image === clickedCard.image) {
        setCardObjects((prevCards) =>
          prevCards.map((card) =>
            card.image === clickedCard.image ? { ...card, solved: true } : card
          )
        );
        setSelectedCards([]);
        setFlipping(false);
      } else {
        setTimeout(() => {
          setCardObjects((prevCards) =>
            prevCards.map((card) =>
              card.index === firstCard.index || card.index === clickedCard.index
                ? { ...card, flipped: false }
                : card
            )
          );
          setSelectedCards([]);
          setFlipping(false);
        }, 1000);
      }
    }
  };

  const won = cardObjects.every((card) => card.solved);



  return (
    <main>
      {won}
      <h1>{won ? "*You Won*" : "Memory Game"}</h1>
      <div className="card-container">
        {cardObjects.map((card) => (
          <div
            className={`card ${card.flipped ? 'active' : ''}`}
            key={card.index}
            onClick={() => handleCardClick(card)}
            role="button"
            aria-pressed={card.flipped}
            tabIndex={0}
          >
            <div className="card-inner">
              <div className="card-front"></div>
              <div
                className="card-back" style={{ backgroundImage: `url(${card.image})` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="container">
        <button className="new-game-button" onClick={startGame}>New Game</button>
      </div>

    </main>
  );
}

export default App;
