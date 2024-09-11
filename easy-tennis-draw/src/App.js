import React, { useState } from "react";
import "./App.css";

// Fake player names
const playersList = [
  "Jannik Sinner", "Alexander Zverev", "Carlos Alcaraz", "Novak Djokovic", 
  "Daniil Medvedev", "Andrey Rublev", "Taylor Fritz", "Hubert Hurkacz", 
  "Casper Ruud", "Grigor Dimitrov", "Alex De Minaur", "Stefanos Tsitsipas",
  "Tommy Paul", "Holger Rune", "Sebastian Korda", "Frances Tiafoe",
  "Ben Shelton", "Ugo Humbert", "Lorenzo Musetti", "Jack Draper",
  "Felix Auger-Aliassime", "Alejandro Tabilo", "Karen Khachanov", "Alexei Popyrin",
  "Arthur Fils", "Sebastian Baez", "Alexander Bublik", "Nicolas Jarry",
  "Jordan Thompson", "Nuno Borges", "Francisco Cerundolo", "Flavio Cobolli",
  "Matteo Arnaldi", "Tomas Martin Etcheverry", "Tomas Machac", "Mariano Navone",
  "Jiri Lehecka", "Jan-Lennard Struff", "Tallon Griekspoor", "Brandon Nakashima",
  "Luciano Darderi", "Pedro Martinez Portero", "Matteo Berrettini", "Gael Monfils",
  "Marcos Giron", "Adrian Mannarino", "Alex Michelsen", "Zhang Zhizhen",
  "Fabian Marozsan", "Lorenzo Sonego", "Giovanni Mpetshi Perricard", "Cameron Norrie",
  "Miomir Kecmanovic", "Yoshihito Nishioka", "Roberto Carballes Baena", "Roman Safiullin",
  "Alexander Shevchenko", "Arthur Rinderknech", "Sebastian Ofner", "Facundo Diaz Acosta",
  "Pavel Kotov", "Roberto Bautista Agut", "Alejandro Davidovich Fokina", "David Goffin",
  "Dusan Lajovic", "Juncheng Shang", "Jakub Mensik", "Botic Van De Zandschulp",
  "Corentin Moutet", "Alexandre Muller", "James Duckworth", "Zizou Bergs",
  "Aleksandar Kovacevic", "Jaume Munar", "Hugo Gaston", "Thiago Monteiro",
  "Rinky Hijikata", "Thanasi Kokkinakis", "Federico Coria", "Fabio Fognini",
  "Dominik Koepfer", "Sumit Nagal", "Emil Ruusuvuori", "Daniel Altmaier",
  "Marton Fucsovics", "Damir Dzumhur", "Christopher O'Connell", "Arthur Cazaux",
  "Max Purcell", "Luca Nardi", "Francisco Comesana", "Taro Daniel",
  "Camilo Ugo Carabelli", "Aleksandar Vukic", "Adam Walton", "Yannick Hanfmann",
  "Thiago Agustin Tirante", "Thiago Seyboth Wild", "Borna Coric", "Denis Shapovalov",
  "Billy Harris", "Mattia Bellucci", "Gabriel Diallo", "Maximilian Marterer",
  "Duje Ajdukovic", "Hugo Dellien", "Quentin Halys", "Constant Lestienne",
  "Otto Virtanen", "Luca Van Assche", "Zachary Svajda", "Yunchaokete Bu",
  "Jozef Kovalik", "Lloyd Harris", "Cristian Garin", "Aslan Karatsev",
  "Christopher Eubanks", "Mikhail Kukushkin", "Laslo Djere", "Valentin Vacherot",
  "Chun-Hsin Tseng", "Alexander Ritschard", "Roman Andres Burruchaga", "Albert Ramos-Vinolas",
  "Harold Mayot", "Francesco Passaro", "Lukas Klein", "Richard Gasquet"
];

// Match component for each match in the draw
const Match = ({ player1, player2, selectedPlayer, onSelectWinner, round }) => {
  const handleClick = (player) => {
    onSelectWinner(player);
  };

  return (
    <a className={`match-sets match-sets--${round}`} href="#" onClick={() => handleClick(player1)}>
      <div className="match-sets__participants">
        <div
          className={`player match-sets__participant--win player--set ${selectedPlayer === player1 ? 'selected' : ''}`}
          onClick={() => handleClick(player1)}
        >
          <div className="player__name">{player1}</div>
        </div>
        <div
          className={`player separator-top player--set ${selectedPlayer === player2 ? 'selected' : ''}`}
          onClick={() => handleClick(player2)}
        >
          <div className="player__name">{player2}</div>
        </div>
      </div>
    </a>
  );
};

