import React, { useState } from 'react';

export default function Trade(props) {
    const [mortgageProperty, setMortgageProperty] = useState();
    const [buySell, setBuySell] = useState();

    const { player, setMessage, setTiles, tiles } = props;

    const askToMortgage = (tile) => {
        return () => {
            setMessage(`Mortgage ${tile.name} for $${tile.price/2}?`);
            setBuySell('sell')
            setMortgageProperty(tile);
        }
    }

    const unmortgaged= (tile) => {
        return () => {
            if (player.cash >= Math.floor(tile.price * 1.1)) {
                setMessage(`Buy back ${tile.name} for $${Math.floor(tile.price * 1.1)}?`);
                setBuySell('buy')
                setMortgageProperty(tile);
            } else {
                setMessage(`${player.name} does not have $${Math.floor(tile.price * 1.1)} to buy back ${tile.name}`)
            }
        }
    }

    const getMortgageMoney = () => {
        if (buySell === 'sell') {
            setMessage(`${mortgageProperty.name} has been mortgaged`);
            player.cash += mortgageProperty.price/2;
            mortgageProperty.mortgaged = true;
        } else {
            setMessage(`${mortgageProperty.name} has been bought back`);
            player.cash -= Math.floor(mortgageProperty.price * 1.1);
            mortgageProperty.mortgaged = false;
        }

        setTiles([...tiles]);
        setMortgageProperty(null);
    }

    const confirmMortgage = () => {
        if (!mortgageProperty) return null;

        return <div className="mortgage-btns">
                    <button onClick={getMortgageMoney}>Yes</button>
                    <button onClick={() => setMortgageProperty(null)}>No</button>
               </div>
    }

    const displayProperties = (player) => {
        return player.properties.filter(tile => tile.buildings === 0).map((tile, i, stack) => {
            let styleObj = {border: '1px solid black'};
            let func = askToMortgage(tile);
            if (tile.mortgaged) {
                styleObj['border'] = '1px red solid';
                func = unmortgaged(tile);
            }
            
            return <div key={i} className="tile" style={ styleObj } onClick={func}>
                <header className="tile-header" style={{ backgroundColor: tile.color }}>{tile.name.split(' ').map(el => el.slice(0, 3)).join(' ')}</header>
            </div>
        })
    }

    const displayMortgage = () => {
        return <div className="mortgage-properties">{displayProperties(player)}</div>
    }

    return <div className="mortgage-container">
                {confirmMortgage()}
                {displayMortgage()}
           </div>
}