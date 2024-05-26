/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
 
  switch (true) {
    case index === 0: return "top-left";
    case index === 7: return "top-right";
    case index === 56: return "bottom-left";
    case index === 63: return "bottom-right";
    case index < boardSize: return "top";
    case index > boardSize * (boardSize - 1): return "bottom";
    case index % boardSize === 0: return "left";
    case index % boardSize === boardSize - 1: return "right";
    default: return 'center';
  }
}

console.log(calcTileType(0, 8)); 
console.log(calcTileType(1, 8)); 
console.log(calcTileType(63, 8)); 
console.log(calcTileType(7, 7)); 

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
