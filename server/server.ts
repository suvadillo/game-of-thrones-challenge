import http from 'http';
import app from './app';
import { Request, Response, NextFunction } from 'express';

const { PORT = '4000' } = process.env;

app.use((req: Request, res: Response, next: NextFunction): void => {
  res.status(404);
  res.send('not-found');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error('ERROR', req.method, req.path, err);

  if (!res.headersSent) {
    res.status(500);
    res.send('error');
  }
});

let server = http.createServer(app);

server.on('error', (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') { throw error }

  switch (error.code) {
    case 'EACCES':
      console.error(`Port ${PORT} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`Port ${PORT} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

server.listen(PORT, (): void => console.log(`Server listening on port ${PORT}`));
