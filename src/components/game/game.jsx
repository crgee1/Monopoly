import React, { useState } from 'react';
import Board from '../board/board';
import Modal from '../modal/modal';

export default function Game(props) {
    const [activePlayer, setActivePlayer] = useState(0);
    const [modal, setModal] = useState(null);

    const { players, setPlayers } = props;
    if (players.length === 1) alert(`${players[activePlayer].name} won monopoly!`)
    return players.length <= 0 ? null : (
        <div>
            <Board 
                activePlayer={activePlayer}
                setPlayers={setPlayers}
                setActivePlayer={setActivePlayer}
                players={players}
                setModal={setModal}
            />
            <Modal
                modal={modal}
            />
        </div>
    )
}