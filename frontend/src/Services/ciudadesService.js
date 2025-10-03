import axios from 'axios';

const API_URL = 'http://localhost:3000/ciudades';

const handleError = (error) => {
  console.error('Error en la petición:', error);
  if (error.response) {
    const { status, data } = error.response;
    let errorMessage = 'Error en la petición';
    
    if (status === 400) {
      if (data?.message?.includes('No se puede eliminar la ciudad porque tiene atletas asociados')) {
        errorMessage = 'No se puede eliminar la ciudad porque tiene atletas asociados. Por favor, elimina o actualiza primero los atletas asociados.';
      } else {
        errorMessage = data?.message || 'Datos inválidos';
      }
    } else if (status === 404) {
      errorMessage = 'Ciudad no encontrada';
    } else if (status === 500) {
      errorMessage = 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.';
    } else {
      errorMessage = data?.error || data?.message || `Error en la petición: ${status}`;
    }
    
    const err = new Error(errorMessage);
    err.response = error.response;
    throw err;
  } else if (error.request) {
    throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
  } else {
    throw new Error(error.message || 'Error al realizar la petición');
  }
};

export async function getCiudades() {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

export async function createCiudad(payload) {
  try {
    const res = await axios.post(API_URL, payload);
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

export async function updateCiudad(id, payload) {
  try {
    const res = await axios.put(`${API_URL}/${id}`, payload);
    return res.data;
  } catch (error) {
    handleError(error);
  }
}

export async function deleteCiudad(id) {
  if (!id) {
    throw new Error('ID de ciudad no proporcionado');
  }
  
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data || { success: true }; // Algunas APIs no devuelven datos en DELETE
  } catch (error) {
    handleError(error);
  }
}
