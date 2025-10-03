

import { Router } from 'express';
import mongoose from 'mongoose';
import { Ciudad } from '../models/Ciudad.js';
import { Atleta } from '../models/Atleta.js';
import { validateCiudadNombre } from '../validators/ciudadesValidator.js';

const router = Router();

// GET /ciudades 
router.get('/', async (req, res, next) => {
  try {
    const ciudades = await Ciudad.find().sort({ nombre: 1 });
    res.json(ciudades);
  } catch (err) {
    next(err);
  }
});

// POST /ciudades
router.post('/', async (req, res, next) => {
  try {
    const { nombre } = req.body || {};
    const errors = validateCiudadNombre(nombre);
    if (errors.length) return res.status(400).json({ errors });
    const ciudad = await Ciudad.create({ nombre: nombre.trim() });
    res.status(201).json(ciudad);
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ error: 'Ya existe una ciudad con ese nombre' });
    next(err);
  }
});

// PUT /ciudades/:id 
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'El parámetro id debe ser un ObjectId válido' });
    }
    const { nombre } = req.body || {};
    const errors = validateCiudadNombre(nombre);
    if (errors.length) return res.status(400).json({ errors });
    const ciudad = await Ciudad.findByIdAndUpdate(
      id,
      { $set: { nombre: nombre.trim() } },
      { new: true, runValidators: true }
    );
    if (!ciudad) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.json({ message: 'Ciudad modificada exitosamente', data: ciudad });
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ error: 'Ya existe una ciudad con ese nombre' });
    next(err);
  }
});

// DELETE /ciudades/:id 
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'El parámetro id debe ser un ObjectId válido' });
    }
    const count = await Atleta.countDocuments({ ciudad: id });
    if (count > 0) return res.status(400).json({ error: 'No se puede eliminar: hay atletas asociados' });
    const result = await Ciudad.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Ciudad no encontrada' });
    res.status(200).json({ message: 'Ciudad eliminada exitosamente' });
  } catch (err) {
    next(err);
  }
});

export default router;
