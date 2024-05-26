export default function checkedPositions(position, distance, boardSize) {
    const values = [];
    const indexRow = Math.floor(position / boardSize);
    const indexColumn = position % boardSize;
  
    for (let i = 1; i <= distance; i += 1) {
      if (indexColumn + i < boardSize) {
        values.push(indexRow * boardSize + (indexColumn + i));
      }
      if (indexColumn - i >= 0) {
        values.push(indexRow * boardSize + (indexColumn - i));
      }
      if (indexRow + i < boardSize) {
        values.push((indexRow + i) * boardSize + indexColumn);
      }
      if (indexRow - i >= 0) {
        values.push((indexRow - i) * boardSize + indexColumn);
      }
      if (indexRow + i < boardSize && indexColumn + i < boardSize) {
        values.push((indexRow + i) * boardSize + (indexColumn + i));
      }
      if (indexRow - i >= 0 && indexColumn - i >= 0) {
        values.push((indexRow - i) * boardSize + (indexColumn - i));
      }
      if (indexRow + i < boardSize && indexColumn - i >= 0) {
        values.push((indexRow + i) * boardSize + (indexColumn - i));
      }
      if (indexRow - i >= 0 && indexColumn + i < boardSize) {
        values.push((indexRow - i) * boardSize + (indexColumn + i));
      }
    }
    
    console.log(values);
    return values;
  }
