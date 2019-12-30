import React from 'react';

export default function Hand(props) {
    const { properties } = props;

    let propObj = {};
    properties.forEach((tile, i) => {
        if (propObj[tile.color]) {
            propObj[tile.color].push(tile);
        } else {
            propObj[tile.color] = [tile];
        }
    });

    for (let color in propObj) {
        let tileArr = propObj[color];
        if (color === 'Blue' || color === 'Brown') {
            if (tileArr[0].monopoly === false && tileArr.length === 2) {
                tileArr.forEach(tile => tile.getMonopoly())
            }
            if (tileArr[0].monopoly === true && tileArr.length !== 2) {
                tileArr.forEach(tile => tile.loseMonopoly())
            }
        } else {
            if (tileArr[0].monopoly === false && tileArr.length === 3) {
                tileArr.forEach(tile => tile.getMonopoly());
            }
            if (tileArr[0].monopoly === true && tileArr.length !== 3) {
                tileArr.forEach(tile => tile.loseMonopoly())
            }
        }
    }

    let propObjValues = Object.values(propObj);

    let stackStyle = propObjValues.length < 8 ? {margin: '5px'} : null;

    const hand = propObjValues.map((stack, idx) => {
        
        const stackArr = stack.map((tile, i) => {
            return <div key={i} className="tile">
                        <header className="tile-header" style={{ backgroundColor: tile.color }}>{tile.name}</header>
                        <div className="tile-info">
                            <div>Value:${tile.price}</div>
                            <div>Rent: ${tile.rent}</div>
                            </div>
                        <div className="tile-players"></div>
                   </div>
        })
        return (
            <div key={idx} style={stackStyle} className="hand-stack">
                {stackArr}
            </div>
        )
        
    })

    return (
        <div className="hand-container">
            <div style={{textAlign: "center"}}>
                Properties Owned:
            </div>
            <div className="hand">
                {hand}
                {/* <i className="fas fa-home"></i> */}
            </div>
        </div>
    )
}