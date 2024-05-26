import GameState from "../GameState";

test('Проверяем, что GameState принимает и вернет object', () => {
    const object = {};
    expect(GameState.from(object)).toBe(object);
});

test('Проверяем, что GameState вернет null, если ничего не передать в класс', () => {
    expect(GameState.from()).toBe(null);
});

