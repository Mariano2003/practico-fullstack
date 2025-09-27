export function validateCiudadNombre(nombre) {
  const errors = [];
  const value = String(nombre || '').trim();
  if (!value) errors.push('El nombre es requerido');
  return errors;
}
