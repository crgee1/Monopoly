import React, { useState, useEffect } from 'react';
import Property from '../tiles/property';
import Chance from '../tiles/chance';
import Tax from '../tiles/tax';
import GoToJail from '../tiles/go_to_jail';
import Hand from '../hand/hand';
import Trade from './trade';
import Mortgage from './mortgage';

export default function Interface(props) {
    const [message, setMessage] = useState(null);
    const [message2, setMessage2] = useState(null);
    const [action, setAction] = useState(null);
    const [moved, setMoved] = useState(false);
    const [tile, setTile] = useState();

    const { player, nextPlayer, roll, setRoll, tiles, setTiles, players, setPlayers, moveToJail, displayPiece, setActivePlayer, setModal } = props;
    
    useEffect(() => {
        if (player.turnsJailed > 0) {
            const turns =  (player.turnsJailed > 1) ? 'turns' : 'turn';
            if (player.jailed) setMessage(`${player.name} has been in jail for ${player.turnsJailed} ${turns}`)
        }
    
        if (roll[0] === roll[1] && player.turnsJailed < 1 && roll[0] && !player.jailed) setMessage2(`${player.name} rolled a double, they get to go again!`) 
    }, [setMessage, player, roll])

    const move = (die1 = null, die2 = null) => {
        return () => {
            const { tile } = props.move(die1, die2);
            const tileName = tile.name;
            const { cash, name } = player;
            setMoved(true);
            
            if (player.doubles >= 3) {
                player.doubles = 0;
                setMessage(`${name} has been sent to jail for speeding!`)
                moveToJail();
            } else {
                setTile(tile);

                if (tile instanceof Property) {
                    if (!tile.owner) {
                        if (tile.price <= cash) {
                            setMessage(`Does ${name} want to buy ${tileName} for $${tile.price}?`)
                            setAction('purchase');
                        } else {
                            setMessage(`${name} doesn't have enough to buy ${tileName}`)
                        }
                    } else {
                        if (tile.mortgaged) {
                            setMessage(`${name} landed on the mortgaged property, ${tileName}`)
                        } else {
                            if (tile.owner.name !== name ) {
                                tile.landed(player);
                                setMessage(`${name} paid ${tile.owner.name} $${tile.rentAmount()} in rent on ${tileName}`)
                            } else {
                                setMessage(`${name} landed on their own property, ${tileName}`)
                            }
                        }
                    }
                } else if (tile instanceof Chance || tile instanceof Tax) {
                    tile.landed(player);
                    setMessage(`${tileName}! ${name} ${tileName === 'Chance' ? 'gets' : 'loses'} $200`)
                } else if (tile instanceof GoToJail) {
                    setMessage2(`${name} landed on Go to Jail`);
                    setMessage(`${name} went to Jail!`);
                    moveToJail();
                } else {
                    setMessage(`${name} landed on ${tileName}`)
                }
            }
            
            if (player.cash < 0) {
                setMessage2(`${player.name} ran out of money. Declare bankruptcy or sell property?`)
                setAction('bankrupt');
            }
        }
    }
    
    const endTurn = () => {
        if (roll[0] !== roll[1] || player.jailed || player.turnsJailed > 0) {
            nextPlayer();
        } 
        if (player.turnsJailed > 0 && !player.jailed) player.turnsJailed = 0;
        if (player.jailed) player.turnsJailed ++;
        setMoved(false);
        setMessage(null);
        setMessage2(null);
        setRoll([]);
        setAction(null);
    }

    const payFine = () => {
        if (player.cash >= 50) {
            player.cash -= 50;
            player.getOutOfJail();
            setMessage(`${player.name} is out of jail`);
        } else {
            setMessage(`${player.name} doesn't have enough to pay the jail fine`);

        }
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
        const mortgageBtn = <button onClick={() => {
                                setAction('mortgage')
                                setMessage('What would you like to mortgage?');
                            }}>Mortgage</button>;
        const tradeBtn = <button onClick={() => {
                            setAction('trade');
                            setMessage(`Who do you want to trade with?`)
                         }}>Trade</button>                   
        
        if (player.jailed) {
            if (player.turnsJailed === 0 || moved) {
                toolbar = <div>
                            {mortgageBtn}
                            {tradeBtn}
                            <button onClick={endTurn}>End Turn</button>
                         </div>
            } else {
                toolbar = <div>
                            {mortgageBtn}
                            {tradeBtn}
                            <button onClick={payFine}>Pay $50 fine</button>
                            <button onClick={rollForJail}>Roll</button>
                         </div>
            }
        } else {
            if (moved) {
                toolbar = <div>
                            {mortgageBtn}
                            {tradeBtn}
                            {tile instanceof Property && !tile.owner? <button onClick={() => {
                                if (!tile.owner && tile instanceof Property) {
                                    if (tile.price <= player.cash) {
                                        setMessage(`Does ${player.name} want to buy ${tile.name} for $${tile.price}?`)
                                        setAction('purchase');
                                    } else {
                                        setMessage(`${player.name} doesn't have enough to buy ${tile.name}`)
                                    }
                                }
                                }}>Buy Property</button> : null}
                            {player.cash >= 0 ? <button onClick={endTurn}>End Turn</button> : <button onClick={() => setAction('bankrupt')}>Bankruptcy</button>}
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

    const declareBankruptcy = () => {
        let tilesArr = [...tiles];

        if (tile.owner) {
            tile.owner.cash += player.cash;
        }

        player.properties.forEach(property => {
            property.reset();
            tilesArr[property.index].tile = property;
        })
        
        if (players.indexOf(player) === players.length -1) setActivePlayer(0);
        players.splice(players.indexOf(player), 1);
        delete tilesArr[player.position].players[player.name];

        if (players.length === 1) setModal('end');

        setPlayers(players);
        setMoved(false);
        setMessage(null);
        setMessage2(null);
        setRoll([]);
        setAction(null);
        setTiles(tilesArr);
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
                                    setMessage2(null);
                                    }}>No</button>
                            </div>
                break;
            case 'trade':
                component = <Trade 
                                players={players}
                                player={player}
                                setAction={setAction}
                                tiles={tiles}
                                setTiles={setTiles}
                                displayPiece={displayPiece}
                            />
                break;
            case 'mortgage':
                component = <Mortgage 
                                player={player}
                                setAction={setAction}
                                setMessage={setMessage}
                                setTiles={setTiles}
                                tiles={tiles}
                            />
                break;
            case 'bankrupt':
                component = <button onClick={declareBankruptcy}>Declare Bankruptcy</button>
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
                <div>{displayPiece(player)}</div>
            </div>
            {displayToolbar()}
            {displayRoll()}
            <div className="message">
                <div>{message2}</div>
                <div>{message}</div>
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