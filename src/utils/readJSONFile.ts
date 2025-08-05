import fs from 'node:fs';
import path from 'node:path';

export const readJSONFile = () => {

  // Получаю путь к файлу
  const filePath = path.join(__dirname, '../../../frontend/src/data/players.json');
  // Читаю файл
  const playersData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  return playersData;
}