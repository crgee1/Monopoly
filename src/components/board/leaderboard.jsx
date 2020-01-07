import React, { useState, useEffect } from 'react';

export default function Leaderboard(props) {
    const [playerObj, setPlayerObj] = useState({});

    const { players } = props;

    useEffect(() => {
        let obj = {...playerObj};
        players.forEach(player => obj[player.name] = player);
        setPlayerObj(obj);
    }, [setPlayerObj])

    const displayRows = () => {
        let playerArr = Object.values(playerObj).sort((a, b) => 
            a.netWorth() > b.netWorth() ? -1 : 1
        ).map((player, i) => {
            const housesCount = player.properties.reduce((acc, property) => {
                return acc += property.buildings;
            }, 0);

            return <tr key={i}>
                <td >{player.name}</td>
                <td>${player.cash}</td>
                <td className="table-cell">{player.properties.length}</td>
                <td className="table-cell">{housesCount}</td>
                <td>${player.netWorth()}</td>
            </tr>
        });
        return playerArr;
    }

    return <div className="leaderboard">
                <table>
                    <thead>
                        <tr>
                            <th className="table-header-name">Name</th>
                            <th>Cash</th>
                            <th>Properties</th>
                            <th>Houses</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayRows()}
                    </tbody>
                </table>
           </div>
}