import React from "react";
import "./App.css";

// Fake player names
const players = [
  "John Smith", "David Johnson", "Michael Brown", "Chris Davis", 
  "Paul Miller", "James Wilson", "Robert Moore", "Kevin Taylor", 
  "Richard Anderson", "Brian Thomas", "Jason Harris", "Daniel Martin", 
  "Patrick Jackson", "George White", "Edward Lewis", "Andrew Walker"
];

// Match component for each match in the draw
const Match = ({ player1, player2 }) => {
  return (
    <div className="match">
      <div className="player">{player1}</div>
      <div className="player">{player2}</div>
    </div>
  );
};

// Draw component for the tennis draw
const TennisDraw = () => {
  return (
    <div className="draw">
      <div className="round">
        <h3>Round 1</h3>
        {[...Array(8)].map((_, i) => (
          <Match key={i} player1={players[i * 2]} player2={players[i * 2 + 1]} />
        ))}
      </div>
      <div className="round">
        <h3>Quarterfinals</h3>
        {[...Array(4)].map((_, i) => (
          <Match key={i} player1="Winner of Match" player2="Winner of Match" />
        ))}
      </div>
      <div className="round">
        <h3>Semifinals</h3>
        {[...Array(2)].map((_, i) => (
          <Match key={i} player1="Winner of QF" player2="Winner of QF" />
        ))}
      </div>
      <div className="round">
        <h3>Final</h3>
        <Match player1="Winner of SF" player2="Winner of SF" />
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <h1>Tennis Draw (16 Players)</h1>
      <TennisDraw />
    </div>
  );
}

export default App;
