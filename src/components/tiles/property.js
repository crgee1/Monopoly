import Tile from './tile';

export default class Property extends Tile {
  constructor(index, name, color, price, rent) {
    super(index, name);
    this.color = color;
    this.price = price;
    this.rent = rent;
    this.buildings = 0;
    this.owner = null;
    this.monopoly = false;
    this.mortgaged = false;

    let home; 
    switch (this.color) {
      case 'Brown':
      case 'LightBlue':
        home = 50;
        break;
      case 'Pink':
      case 'Orange':
        home = 100;
        break;
      case 'Red':
      case 'Yellow':
        home = 150;
        break;
      case 'Green':
      case 'SteelBlue':
        home = 200;
        break;
      default:
        break;
    }
    this.buildingPrice = home;
  }

  reset() {
    this.owner = null;
    this.monopoly = false;
    this.mortgaged = false;

    while (this.buildings > 0) {
      this.sell();
    }
  }

  getMonopoly() {
    this.monopoly = true;
    this.rent *= 2;
  }
  
  loseMonopoly() {
    this.monopoly = false;
    this.rent /= 2;
  }

  buy(player) {
    this.owner = player;
  }

  landed(player) {
    if (this.owner) {
      this.payRent(player);
    }
  }

  payRent(player) {
    player.cash -= this.rent;
    this.owner.cash += this.rent;
  }

  build() {
    this.owner.cash -= this.buildingPrice;
    this.buildings += 1;
    switch (this.buildings) {
      case 1:
        this.rent *= 5;
        break;
      case 2:
        this.rent *= 3;
        break;
      case 3:
        this.rent *= 3;
        break;
      case 4:
        this.rent = this.rent / 45 * 80;
        break;
      default:
        break;
    }
  }

  sell() {
    this.owner.cash += this.buildingPrice / 2;
    this.buildings -= 1;
    switch (this.buildings) {
      case 0:
        this.rent /= 5;
        break;
      case 1:
        this.rent /= 3;
        break;
      case 2:
        this.rent /= 3;
        break;
      case 3:
        this.rent = this.rent * 45 / 80;
        break;
      default:
        break;
    }
  }
}