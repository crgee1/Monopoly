import React, { useState } from 'react';
import Board from '../board/board';

export default function Game(props) {
    const [activePlayer, setActivePlayer] = useState(0);

    const { players, setPlayers } = props;
    if (players.length === 1) alert(`${players[activePlayer].name} won monopoly!`)
    return players.length <= 0 ? null : (
        <div>
            <Board 
                activePlayer={activePlayer}
                setPlayers={setPlayers}
                setActivePlayer={setActivePlayer}
                players={players}
            />
        </div>
    )
}