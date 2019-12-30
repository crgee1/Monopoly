import React from 'react';

export default function Hand(props) {
    const { properties, setMessage } = props;

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

    const buildHome = (property) => {
        return () => {
            property.build();
            setMessage(`A house was built on ${property.name}`)
        }
    }

    const displayBuildings = (tile, max, even) => {
        let buildingArr = [];
        if (tile.monopoly) {
            for (let i = 0; i < tile.buildings; i++) {
                buildingArr.push(<i key={i} className="fas fa-home"></i>)
            }
            if (tile.buildings < 4){
                if (tile.buildings !== max || even) buildingArr.push(<i key={4} className="fas fa-home buy" onClick={buildHome(tile)}></i>)
            }
            return <div className="tile-buildings">{buildingArr}</div>
        }
    }

    let propObjValues = Object.values(propObj);

    let stackStyle = propObjValues.length < 8 ? {margin: '5px'} : null;

    const hand = propObjValues.map((stack, idx) => {
        const max = Math.max(...stack.map(property => property.buildings));
        const even = stack.every(property => property.buildings === stack[0].buildings)
        const stackArr = stack.map((tile, i) => {
            

            return <div key={i} className="tile">
                        <header className="tile-header" style={{ backgroundColor: tile.color }}>{tile.name}</header>
                        <div className="tile-info">
                            <div>Price:${tile.price}</div>
                            <div>Rent: ${tile.rent}</div>
                            <div>House Cost: ${tile.buildingPrice}</div>
                        </div>
                        {displayBuildings(tile, max, even)}
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
            </div>
        </div>
    )
}