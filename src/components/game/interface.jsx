import React, { useState } from 'react';
import Property from '../tiles/property';
import Chance from '../tiles/chance';
import Tax from '../tiles/tax';
import GoToJail from '../tiles/go_to_jail';
import Hand from '../hand/hand';
import Trade from './trade';
import Mortgage from './mortgage';

export default function Interface(props) {
    const [message, setMessage] = useState(null);
    const [action, setAction] = useState(null);
    const [moved, setMoved] = useState(false);
    const [tile, setTile] = useState();

    const { player, nextPlayer, roll, setRoll, tiles, setTiles, players, moveToJail } = props;

    const move = (die1 = null, die2=null) => {
        return () => {
            const { tile } = props.move(die1, die2);
            const tileName = tile.name;
            const { cash, name } = player;
            setMoved(true);
            setTile(tile);
            
            if (tile instanceof Property) {
                if (!tile.owner) {
                    if (tile.price <= cash) {
                        setMessage(`Does ${name} want to buy ${tileName}?`)
                        setAction('purchase');
                    } else {
                        setMessage(`${name} doesn't have enough to buy ${tileName}`)
                    }
                } else {
                    if (tile.mortgaged) {
                        setMessage(`${name} landed on the mortgaged property ${tileName}`)
                    } else {
                        if (tile.owner.name !== name ) {
                            tile.landed(player);
                            setMessage(`${name} paid ${tile.owner.name} $${tile.rent} in rent on ${tileName}`)
                        } else {
                            setMessage(`${name} landed on their own property, ${tileName}`)
                        }
                    }
                }
            } else if (tile instanceof Chance || tile instanceof Tax) {
                tile.landed(player);
                setMessage(`${tileName}! ${name} ${tileName === 'Chance' ? 'gets' : 'loses'} $200`)
            } else if (tile instanceof GoToJail) {
                setMessage(`${name} Goes To Jail!`);
                setAction('jail');
                moveToJail();
            } else {
                setMessage(`${name} landed on ${tileName}`)
            }

            if (player.cash < 0) {
                setMessage(`${player.name} ran out of money. Declare bankruptcy or sell property`)
                setAction('bankrupt');
            }
        }
    }
    
    const endTurn = () => {
        const [die1, die2] = roll;
        if (die1 !== die2 || player.jailed || player.turnsJailed > 0) {
            nextPlayer();
        } 
        if (player.turnsJailed > 0 && !player.jailed) player.turnsJailed = 0;
        if (player.jailed) player.turnsJailed ++;
        setMoved(false);
        setMessage(null);
        setRoll([]);
        setAction(null);
    }

    const payFine = () => {
        player.cash -= 50;
        player.getOutOfJail();
        setMessage(`${player.name} is out of jail`)
    }
    
    const rollForJail = () => {
        let [die1, die2] = player.rollDice();
        if (die1 === die2) {
            player.getOutOfJail();
            move(die1, die2)();
        } else {
            if (player.turnsJailed < 3) {
                setMessage('Not a double');
                setRoll([die1, die2]);
                setMoved(true);
            } else {
                player.cash -= 50;
                player.getOutOfJail();
                move(die1, die2)();
            }
        }
    }

    const displayToolbar = () => {
        let toolbar;

        if (player.jailed) {
            if (player.turnsJailed === 0 || moved) {
                toolbar = <div>
                            <button onClick={endTurn}>End Turn</button>
                         </div>
            } else {
                toolbar = <div>
                            <button onClick={payFine}>Pay $50</button>
                            <button onClick={rollForJail}>Roll</button>
                         </div>
            }
        } else {
            if (moved) {
                toolbar = <div>
                            <button onClick={() => setAction('mortgage')}>Mortgage</button>
                            <button onClick={() => setAction('trade')}>Trade</button>
                            <button onClick={endTurn}>End Turn</button> 
                          </div>
            } else {
                toolbar = <div>
                            <button onClick={move()}>Move</button>
                          </div> 
            }
        }

        return <div className="toolbar">
                    {toolbar}
               </div>
    }

    const purchase = () => {
        let tilesArr = [...tiles]
        player.gainProperty(tile)
        tilesArr[tile.index] = { ...tilesArr[tile.index], tile};
        player.cash -= tile.price;
        setTiles(tilesArr);
        setMessage(`${player.name} now owns ${tile.name}`)
        setAction(null);
    }

    const displayAction = () => {
        if (!action) return null;
        let component;

        switch (action) {
            case 'purchase':
                component = <div>
                                <button onClick={purchase}>Yes</button>
                                <button onClick={() => {
                                    setAction(null);
                                    setMessage(null);
                                    }}>No</button>
                            </div>
                break;
            case 'jail':
                component = <div>
                                <button onClick={() => setAction(null)}>OK</button>
                            </div>
                break;
            case 'trade':
                component = <Trade 
                                players={players}
                                player={player}
                                setAction={setAction}
                                tiles={tiles}
                                setTiles={setTiles}
                            />
                break;
            case 'mortgage':
                component = <Mortgage 
                                player={player}
                                setAction={setAction}
                                setMessage={setMessage}
                            />
                break;
            case 'bankrupt':
                component = <button>Declare Bankruptcy</button>
                break;
            default:
                break;
        }
        return component
    }

    const setDie = (die) => {
        switch (die) {
            case 1:
                return <i className="fas fa-dice-one die"></i>;
            case 2:
                return <i className="fas fa-dice-two die"></i>
            case 3:
                return <i className="fas fa-dice-three die"></i>
            case 4:
                return <i className="fas fa-dice-four die"></i>
            case 5:
                return <i className="fas fa-dice-five die"></i>
            case 6:
                return <i className="fas fa-dice-six die"></i>
            default:
                break;
        }
    }

    const displayRoll = () => {
        if (roll.length !== 2) return null;

        let [die1, die2] = roll;
        die1 = setDie(die1);
        die2 = setDie(die2);

        return <div className="dice">{die1}{die2}</div>
    }

    return (
        <div className="interface">
            <div className="player-info">
                <div>{player.name}</div>
                <div>${player.cash}</div>
            </div>
            {displayToolbar()}
            {displayRoll()}
            <div className="message">
                {message}
            </div>
            {displayAction()}
            <Hand
                player={player}
                properties={player.properties}
                setMessage={setMessage}
                tiles={tiles}
                setTiles={setTiles}
            />
        </div>
    )
}