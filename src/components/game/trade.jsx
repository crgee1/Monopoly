import React, { useState, useEffect } from 'react';

export default function Trade(props) {
    const [tradePartner, setTradePartner] = useState();
    const [trade1, setTrade1] = useState([]);
    const [trade2, setTrade2] = useState([]);
    const [tradeCash1, setTradeCash1] = useState(0);
    const [tradeCash2, setTradeCash2] = useState(0);
    
    const { players, player, setAction, tiles, setTiles } = props;

    useEffect(() => {
        setTrade2([]);
        setTrade1([]);
        setTradeCash1(0);
        setTradeCash2(0);
    }, [tradePartner])

    const displayTradepartners = () => {
        let result = [];
        let name = player.name;
        
        players.forEach((player, i) => {
            if (name !== player.name) {
                result.push(
                    <button key={i} onClick={() => setTradePartner(player)}>{player.name}</button>
                )
            }
        })

        return <div>{result}</div>;
    }

    const addToTrade = (tile, player) => {
        return () => {
            if (player.name === tradePartner.name) {
                if (trade2.includes(tile)) {
                    let temp = [...trade2];
                    temp.splice(trade2.indexOf(tile), 1);
                    setTrade2(temp);
                } else {
                    setTrade2([...trade2, tile]);
                }
            } else {
                if (trade1.includes(tile)) {
                    let temp = [...trade1];
                    temp.splice(trade1.indexOf(tile), 1);
                    setTrade1(temp);
                } else {
                    setTrade1([...trade1, tile]);
                }
            }
        }
    }

    const acceptTrade = () => {
        let tilesArr = [...tiles];

        player.cash -= tradeCash1;
        player.cash += Number(tradeCash2);
        tradePartner.cash -= tradeCash2;
        tradePartner.cash += Number(tradeCash1);

        trade1.forEach(property => {
            player.loseProperty(property);
            tradePartner.gainProperty(property);
            tilesArr[property.index] = { ...tilesArr[property.index], property };
        })
        trade2.forEach(property => {
            tradePartner.loseProperty(property);
            player.gainProperty(property);
            tilesArr[property.index] = { ...tilesArr[property.index], property };
        })

        setTiles(tilesArr);
        setAction(null);
    }

    const displayProperties = (player) => {
        return player.properties.filter(tile => tile.buildings === 0).map((tile, i) => {
            let border = '1px solid black';
            if (player.name === tradePartner.name) {
                if (trade2.includes(tile)) border = '1px red solid';
            } else {
                if (trade1.includes(tile)) border = '1px red solid';
            }
            return <div key={i} className="tile" style={{ border }} onClick={addToTrade(tile, player)}>
                        <header className="tile-header" style={{ backgroundColor: tile.color }}>{tile.name.split(' ').map(el => el.slice(0,3)).join(' ')}</header>
                   </div>
        })
    }

    const displayTrade = () => {
        if (!tradePartner) return null;

        return <div className="trade-panel">
                    <div className="trade-assets">
                        {`${player.name} $${player.cash}`}
                        <div className="trade-properties">{displayProperties(player)}</div>
                        <div className="trade-cash">${tradeCash1}<input type="range" value={tradeCash1} min="0" max={player.cash} onChange={(e) => setTradeCash1(e.target.value)}/></div>
                    </div>
                    <div className="trade-assets">
                        {`${tradePartner.name} $${tradePartner.cash}`}
                        <div className="trade-properties">{displayProperties(tradePartner)}</div>
                        <div className="trade-cash">${tradeCash2}<input type="range" value={tradeCash2} min="0" max={tradePartner.cash} onChange={(e) => setTradeCash2(e.target.value)}/></div>
                    </div>
               </div>
    }
    
    return <div className="trade-container">
                {displayTradepartners()}
                {displayTrade()}
                {tradePartner ? <button onClick={acceptTrade}>Trade</button> : null}
           </div>
}