// Draw component for the tennis draw
const TennisDraw = () => {
  const [round1Winners, setRound1Winners] = useState(Array(64).fill(null));
  const [round2Winners, setRound2Winners] = useState(Array(32).fill(null));
  const [round3Winners, setRound3Winners] = useState(Array(16).fill(null));
  const [round4Winners, setRound4Winners] = useState(Array(8).fill(null));
  const [round5Winners, setRound5Winners] = useState(Array(4).fill(null));
  const [round6Winners, setRound6Winners] = useState(Array(2).fill(null));
  const [round7Winner, setRound7Winner] = useState(null);

  const getMatchWinner = (round, index) => {
    switch (round) {
      case 1: return round1Winners[index];
      case 2: return round2Winners[index];
      case 3: return round3Winners[index];
      case 4: return round4Winners[index];
      case 5: return round5Winners[index];
      case 6: return round6Winners[index];
      case 7: return round7Winner;
      default: return null;
    }
  };

  const handleRoundWinner = (winner, matchIndex, round) => {
    switch (round) {
      case 1:
        const newRound1Winners = [...round1Winners];
        newRound1Winners[matchIndex] = winner;
        setRound1Winners(newRound1Winners);
        break;
      case 2:
        const newRound2Winners = [...round2Winners];
        newRound2Winners[matchIndex] = winner;
        setRound2Winners(newRound2Winners);
        break;
      case 3:
        const newRound3Winners = [...round3Winners];
        newRound3Winners[matchIndex] = winner;
        setRound3Winners(newRound3Winners);
        break;
      case 4:
        const newRound4Winners = [...round4Winners];
        newRound4Winners[matchIndex] = winner;
        setRound4Winners(newRound4Winners);
        break;
      case 5:
        const newRound5Winners = [...round5Winners];
        newRound5Winners[matchIndex] = winner;
        setRound5Winners(newRound5Winners);
        break;
      case 6:
        const newRound6Winners = [...round6Winners];
        newRound6Winners[matchIndex] = winner;
        setRound6Winners(newRound6Winners);
        break;
      case 7:
        setRound7Winner(winner);
        break;
      default:
        break;
    }
  };

  const handleRound7Winner = (winner) => {
    setRound7Winner(winner);
  };

  return (
    <div className="bracket-matches-wrapper">
      {/* Round 1 */}
      <div className="bracket-matches bracket-round--1">
        {[...Array(64)].map((_, i) => (
          <Match
            key={i}
            player1={playersList[i * 2]}
            player2={playersList[i * 2 + 1]}
            selectedPlayer={null}
            onSelectWinner={(winner) => handleRoundWinner(winner, Math.floor(i), 1)}
            round={1}
          />
        ))}
      </div>
      
      {/* Round 2 */}
      <div className="bracket-matches bracket-round--2">
        {[...Array(32)].map((_, i) => (
          <Match
            key={i}
            player1={getMatchWinner(1, i * 2)}
            player2={getMatchWinner(1, i * 2 + 1)}
            selectedPlayer={getMatchWinner(2, i)}
            onSelectWinner={(winner) => handleRoundWinner(winner, Math.floor(i), 2)}
            round={2}
          />
        ))}
      </div>

      {/* Round 3 */}
      <div className="bracket-matches bracket-round--3">
        {[...Array(16)].map((_, i) => (
          <Match
            key={i}
            player1={getMatchWinner(2, i * 2)}
            player2={getMatchWinner(2, i * 2 + 1)}
            selectedPlayer={getMatchWinner(3, i)}
            onSelectWinner={(winner) => handleRoundWinner(winner, Math.floor(i), 3)}
            round={3}
          />
        ))}
      </div>

      {/* Round 4 */}
      <div className="bracket-matches bracket-round--4">
        {[...Array(8)].map((_, i) => (
          <Match
            key={i}
            player1={getMatchWinner(3, i * 2)}
            player2={getMatchWinner(3, i * 2 + 1)}
            selectedPlayer={getMatchWinner(4, i)}
            onSelectWinner={(winner) => handleRoundWinner(winner, Math.floor(i), 4)}
            round={4}
          />
        ))}
      </div>

      {/* Round 5 */}
      <div className="bracket-matches bracket-round--5">
        {[...Array(4)].map((_, i) => (
          <Match
            key={i}
            player1={getMatchWinner(4, i * 2)}
            player2={getMatchWinner(4, i * 2 + 1)}
            selectedPlayer={getMatchWinner(5, i)}
            onSelectWinner={(winner) => handleRoundWinner(winner, Math.floor(i), 5)}
            round={5}
          />
        ))}
      </div>

      {/* Round 6 */}
      <div className="bracket-matches bracket-round--6">
        {[...Array(2)].map((_, i) => (
          <Match
            key={i}
            player1={getMatchWinner(5, i * 2)}
            player2={getMatchWinner(5, i * 2 + 1)}
            selectedPlayer={getMatchWinner(6, i)}
            onSelectWinner={(winner) => handleRoundWinner(winner, Math.floor(i), 6)}
            round={6}
          />
        ))}
      </div>

      {/* Round 7 */}
      <div className="bracket-matches bracket-round--7">
        <Match
          player1={getMatchWinner(6, 0)}
          player2={getMatchWinner(6, 1)}
          selectedPlayer={round7Winner}
          onSelectWinner={(winner) => handleRound7Winner(winner)}
          round={7}
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <body className="withsdnav theme-black theme-light">
      <div id="wrapper">
        <section id="content">
          <div className="draw_v8_5">
            <div className="draw-content dragscroll">
              <div className="draw-header">
                <h1 className="draw-header__event-name">Tennis Tournament</h1>
                <div className="draw-header__caption">Complete Bracket</div>
              </div>
              <div className="fullscreen--7" style={{ height: "5782px", overflow: "hidden" }}>
                <div className="bracket-rounds">
                  <span className="bracket-round round--1">Round 1</span>
                  <span className="bracket-round round--2">Round 2</span>
                  <span className="bracket-round round--3">Round 3</span>
                  <span className="bracket-round round--4">Round 4</span>
                  <span className="bracket-round round--5">Round 5</span>
                  <span className="bracket-round round--6">Round 6</span>
                  <span className="bracket-round round--7">Round 7</span>
                </div>
                <TennisDraw />
              </div>
            </div>
          </div>
        </section>
      </div>
    </body>
  );
}

export default App;
