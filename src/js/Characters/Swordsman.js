import Character from "../Character";

export default class Swordsman extends Character { // мечник
    constructor(level) {
      super(level);
      this.level = level;
      this.attack = 40;
      this.defence = 10;
      this.health = 50;
      this.type = 'swordsman';
      this.distance = 4;
      this.distanceAttack = 1;
    }
  }