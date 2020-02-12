export default class Player {
  constructor(name, piece) {
    this.cash = 1500;
    this.position = 0;
    this.properties = [];
    this.doubles = 0;
    this.piece = piece;
    this.name = name;
    this.jailed = false;
    this.turnsJailed = 0;
  }

  sendToJail() {
    this.jailed = true;
  }

  getOutOfJail() {
    this.jailed = false;
  }

  gainProperty(property) {
    this.properties.push(property);
    this.properties.sort((a,b) => a.color > b.color ? 1 : -1);
    property.buy(this);
  }

  loseProperty(property) {
    this.properties.splice(this.properties.indexOf(property), 1);
  }

  rollDice() {
    let die1 = Math.floor(Math.random() * 6 ) + 1;
    let die2 = Math.floor(Math.random() * 6 ) + 1;
    die1 = 1
    die2 = 2
    if (die1 === die2 && !this.jailed) {
      this.doubles += 1;
    } else {
      this.doubles = 0;
    }
    
    return [die1, die2];
  }

  netWorth() {
    const assetTotal = this.properties.reduce((acc, property) => {
      return acc += property.buildingPrice * property.buildings + property.price;
    }, 0);

    return assetTotal + this.cash;
  }
}