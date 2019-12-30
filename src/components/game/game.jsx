import React, { useState, useEffect } from 'react';
import Board from '../board/board';
import Player from '../player/player';

export default function Game(props) {
    const [activePlayer, setActivePlayer] = useState(0);
    const [players, setPlayers] = useState([]);
    useEffect(() => {
        // setPlayers([new Player('Chris', 'Bike'), new Player('Robert', 'Cat'), new Player('Garrett', 'Ship'), new Player('Gregory', 'Dog')]);
        setPlayers([new Player('Chris', 'Bike'), new Player('Robert', 'Cat')]);
    }, [])
    return players.length <= 0 ? null : (
        <div>
            <Board 
                activePlayer={activePlayer}
                setActivePlayer={setActivePlayer}
                players={players}
            />
        </div>
    )
}