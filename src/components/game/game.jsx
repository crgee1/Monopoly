import React, { useState, useEffect } from 'react';
import Board from '../board/board';

export default function Game(props) {
    const [activePlayer, setActivePlayer] = useState(0);
    
    const { players, setPlayers } = props;

    useEffect(() => {
        window.onbeforeunload = function () {
            return 'You really want to go ahead?';
        }
    }, []);

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