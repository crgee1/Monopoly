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
        let playerArr = Object.values(playerObj).sort((a,b) => {
            const totals = (player) => {
                const houseTotal = player.properties.reduce((acc, property) => {
                    return acc += property.buildingPrice * property.buildings;
                }, 0);

                const propertyTotal = player.properties.reduce((acc, property) => {
                    return acc += property.price;
                }, 0);

                return propertyTotal + houseTotal;
            }
            return totals(a) > totals(b) ? 1 : -1;
        }).map((player, i) => {
            const housesCount = player.properties.reduce((acc, property) => {
                return acc += property.buildings;
            }, 0);

            const houseTotal = player.properties.reduce((acc, property) => {
                return acc += property.buildingPrice * property.buildings;
            }, 0);

            const propertyTotal = player.properties.reduce((acc, property) => {
                return acc += property.price;
            }, 0);

            return <tr key={i}>
                <td >{player.name}</td>
                <td>${player.cash}</td>
                <td className="table-cell">{player.properties.length}</td>
                <td className="table-cell">{housesCount}</td>
                <td>${player.cash + houseTotal + propertyTotal}</td>
            </tr>
        });
        return playerArr;
    }

    return <div className="leaderboard">
                {/* <div>Leaderboard</div> */}
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