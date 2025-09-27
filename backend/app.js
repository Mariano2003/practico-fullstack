import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, MONGODB_URI } from './config.js';
import ciudadesRouter from './routes/ciudades.js';
import atletasRouter from './routes/atletas.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health/root
app.get('/', (req, res) => {
  res.json({ name: 'Maratón API', status: 'ok' });
});

// Routers
app.use('/ciudades', ciudadesRouter);
app.use('/atletas', atletasRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

// Conectar a MongoDB y luego iniciar servidor
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  });
