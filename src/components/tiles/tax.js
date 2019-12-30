import Tile from "./tile";

export default class Tax extends Tile {
  // constructor(index, name) {
  //   super(index, name);
  // }

  landed(player) {
    player.cash -= 200;
  }
}