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
  }
  
  loseMonopoly() {
    this.monopoly = false;
  }

  rentAmount() {
    if (this.monopoly && this.buildings === 0) return this.rent * 2;
  
    switch (this.buildings) {
      case 0:
        return this.rent;
      case 1:
        return this.rent *= 5;
      case 2:
        return this.rent *= 3;
      case 3:
        return this.rent *= 3;
      case 4:
        return this.rent = this.rent / 45 * 80;
      default:
        break;
    }
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
  }

  sell() {
    this.owner.cash += this.buildingPrice / 2;
    this.buildings -= 1;
  }
}