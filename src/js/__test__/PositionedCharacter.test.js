import PositionedCharacter from "../PositionedCharacter";
import Bowman from "../Characters/Bowman";

test('Если в PositionedCharacter передать объект, который не наследуется от Character, то будет выброшена ошибка', () => {
    const obj = {};
    expect(() => new PositionedCharacter(1, obj)).toThrow('character must be instance of Character or its children');
});
  
test('Если в PositionedCharacter вторым параметром передать не числовой тип, будет выброшена ошибка', () => {
    const bowman = new Bowman(1);
    expect(() => new PositionedCharacter(bowman, '1')).toThrow('position must be a number');
});

test('правильно устанавливает свойства персонажа и позиции', () => {
    const character = new Bowman(1, 'bowman');
    const position = 5;
    const positionedCharacter = new PositionedCharacter(character, position);
  
    expect(positionedCharacter.character).toBe(character);
    expect(positionedCharacter.position).toBe(position);
});