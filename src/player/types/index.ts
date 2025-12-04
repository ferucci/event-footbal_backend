
// в стандартном интерфейсе Request из библиотеки @nestjs/common нет свойства socket. Это свойство доступно только в объектах HTTP-запросов Node.js. по этому добавил кастомное
export interface CustomRequest extends Request {
  ip?: string;
  connection?: {
    remoteAddress?: string;
  };
  socket?: {
    remoteAddress?: string;
  };
}