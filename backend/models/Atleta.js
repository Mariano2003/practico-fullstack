import mongoose from 'mongoose';

const AtletaSchema = new mongoose.Schema(
  {
    dni: { type: Number, required: true, unique: true, index: true },
    nombre: { type: String, required: true, trim: true },
    tiempo: { type: String, required: true, trim: true },
    posicion: { type: Number, required: true, min: 1 },
    ciudad: { type: mongoose.Schema.Types.ObjectId, ref: 'Ciudad', required: true },
  },
  { timestamps: true }
);

AtletaSchema.index({ dni: 1 }, { unique: true });

export const Atleta = mongoose.model('Atleta', AtletaSchema);
