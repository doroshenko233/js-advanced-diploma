/* eslint-disable no-dupe-class-members */
import themes from "./themes";
import GameState from "./GameState";
import GamePlay from "./GamePlay";
import Team from './Team';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import infoCharacter from "./InfoCharacter";
import checkedPositions from "./checkedPositions";
import cursors from './cursors';

let selectedCharacterIndex = 0;
let checkedDistance;
let checkedDistanceAttack;
let checkedPosition;
let boardSize;

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.initTheme = themes.prairie;
    this.cursors = cursors.pointer;
    this.currentMove = 'player';
    this.blockedBoard = false;
    this.selectedCell = false;
    this.selectedCharacter = {};
    this.playerTeam = [];
    this.computerTeam = [];
    this.level = 1;
    this.point = 0;
    this.playerPositions = [];
    this.computerPositions = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.events();
    this.gameStart();
  }

  events() {
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  gameStart() {
    this.currentMove = 'player';
    if (this.level === 1) {
      this.playerTeam = Team.getStartPlayerTeam();
      this.computerTeam = generateTeam(Team.getComputerTeam(), 1, 2);
      this.setPositionCharacter(this.playerTeam, this.computerTeam);
      
    } else if (this.level === 2) {
      this.initTheme = themes.desert;
      this.playerTeam = generateTeam(Team.getPlayerTeam(), 1, 1);
      this.computerTeam = generateTeam(
        Team.getComputerTeam(), 2, (this.playerTeam.length + this.playerPositions.length),
      );
      this.setPositionCharacter(this.playerTeam, this.computerTeam);
    } else if (this.level === 3) {
      this.initTheme = themes.arctic;
      this.playerTeam = generateTeam(Team.getPlayerTeam(), 2, 2);
      this.computerTeam = generateTeam(
        Team.getComputerTeam(), 3, (this.playerTeam.length + this.playerPositions.length),
      );
      this.setPositionCharacter(this.playerTeam, this.computerTeam);
    } else if (this.level === 4) {
      this.initTheme = themes.mountain;
      this.playerTeam = generateTeam(Team.getPlayerTeam(), 3, 2);
      this.computerTeam = generateTeam(
        Team.getComputerTeam(), 4, (this.playerTeam.length + this.playerPositions.length),
      );
      this.setPositionCharacter(this.playerTeam, this.computerTeam);
      return;
    }

    const characterPositions = this.getPositions(this.playerPositions.length);
    for (let i = 0; i < this.playerPositions.length; i += 1) {
      this.playerPositions[i].position = characterPositions.player[i];
      this.computerPositions[i].position = characterPositions.computer[i];
    }

    this.gamePlay.drawUi(this.initTheme);
    this.gamePlay.redrawPositions([...this.playerPositions, ...this.computerPositions]);
  }

  setPositionCharacter(playerTeam, computerTeam) {
    for (let i = 0; i < playerTeam.length; i += 1) {
      this.playerPositions.push(new PositionedCharacter(playerTeam[i], 0));
    }
    for (let i = 0; i < computerTeam.length; i += 1) {
      this.computerPositions.push(new PositionedCharacter(computerTeam[i], 0));
    }
  }

  getPositions(length) {
    const position = { player: [], computer: [] };
    let random;
    for (let i = 0; i < length; i += 1) {
      do {
        random = this.randomPosition();
      } while (position.player.includes(random));
      position.player.push(random);

      do {
        random = this.randomPosition(6);
      } while (position.computer.includes(random));
      position.computer.push(random);
    }
    return position;
  }

  randomPosition(columnComputer = 0) {
    return (Math.floor(Math.random() * 8) * 8) + ((Math.floor(Math.random() * 2) + columnComputer));
  }

  newGame() {
    this.playerPositions = [];
    this.computerPositions = [];
    this.level = 1;
    this.point = 0;
    this.initTheme = themes.prairie;
    this.cursors = cursors.pointer;
    this.gameStart();
    GamePlay.showMessage('Начать игру заново');
  }

  saveGame() {
    const playerLevel = {
      point: this.point,
      level: this.level,
      playerPositions: this.playerPositions,
      computerPositions: this.computerPositions,
    };
    this.stateService.save(GameState.from(playerLevel));
    GamePlay.showMessage('Игра сохранена');
  }

  loadGame() {
    const loadState = this.stateService.load();
    if (loadState) {
      this.point = loadState.point;
      this.level = loadState.level;
      this.playerPositions = loadState.playerPositions;
      this.computerPositions = loadState.computerPositions;
      this.gamePlay.drawUi(this.initTheme);
      this.gamePlay.redrawPositions([...this.playerPositions, ...this.computerPositions]);
      GamePlay.showMessage('Загрузить игру');
    }
  }
  
  onCellClick(index) {
    // TODO: react to click
    this.index = index;
    if (!this.blockedBoard) {
      for (const item of [...this.playerPositions, ...this.computerPositions]) {
        if (item.position === index) {
          this.gamePlay.showCellTooltip(infoCharacter(item.character), index);
        }
      }

      if (this.selectedCell) {
        checkedPosition = this.selectedCharacter.position;
        checkedDistance = this.selectedCharacter.character.distance;
        boardSize = this.gamePlay.boardSize;

        const checkPositions = checkedPositions(checkedPosition, checkedDistance, boardSize);

        checkedDistanceAttack = this.selectedCharacter.character.distanceAttack;
        const checkedAttack = checkedPositions(checkedPosition, checkedDistanceAttack, boardSize);

        if (this.getIndex(this.playerPositions) !== -1) {
          this.gamePlay.setCursor(cursors.pointer);
        } else if (checkPositions.includes(index)
          && this.getIndex([...this.playerPositions, ...this.computerPositions]) === -1) {
          this.gamePlay.selectCell(index, 'green');
          this.gamePlay.setCursor(cursors.pointer);
        } else if (checkedAttack.includes(index) && this.getIndex(this.computerPositions) !== -1) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.index = index;
    if (!this.blockedBoard) {
      for (const item of [...this.playerPositions, ...this.computerPositions]) {
        if (item.position === index) {
          this.gamePlay.showCellTooltip(infoCharacter(item.character), index);
        }
      }

      if (this.selectedCell) {
        checkedPosition = this.selectedCharacter.position;
        checkedDistance = this.selectedCharacter.character.distance;
        boardSize = this.gamePlay.boardSize;

        const checkPositions = checkedPositions(checkedPosition, checkedDistance, boardSize);

        checkedDistanceAttack = this.selectedCharacter.character.distanceAttack;
        const checkedAttack = checkedPositions(checkedPosition, checkedDistanceAttack, boardSize);

        if (this.getIndex(this.playerPositions) !== -1) {
          this.gamePlay.setCursor(cursors.pointer);
        } else if (checkPositions.includes(index)
          && this.getIndex([...this.playerPositions, ...this.computerPositions]) === -1) {
          this.gamePlay.selectCell(index, 'green');
          this.gamePlay.setCursor(cursors.pointer);
        } else if (checkedAttack.includes(index) && this.getIndex(this.computerPositions) !== -1) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.selectedCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  async onCellClick(index) {
    this.index = index;
    // TODO: react to click
    if (!this.blockedBoard) {
      if (this.getIndex([...this.playerPositions]) !== -1) {
        this.gamePlay.deselectCell(selectedCharacterIndex);
        this.gamePlay.selectCell(index);
        selectedCharacterIndex = index;
        this.selectedCharacter = [...this.playerPositions].find((item) => item.position === index);
        this.selectedCell = true;
      } else if (this.selectedCell && this.gamePlay.boardEl.style.cursor === 'pointer') {
        this.selectedCharacter.position = index;
        this.gamePlay.deselectCell(selectedCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.selectedCell = false;
        this.gamePlay.redrawPositions([...this.playerPositions, ...this.computerPositions]);
        this.currentMove = 'computer';
        this.computerStrategy();
      } else if (this.selectedCell && this.gamePlay.boardEl.style.cursor === 'crosshair') {
        const thisAttackComputer = [...this.computerPositions].find(
          (item) => item.position === index,
        );
        this.gamePlay.deselectCell(selectedCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor(cursors.auto);
        this.selectedCell = false;
        await this.characterAttacker(this.selectedCharacter.character, thisAttackComputer);
        if (this.computerPositions.length > 0) {
          this.computerStrategy();
        }
      }
    }
  }
  getIndex(arr) {
    return arr.findIndex((item) => item.position === this.index);
  }

  async characterAttacker(attacker, target) {
    const targetedCharacter = target.character;
    let damage = Math.max(attacker.attack - targetedCharacter.defence, attacker.attack * 0.1);
    damage = Math.floor(damage);
    await this.gamePlay.showDamage(target.position, damage);
    targetedCharacter.health -= damage;
    this.currentMove = this.currentMove === 'computer' ? 'player' : 'computer';

    if (targetedCharacter.health <= 0) {
      this.playerPositions = this.playerPositions.filter(
        (item) => item.position !== target.position,
      );
      this.computerPositions = this.computerPositions.filter(
        (item) => item.position !== target.position,
      );
      if (this.playerPositions.length === 0) {
        GamePlay.showMessage('Вы проиграли !!!');
        this.blockedBoard = true;
      }
      if (this.computerPositions.length === 0) {
        for (const item of this.playerPositions) {
          this.point += item.character.health;
        }
       
        this.levelUp();
        this.level += 1;
        this.gameStart();
      }
    }
    this.gamePlay.redrawPositions([...this.playerPositions, ...this.computerPositions]);
  }

  levelUp() {
    for (const item of this.playerPositions) {
      const current = item.character;
      current.level += 1;
      current.attack = this.attackAndDefenceLevelUp(current.attack, current.health);
      current.defence = this.attackAndDefenceLevelUp(current.defence, current.health);
      current.health = (current.health + 80) < 100 ? current.health + 80 : 100;
    }
  }

  attackAndDefenceLevelUp(attackBefore, life) {
    return Math.floor(Math.max(attackBefore, attackBefore * (1.8 - life / 100)));
  }

  async computersAttack(character, target) {
    await this.characterAttacker(character, target);
    this.currentMove = 'player';
  }

  // Компьютер
  computerStrategy() {
    if (this.currentMove === 'computer') {
      for (const computer of [...this.computerPositions]) {
        checkedDistanceAttack = this.selectedCharacter.character.distanceAttack;
        checkedPosition = computer.position;
        boardSize = this.gamePlay.boardSize;

        const checkedAttack = checkedPositions(
          checkedPosition,
          checkedDistanceAttack,
          boardSize,
        );

        const target = this.computerAttack(checkedAttack);
        if (target !== null) {
          this.computersAttack(computer.character, target);
          return;
        }
      }
      const randomIndex = Math.floor(Math.random() * [...this.computerPositions].length);
      const randomComputer = [...this.computerPositions][randomIndex];
      this.computerMove(randomComputer);
      this.gamePlay.redrawPositions([...this.playerPositions, ...this.computerPositions]);
      this.currentMove = 'player';
    }
  }

  // ход комьютера
  computerMove(itemComputer) {
    const currentComputerCharacter = itemComputer;
    const itemComputerDistance = itemComputer.character.distance;
    const itemComputerRow = this.positionRow(currentComputerCharacter.position);
    const itemComputerColumn = this.positionColumn(currentComputerCharacter.position);
    let distanceRow;
    let distanceColumn;
    let stepRow;
    let stepColumn;
    let Steps;
    let nearTarget = {};

    for (const itemUser of [...this.playerPositions]) {
      const itemUserRow = this.positionRow(itemUser.position);
      const itemUserColumn = this.positionColumn(itemUser.position);
      stepRow = itemComputerRow - itemUserRow;
      stepColumn = itemComputerColumn - itemUserColumn;
      Steps = Math.abs(stepRow) + Math.abs(stepColumn);

      if (nearTarget.steps === undefined || Steps < nearTarget.steps) {
        nearTarget = {
          steprow: stepRow,
          stepcolumn: stepColumn,
          steps: Steps,
          positionRow: itemUserRow,
          positionColumn: itemUserColumn,
        };
      }
    }

    if (Math.abs(nearTarget.steprow) === Math.abs(nearTarget.stepcolumn)) {
      if (Math.abs(nearTarget.steprow) > itemComputerDistance) {
        distanceRow = (itemComputerRow - (itemComputerDistance * Math.sign(nearTarget.steprow)));
        distanceColumn = (itemComputerColumn - (
          itemComputerDistance * Math.sign(nearTarget.stepcolumn)
        ));

        currentComputerCharacter.position = this.distanceIndex(distanceRow, distanceColumn);
      } else {
         distanceRow = (itemComputerRow - (
           nearTarget.steprow - (1 * Math.sign(nearTarget.steprow))
         ));
         distanceColumn = (itemComputerColumn - (
           nearTarget.stepcolumn - (1 * Math.sign(nearTarget.steprow))
         ));

         currentComputerCharacter.position = this.distanceIndex(distanceRow, distanceColumn);
        }
    } else if (nearTarget.stepcolumn === 0) {
      if (Math.abs(nearTarget.steprow) > itemComputerDistance) {
        distanceRow = (itemComputerRow - (itemComputerDistance * Math.sign(nearTarget.steprow)));
        currentComputerCharacter.position = this.distanceIndex(distanceRow, (itemComputerColumn));
      } else {
        distanceRow = (itemComputerRow - (
          nearTarget.steprow - (1 * Math.sign(nearTarget.steprow))
        ));
        currentComputerCharacter.position = this.distanceIndex(distanceRow, (itemComputerColumn));
      }
    } else if (nearTarget.steprow === 0) {
      if (Math.abs(nearTarget.stepcolumn) > itemComputerDistance) {
        distanceColumn = (itemComputerColumn - (
          itemComputerDistance * Math.sign(nearTarget.stepcolumn)
        ));
        currentComputerCharacter.position = this.distanceIndex((itemComputerRow), distanceColumn);
      } else {
        const tempFormul = (nearTarget.stepcolumn - (1 * Math.sign(nearTarget.stepcolumn)));
        distanceColumn = (itemComputerColumn - tempFormul);
        currentComputerCharacter.position = this.distanceIndex((itemComputerRow), distanceColumn);
      }
    } else if (Math.abs(nearTarget.steprow) > Math.abs(nearTarget.stepcolumn)) {
      if (Math.abs(nearTarget.steprow) > itemComputerDistance) {
        distanceRow = (itemComputerRow - (itemComputerDistance * Math.sign(nearTarget.steprow)));
        currentComputerCharacter.position = this.distanceIndex(distanceRow, (itemComputerColumn));
      } else {
        distanceRow = (itemComputerRow - (nearTarget.steprow));
        currentComputerCharacter.position = this.distanceIndex(distanceRow, (itemComputerColumn));
      }
    } else if (Math.abs(nearTarget.stepcolumn) > itemComputerDistance) {
      distanceColumn = (itemComputerColumn - (
        itemComputerDistance * Math.sign(nearTarget.stepcolumn)
      ));
      currentComputerCharacter.position = this.distanceIndex((itemComputerRow), distanceColumn);
    } else {
      currentComputerCharacter.position = this.distanceIndex(
        (itemComputerRow), (itemComputerColumn),
      );
    }
  }

  computerAttack(checkedAttack) {
    for (const itemUser of [...this.playerPositions]) {
      if (checkedAttack.includes(itemUser.position)) {
        return itemUser;
      }
    }
    return null;
  }

  positionRow(index) {
    return Math.floor(index / this.gamePlay.boardSize);
  }

  positionColumn(index) {
    return index % this.gamePlay.boardSize;
  }

  distanceIndex(row, column) {
    return (row * 8) + column;
  }
  
}