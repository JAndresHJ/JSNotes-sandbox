import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { createCellsRouter } from './routes/cells';

export const serve = (
  port: number,
  filename: string,
  dir: string,
  useProxy: boolean
) => {
  const app = express();

  app.use(createCellsRouter(filename, dir));

  if (useProxy) {
    // If we are running on development mode we get an
    // actual create-react-app server running.
    app.use(
      createProxyMiddleware({
        target: 'http://localhost:3000',
        ws: true,
        logLevel: 'silent',
      })
    );
  } else {
    // Get the absolute path of the index.html
    const packagePath = require.resolve(
      '@jsnotes-jandreshj/local-client/build/index.html'
    );
    // We don't want the entire path just until the build directory
    // that's why we are just getting the dirname of the absolute path.
    // This way of serving the application is when the user has installed jbook
    // in his machine, so the built files are served up.
    app.use(express.static(path.dirname(packagePath)));
  }

  return new Promise<void>((resolve, reject) => {
    app.listen(port, resolve).on('error', reject);
  });
};
