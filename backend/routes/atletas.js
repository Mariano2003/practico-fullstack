import { Router } from 'express';
import mongoose from 'mongoose';
import { Atleta } from '../models/Atleta.js';
import { Ciudad } from '../models/Ciudad.js';
import { validateAtleta } from '../validators/atletasValidator.js';

const router = Router();

function normalizeBody(body) {
  return {
    dni: Number(body?.dni),
    nombre: String(body?.nombre || '').trim(),
    tiempo: String(body?.tiempo || '').trim(),
    posicion: Number(body?.posicion),
    ciudad: String(body?.ciudad || body?.ciudadId || ''),
  };
}

// GET /atletas - listar con nombre de ciudad
router.get('/', async (req, res, next) => {
  try {
    const atletas = await Atleta.find().populate('ciudad', 'nombre').sort({ posicion: 1, nombre: 1 });
    const data = atletas.map((a) => ({
      id: a._id,
      dni: a.dni,
      nombre: a.nombre,
      tiempo: a.tiempo,
      posicion: a.posicion,
      ciudadId: a.ciudad?._id || null,
      ciudad: a.ciudad?.nombre || null,
    }));
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// POST /atletas - crear
router.post('/', async (req, res, next) => {
  try {
    const { dni, nombre, tiempo, posicion, ciudad } = normalizeBody(req.body);
    const errors = validateAtleta({ dni, nombre, tiempo, posicion, ciudad });
    if (errors.length) return res.status(400).json({ errors });

    // Validar formato de ObjectId para ciudad
    if (!mongoose.Types.ObjectId.isValid(ciudad)) {
      return res.status(400).json({ errors: ['El campo "ciudad" debe ser un ObjectId válido'] });
    }

    // Validar ciudad existente
    const ciudadExists = await Ciudad.exists({ _id: ciudad });
    if (!ciudadExists) return res.status(400).json({ errors: ['La ciudad no existe'] });

    // Validar DNI único
    const dniExists = await Atleta.exists({ dni });
    if (dniExists) return res.status(409).json({ errors: ['Ya existe un atleta con ese DNI'] });

    const atleta = await Atleta.create({ dni, nombre, tiempo, posicion, ciudad });
    res.status(201).json({
      id: atleta._id,
      dni: atleta.dni,
      nombre: atleta.nombre,
      tiempo: atleta.tiempo,
      posicion: atleta.posicion,
      ciudadId: atleta.ciudad,
    });
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ errors: ['Ya existe un atleta con ese DNI'] });
    next(err);
  }
});

// PUT /atletas/:id - actualizar
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'El parámetro id debe ser un ObjectId válido' });
    }
    const { dni, nombre, tiempo, posicion, ciudad } = normalizeBody(req.body);
    const errors = validateAtleta({ dni, nombre, tiempo, posicion, ciudad });
    if (errors.length) return res.status(400).json({ errors });

    // Validar formato de ObjectId para ciudad
    if (!mongoose.Types.ObjectId.isValid(ciudad)) {
      return res.status(400).json({ errors: ['El campo "ciudad" debe ser un ObjectId válido'] });
    }

    // Validar ciudad existente
    const ciudadExists = await Ciudad.exists({ _id: ciudad });
    if (!ciudadExists) return res.status(400).json({ errors: ['La ciudad no existe'] });

    // Validar DNI único excluyendo el propio
    const dniExists = await Atleta.exists({ dni, _id: { $ne: id } });
    if (dniExists) return res.status(409).json({ errors: ['Ya existe un atleta con ese DNI'] });

    const atleta = await Atleta.findByIdAndUpdate(
      id,
      { $set: { dni, nombre, tiempo, posicion, ciudad } },
      { new: true, runValidators: true }
    ).populate('ciudad', 'nombre');

    if (!atleta) return res.status(404).json({ error: 'Atleta no encontrado' });

    res.json({
      message: 'Atleta modificado exitosamente',
      data: {
        id: atleta._id,
        dni: atleta.dni,
        nombre: atleta.nombre,
        tiempo: atleta.tiempo,
        posicion: atleta.posicion,
        ciudadId: atleta.ciudad?._id || null,
        ciudad: atleta.ciudad?.nombre || null,
      },
    });
  } catch (err) {
    if (err?.code === 11000) return res.status(409).json({ errors: ['Ya existe un atleta con ese DNI'] });
    next(err);
  }
});

// DELETE /atletas/:id - eliminar
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'El parámetro id debe ser un ObjectId válido' });
    }
    const deleted = await Atleta.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Atleta no encontrado' });
    res.status(200).json({ message: 'Atleta eliminado exitosamente' });
  } catch (err) {
    next(err);
  }
});

export default router;
