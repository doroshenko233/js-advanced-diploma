import GameStateService from "../GameStateService";

let mockStorage;
let stateService;

beforeEach(() => {
  mockStorage = {
    setItem: jest.fn(),
    getItem: jest.fn(),
  };
  stateService = new GameStateService(mockStorage);
  jest.clearAllMocks();
});

test('Проверка состояния сохранения', () => {
  const state = { point: 4, maxPoint: 10, level: 1 };
  stateService.save(state);
  expect(mockStorage.setItem).toHaveBeenCalledWith('state', JSON.stringify(state));
});

test('Проверка состояния допустимой загрузки', () => {
  const state = { point: 4, maxPoint: 10, level: 1 };
  mockStorage.getItem.mockReturnValue(JSON.stringify(state));
  expect(stateService.load()).toEqual(state);
});

test('Проверка загрузки с недопустимым JSON.', () => {
  mockStorage.getItem.mockReturnValue('invalid JSON string');
  expect(() => stateService.load()).toThrow('Invalid state');
});

test('Проверка загрузки, когда состояние равно null', () => {
  mockStorage.getItem.mockReturnValue(null);
  expect(stateService.load()).toBeNull();
});

