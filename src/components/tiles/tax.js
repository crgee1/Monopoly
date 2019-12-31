import Tile from "./tile";

export default class Tax extends Tile {

  landed(player) {
    player.cash -= 200;
  }
}