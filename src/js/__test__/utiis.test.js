import { calcTileType } from "../utils";
import { calcHealthLevel } from "../utils";

test('Должно правильно отрисовывать поле', () => {
    
    expect(calcTileType(0, 8)).toBe('top-left');
    expect(calcTileType(7, 8)).toBe('top-right');
    expect(calcTileType(56, 8)).toBe('bottom-left');
    expect(calcTileType(63, 8)).toBe('bottom-right');
    expect(calcTileType(5, 8)).toBe('top');
    expect(calcTileType(60, 8)).toBe('bottom');
    expect(calcTileType(8, 8)).toBe('left');
    expect(calcTileType(15, 8)).toBe('right');
    expect(calcTileType(10, 8)).toBe('center');
});

test('Функция calcHealthLevel должна вернуть корректное значение', () => {
    
    expect(calcHealthLevel(10)).toBe('critical');
    expect(calcHealthLevel(40)).toBe('normal');
    expect(calcHealthLevel(60)).toBe('high');
});