export function validateAtletaFields({ dni, nombre, tiempo, posicion, ciudad }) {
  const errors = [];
  if (!Number.isInteger(dni) || dni <= 0) errors.push('DNI inválido');
  if (!String(nombre || '').trim()) errors.push('Nombre requerido');
  if (!String(tiempo || '').trim()) errors.push('Tiempo requerido (ej: "2h 07m 30s")');
  if (!Number.isInteger(posicion) || posicion <= 0) errors.push('Posición debe ser un entero > 0');
  if (!String(ciudad || '').trim()) errors.push('ciudadId/ciudad requerido');
  return errors;
}

// Alias para compatibilidad con rutas que importan validateAtleta
export function validateAtleta(payload) {
  return validateAtletaFields(payload);
}
