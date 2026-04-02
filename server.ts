import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  const INVOICES_FILE = path.join(process.cwd(), 'invoices.json');

  // Initialize invoices file if not exists
  if (!fs.existsSync(INVOICES_FILE)) {
    fs.writeFileSync(INVOICES_FILE, JSON.stringify([]));
  }

  app.get('/api/invoices', (req, res) => {
    const data = fs.readFileSync(INVOICES_FILE, 'utf-8');
    res.json(JSON.parse(data));
  });

  app.post('/api/invoices', (req, res) => {
    const newInvoice = req.body;
    const data = JSON.parse(fs.readFileSync(INVOICES_FILE, 'utf-8'));
    data.unshift(newInvoice);
    fs.writeFileSync(INVOICES_FILE, JSON.stringify(data, null, 2));
    
    // Log for accounting team (simulating SQL sync)
    console.log(`[SQL SYNC] Invoice ${newInvoice.invoiceNumber} synced to accounting database.`);
    
    res.status(201).json(newInvoice);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
