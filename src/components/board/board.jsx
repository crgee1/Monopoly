import React, { useState, useEffect } from 'react';
import Go from '../tiles/go';
import Property from '../tiles/property';
import Jail from '../tiles/jail';
import FreeParking from '../tiles/free_parking';
import Tax from '../tiles/tax';
import Chance from '../tiles/chance';
import GoToJail from '../tiles/go_to_jail';
import Interface from '../game/interface';
import Leaderboard from './leaderboard';
import Modal from '../modal/modal';

export default function Board(props) {
  const [tiles, setTiles] = useState([]);
  const [roll, setRoll] = useState([]);
  const [displayTile, setDisplayTile] = useState(null);
  const [pos, setPos] = useState()
  const [modal, setModal] = useState(null);
  
  const { activePlayer, setActivePlayer, players, setPlayers } = props;

  useEffect(() => {
    const setup = function() {
      let set = [
        ['Go'],
        ['Mediterranean Avenue', 'Brown', 60, 3],
        ['Chance'],
        ['Baltic Avenue', 'Brown', 60, 4],
        ['Income Tax'],
        ['Oriental Avenue', 'LightBlue', 100, 6],
        ['Chance'],
        ['Vermont Avenue', 'LightBlue', 100, 6],
        ['Connecticut Avenue', 'LightBlue', 120, 8],
        ['Jail'],
        ['St. Charles Place', 'Pink', 140, 10],
        ['Income Tax'],
        ['States Avenue', 'Pink', 140, 10],
        ['Virginia Avenue', 'Pink', 160, 12],
        ['St. James Place', 'Orange', 180, 14],
        ['Chance'],
        ['Tennessee Avenue', 'Orange', 180, 14],
        ['New York Avenue', 'Orange', 200, 16],
        ['Free Parking'],
        ['Kentucky Avenue', 'Red', 220, 18],
        ['Chance'],
        ['Indiana Avenue', 'Red', 220, 18],
        ['Illinois Avenue', 'Red', 240, 20],
        ['Atlantic Avenue', 'Yellow', 260, 22],
        ['Ventnor Avenue', 'Yellow', 260, 22],
        ['Income Tax'],
        ['Marvin Gardens', 'Yellow', 280, 24],
        ['Go To Jail'],
        ['Pacific Avenue', 'Green', 300, 26],
        ['North Carolina Avenue', 'Green', 300, 26],
        ['Chance'],
        ['Pennsylvania Avenue', 'Green', 320, 28],
        ['Chance'],
        ['Park Place', 'SteelBlue', 350, 35],
        ['Income Tax'],
        ['Boardwalk', 'SteelBlue', 400, 45],
      ];

      setTiles(set.map((property, i) => {
        let tile;
  
        switch (property[0]) {
          case 'Go':
            tile = new Go(i, 'Go');
            break;
          case 'Chance':
            tile = new Chance(i, 'Chance');
            break;
          case 'Income Tax':
            tile = new Tax(i, 'Income Tax');
            break;
          case 'Jail':
            tile = new Jail(i, 'Jail');
            break;
          case 'Free Parking':
            tile = new FreeParking(i, 'Free Parking');
            break;
          case 'Go To Jail':
            tile = new GoToJail(i, 'Go To Jail');
            break;
          default:
            tile = new Property(i, property[0], property[1], property[2], property[3]);
            break;
        }
        if (i === 0) {
          let start = {tile};
          start['players'] = {};
          players.forEach(player => {
            start.players[player.name] = player;
          })
          return start;
        }
        return {tile, players: {}};
      }));
      
    }
    setup();
  }, [players]);

  const move = (die1, die2) => {
    let player = players[activePlayer];
    if (!die1 && !die2) [die1, die2] = player.rollDice();
    let tilesArr = [...tiles];
    let roll = die1 + die2;

    delete tilesArr[player.position].players[player.name];
    if (roll + player.position > 35) player.cash += 200;
    player.position = (roll + player.position) % tiles.length;
    tilesArr[player.position].players[player.name] = player;
    setTiles(tilesArr);
    setRoll([die1, die2]);

    return tilesArr[player.position];
  }
  
  const moveToJail = () => {
    let player = players[activePlayer];
    let tilesArr = [...tiles];
    
    delete tilesArr[player.position].players[player.name];
    player.position = 9;
    tilesArr[player.position].players[player.name] = player;
    player.sendToJail();

    setTiles(tilesArr);
  }

  const nextPlayer = () => {
    setActivePlayer((activePlayer + 1) % players.length);
  }

  const handleTileHover = (tile) => {
    return e => {
      if (tile instanceof Property) {
        setDisplayTile(tile);
        let x = e.clientX;
        let y = e.clientY;
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const displayTileHeight = 270;
        const displayTileWidth = 245;
        const offset = 10;

        // if (x + displayTileWidth > screenWidth) x -= displayTileWidth + offset;
        // if (y + displayTileHeight > screenHeight) y -= displayTileHeight + offset;
        if (y + displayTileHeight > screenHeight) {
          if (x + displayTileWidth > screenWidth) {
            x -= displayTileWidth + offset;
          }
          y -= y + displayTileHeight - screenHeight + offset
        };
        if (x + displayTileWidth > screenWidth) {
          x -= x + displayTileWidth - screenWidth + offset;
        }

        setPos([x, y + window.scrollY]);
      }
    }
  }

  const displayZoomedTile = () => {
    if (!displayTile) return null;
    return <div className="tile zoom" style={{ left: pos[0]+3, top: pos[1]+3 }}>
            <header className="tile-header" style={{ backgroundColor: displayTile.color }}>{displayTile.name}</header>
            <div className="zoom-price">{`PRICE $${displayTile.price}`}</div>
            <div className="zoom-rent">{`RENT $${displayTile.rent}`}</div>
            <div className="house-desc-container">
              <div className="house-desc">
                <div>With 1 House</div><div>${displayTile.rentAmount(1, true)}</div>
              </div>
              <div className="house-desc">
                <div>With 2 Houses</div><div>${displayTile.rentAmount(2, true)}</div>
              </div>
              <div className="house-desc">
                <div>With 3 Houses</div><div>${displayTile.rentAmount(3, true)}</div>
              </div>
              <div className="house-desc">
                <div>With 4 Houses</div><div>${displayTile.rentAmount(4, true)}</div>
              </div>
            </div>
            <div className="additional-info">
              <div>Mortgage Value ${displayTile.price/2}</div>
              <div>House Cost ${displayTile.buildingPrice} Each</div>
            </div>
            <div className="fine-info">
              If a player owns all the lots of any Color-Group, the rent is doubled on unimproved lots in that group.
            </div>
          </div>
  }

  const displayHouses = (property) => {
    if (!property.buildings) return null;
    let buildingArr = [];

    for (let i = 0; i < property.buildings; i++) {
      buildingArr.push(<i key={i} className="fas fa-home"></i>)
    }
    return <div className="tile-houses">
              <div>{buildingArr.slice(0,2)}</div>
              <div>{buildingArr.slice(2)}</div>
           </div>
  }

  const displayPiece = (player, mini=false, idx=0) => {
    if (!player) return null;

    let figure;
    let addClass = '';

    if (player.jailed && !mini) {
      addClass += " gray";
    }

    if (mini) {
      addClass += " mini"
    }

    switch (player.piece) {
      case 'Horse':
        figure = <i key={idx} className={"fas fa-horse" + (addClass ? addClass : '')}></i>;
        break;
      case 'Bicycle':
        figure = <i key={idx} className={"fas fa-bicycle" + (addClass ? addClass : '')}></i>;
        break;
      case 'Dog':
        figure = <i key={idx} className={"fas fa-dog" + (addClass ? addClass : '')}></i>
        break;
      case 'Car':
        figure = <i key={idx} className={"fas fa-car" + (addClass ? addClass : '')}></i>
        break;
      case 'Ship':
        figure = <i key={idx} className={"fas fa-ship" + (addClass ? addClass : '')}></i>
        break;
      case 'Cat':
        figure = <i key={idx} className={"fas fa-cat" + (addClass ? addClass : '')}></i>
        break;
      default:
        break;
    }
    return figure;
  }

  let board = tiles.map((tileObj, i) => {
    let { tile } = tileObj;
    let playerArr = Object.values(tileObj.players);
    if (playerArr.length > 0) {
      playerArr = playerArr.map((player, idx) => displayPiece(player, false, idx))
    }

    let color = tile.color || '#CEE6D0';

    return <div key={i} className="tile" style={{ backgroundImage: '../../ assets / images / go_to_jail.png' }} onMouseMove={handleTileHover(tile)} onMouseLeave={() => setDisplayTile(null)}>
              <header className="tile-header" style={{ backgroundColor: color }}>{tile.name}{displayPiece(tile.owner, true)}</header>
              <div className="tile-players">
                {playerArr}
              </div>
              <div className="tile-price">{tile.price ? `$${tile.price}` : null}</div>
              {displayHouses(tile)}
           </div>
  });

  return <div className="board-container">
          <Interface
            move={move}
            setActivePlayer={setActivePlayer}
            player={players[activePlayer]}
            players={players}
            setPlayers={setPlayers}
            nextPlayer={nextPlayer}
            roll={roll}
            setRoll={setRoll}
            tiles={tiles}
            setTiles={setTiles}
            moveToJail={moveToJail}
            displayPiece={displayPiece}
            setModal={setModal}
          />
          <div className="board">
            <div className="row">{board.slice(0,10)}</div>
            <div className="row top">
              {board.slice(35, 36)}
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div> 
              {board.slice(10, 11)} 
            </div>
            <div className="row">
              {board.slice(34, 35)}
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div> 
              {board.slice(11, 12)}
            </div>
            <div className="row">
              {board.slice(33, 34)}
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div> 
              {board.slice(12, 13)}
            </div>
            <div className="row">
              {board.slice(32, 33)}
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div> 
              {board.slice(13, 14)}
            </div>
            <div className="row">
              {board.slice(31, 32)}
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div> 
              {board.slice(14, 15)}
            </div>
            <div className="row">
              {board.slice(30, 31)}
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div> 
              {board.slice(15, 16)}
            </div>
            <div className="row">
              {board.slice(29, 30)}
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div> 
              {board.slice(16, 17)}
            </div>
            <div className="row bottom">
              {board.slice(28, 29)}
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div>  
              <div className="tile mid">
                <header className="tile-header"></header>
                <div className="tile-players">
                </div>  
              </div> 
              {board.slice(17, 18)}
            </div>
            <div className="row">
                {board.slice(18,28).reverse()}
            </div>
          </div>
          {displayZoomedTile()}
          <Modal
            player={players[activePlayer]}
            modal={modal}
            setModal={setModal}
          />
          <Leaderboard
            players={players}
          />
        </div>
}