import React from 'react';

export default function End(props) {
    const { player } = props;

    return <div className="end">
                {player.name} has won the game!
           </div>
}