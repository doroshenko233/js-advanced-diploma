import { generateTeam, characterGenerator } from '../generators';
import Bowman from '../Characters/Bowman';
import Swordsman from '../Characters/Swordsman';
import Magician from '../Characters/Magician';

test('Проверка наличия в генераторе персонажей и новых персонажей из списка', () => {
    const countIterations = 15;
  
    const characters = [];
    const playerTypes = [Bowman, Swordsman, Magician];
    const generator = characterGenerator(playerTypes, 4);

    for (let i = 0; i < countIterations; i += 1) {
      characters.push(generator.next().value);
    }
    expect(characters.length).toBe(countIterations);
  });
  
test('Проверка того, созданы ли playerTeam в правильном количестве и диапазоне уровней', () => {
    const characterCount = 5;
    const maxLevel = 4;
    const playerTypes = [Bowman, Swordsman, Magician];

    const generator = generateTeam(playerTypes, maxLevel, characterCount);

    let filters = [];
    for (const team of generator) {
         if (team.level <= maxLevel && team.level >= 0) {
            filters.push(team)
         }
    }
    expect(generator.length).toBe(characterCount);
    expect(filters.length).toBe(filters.length);
});