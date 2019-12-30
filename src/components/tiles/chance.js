import Tile from "./tile";

export default class Chance extends Tile {
  // constructor(index, name) {
  //   super(index, name);
  // }

  landed(player) {
    player.cash += 200;
  }
}