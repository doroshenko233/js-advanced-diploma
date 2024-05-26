import infoCharacter from "../InfoCharacter";

test('Проверка выводимого строки у героя', () => {
    const expected = `\u{1F396}${1} \u{2694}${20} \u{1F6E1}${20} \u{2764}${50}`;
    const received = infoCharacter({
      level: 1, attack: 20, defence: 20, health: 50,
    });
    expect(received).toBe(expected);
});