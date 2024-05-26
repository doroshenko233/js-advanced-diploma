import Character from "../Character";
import Bowman from "../Characters/Bowman";
import Daemon from "../Characters/Daemon";
import Magician from "../Characters/Magician";
import Swordsman from "../Characters/Swordsman";
import Undead from "../Characters/Undead";
import Vampire from "../Characters/Vampire";

test('При попытке создать новый объект класса Character выбрасывается ошибка', () => {
    expect(() => new Character(1, 'bowman')).toThrow('Cоздание объекта этого класса не разрешено');
});

test('должен быть создан объект унаследованного класса', () => {
    
    expect(new Bowman(1)).toBeDefined();
    expect(new Daemon(1)).toBeDefined();
    expect(new Magician(1)).toBeDefined();
    expect(new Swordsman(1)).toBeDefined();
    expect(new Undead(1)).toBeDefined();
    expect(new Vampire(1)).toBeDefined();
});



