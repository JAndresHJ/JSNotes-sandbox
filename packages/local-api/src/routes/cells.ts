import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

export const createCellsRouter = (filename: string, dir: string) => {
  const router = express.Router();
  router.use(express.json());

  const fullPath = path.join(dir, filename);

  router.get('/cells', async (req, res) => {
    // Read the file
    try {
      const result = await fs.readFile(fullPath, { encoding: 'utf-8' });
      // Parse a list of cells out of it
      // Send list of cells back to browser
      res.send(JSON.parse(result));
    } catch (error: any) {
      // If read throws an error, inspect the error and see if it says
      // that the file does not exist
      if (error.code === 'ENOENT') {
        // Add code to create a file and add default cells
        await fs.writeFile(fullPath, '[]', 'utf-8');
        res.send([]);
      } else {
        throw error;
      }
    }
  });

  router.post('/cells', async (req, res) => {
    // Make sure this file exists, if it does not, it'll be created automatically

    // Take the list of cells from the request object serialize them,
    // that means turn them into a format that can be safely written into that file
    const { cells }: { cells: Cell[] } = req.body;

    // Write the cells into the files
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8');

    res.send({ status: 'ok' });
  });

  return router;
};
