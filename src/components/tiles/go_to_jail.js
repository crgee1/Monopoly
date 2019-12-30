import Tile from "./tile";

export default class GoToJail extends Tile {
    // constructor(index, name) {
    //     super(index, name);
    // }

    landed(player) {
        player.position = 19;
        player.jailed = true;
    }
}