import mongoose from 'mongoose';

const CiudadSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Asegurar índice único por si no existe
CiudadSchema.index({ nombre: 1 }, { unique: true });

export const Ciudad = mongoose.model('Ciudad', CiudadSchema);
