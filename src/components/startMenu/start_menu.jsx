import React, { useState } from 'react';
import Game from '../game/game';
import Player from '../player/player';

export default function StartMenu() {
    const [start, setStart] = useState(false);
    const [name, setName] = useState();
    const [pieces, setPieces] = useState(['horse', 'bicycle', 'dog', 'car', 'ship', 'cat'])
    const [character, setCharacter] = useState();
    const [players, setPlayers] = useState([]);

    const startGame = () => {
        if (!start) return null;
        return <Game
                    players={players}
                    setPlayers={setPlayers}
               />
    }

    const displayPieces = () => {
        let pieceArr = [];
            pieces.forEach((piece, i) => {
                let color = {color: 'grey'}
                if (piece === character) color = {color: 'white'};
                pieceArr.push(
                    <i key={i} style={color} className={`fas fa-${piece}`} onClick={() => setCharacter(piece)}></i>
                )
            })
        return <div className="piece-container">
                {pieceArr}
               </div>
    }

    const createPlayer = (e) => {
        e.preventDefault();
        console.log(character)
        players.push(new Player(name, character[0].toUpperCase()+character.slice(1)));
        let pieceArr = [...pieces];
        pieceArr.splice(pieces.indexOf(character), 1);
        setPieces(pieceArr);
        setName('');
    }

    const displayPlayers = () => {
        if (players.length === 0) return null;

        return players.map((player, i) => (
            <div className="piece-container" key={i}>
                {player.name}
                <i className={`fas fa-${player.piece.toLowerCase()}`}></i>
            </div>
        ))
    }

    const menu = () => {
        if (start) return null;
        let style = {}

        return <div className="start-menu">
                    <form className="create-form" onSubmit={createPlayer}>
                        <label>Player Name:</label>
                        <input type="text" name={name} onChange={(e) => setName(e.currentTarget.value)}/>
                        <label>Choose A Piece:</label>
                        {displayPieces()}
                        <input type="submit" disabled={!name || !character} value="Add Player"/>
                    </form>
                    {displayPlayers()}
                    <button style={style} disabled={players.length <= 1} onClick={() => { setStart(true) }}>Start Game</button>
               </div>
    }

    return <div>
                {menu()}
                {startGame()}
           </div>
}