const Arrow = ({ direction, onClick }) => (
    <span className={`arrow arrow--${direction}`} onClick={onClick}>
      {direction === 'right' ? '➡' : '⬅'}
    </span>
  );
  

const Match = ({ player1, player2, selectedPlayer, onSelectWinner, onCancel, round, showCancel }) => {
    const handleClick = (player) => {
        onSelectWinner(player);
    };

    return (
        <div className={`match-sets match-sets--${round}`}>
            <div className="match-sets__participants">
                <div
                    className={`player match-sets__participant--win player--set ${selectedPlayer === player1 ? 'selected' : ''}`}
                    onClick={() => handleClick(player1)}
                >
                    <div className="player__name">{player1}</div>
                    {round > 1 && showCancel && (
                        <Arrow direction="left" onClick={() => onCancel(player1)} />
                    )}
                    {round < 7 && (
                        <Arrow direction="right" onClick={() => handleClick(player1)} />
                    )}
                </div>
                <div
                    className={`player separator-top player--set ${selectedPlayer === player2 ? 'selected' : ''}`}
                    onClick={() => handleClick(player2)}
                >
                    <div className="player__name">{player2}</div>
                    {round > 1 && showCancel && (
                        <Arrow direction="left" onClick={() => onCancel(player2)} />
                    )}
                    {round < 7 && (
                        <Arrow direction="right" onClick={() => handleClick(player2)} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Match;