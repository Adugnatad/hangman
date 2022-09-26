import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Figure from "./components/Figure";
import Header from "./components/Header";
import Word from "./components/Word";
import WrongLetters from "./components/WrongLetters";
import Popup from "./components/Popup";
import Notification from "./components/Notifications";
import { showNotification as show } from "./helpers/helpers";

function App() {
  const [playable, setPlayable] = useState(true);
  const [correctLetters, setCorrectLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");

  useEffect(() => {
    const handleKeydown = (event) => {
      const { key, keyCode } = event;
      if (playable && keyCode >= 65 && keyCode <= 90) {
        const letter = key.toLowerCase();

        if (selectedWord.includes(letter)) {
          if (!correctLetters.includes(letter)) {
            setCorrectLetters((currentLetters) => [...currentLetters, letter]);
          } else {
            show(setShowNotification);
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            setWrongLetters((wrongLetters) => [...wrongLetters, letter]);
          } else {
            show(setShowNotification);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [correctLetters, wrongLetters, playable, selectedWord]);

  useEffect(() => {
    getWord();
  }, []);

  const playAgain = () => {
    setSelectedWord("");
    setPlayable(true);
    setCorrectLetters([]);
    setWrongLetters([]);
    getWord();
  };

  const getWord = () => {
    axios
      .get("https://random-word-api.herokuapp.com/word")
      .then((res) => setSelectedWord(res.data[0]));
  };

  return (
    <>
      {selectedWord !== "" ? (
        <>
          <Header />
          <div className="game-container">
            <Figure wrongLetters={wrongLetters} />
            <WrongLetters wrongLetters={wrongLetters} />
            <Word selectedWord={selectedWord} correctLetters={correctLetters} />
          </div>
          <Popup
            correctLetters={correctLetters}
            wrongLetters={wrongLetters}
            selectedWord={selectedWord}
            setPlayable={setPlayable}
            playAgain={playAgain}
          />
          <Notification showNotification={showNotification} />
        </>
      ) : (
        <div></div>
      )}
    </>
  );
}

export default App;
