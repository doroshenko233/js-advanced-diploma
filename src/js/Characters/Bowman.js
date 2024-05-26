import Character from "../Character";

export default class Bowman extends Character { 
    constructor(level) {
      super(level);
      this.level = level;
      this.attack = 25;
      this.defence = 25;
      this.health = 50;
      this.type = 'bowman';
      this.distance = 2;
      this.distanceAttack = 2;
    }
  }