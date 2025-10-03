import axios from 'axios';

const API_URL = 'http://localhost:3000/atletas';

const handleError = (error) => {
  console.error('Error en la petición:', error);
  
  if (error.isHandled) {
    throw error;
  }
  
  let errorMessage = 'Error al procesar la solicitud';
  let status = 500;
  
  if (error.response) {
    const { status: responseStatus, data } = error.response;
    status = responseStatus;
    
    if (responseStatus === 400) {
      errorMessage = data?.message || 'Datos inválidos';
    } else if (responseStatus === 404) {
      errorMessage = 'Atleta no encontrado';
    } else if (responseStatus === 409) {
      errorMessage = data?.message || 'Ya existe un atleta con este DNI';
      const err = new Error(errorMessage);
      err.status = status;
      err.isHandled = true;
      err.isDuplicateDNI = true; 
      throw err;
    } else if (responseStatus === 500) {
      errorMessage = 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.';
    } else {
      errorMessage = data?.error || data?.message || `Error en la petición: ${responseStatus}`;
    }
  } else if (error.request) {
    errorMessage = 'No se pudo conectar con el servidor. Por favor, verifica tu conexión.';
  } else {
    errorMessage = error.message || 'Error al realizar la petición';
  }
  
  const err = new Error(errorMessage);
  err.status = status;
  err.isHandled = true;
  throw err;
};

/**
 * @returns {Promise<Array>} 
 */
export async function getAtletas() {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * @param {string} id 
 * @returns {Promise<Object>} 
 */
export async function getAtleta(id) {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 
 * @param {Object} atleta 
 * @param {string} atleta.dni 
 * @param {string} atleta.nombre 
 * @param {string} atleta.tiempo 
 * @param {number} atleta.posicion 
 * @param {string} atleta.ciudadId 
 * @returns {Promise<Object>} 
 */
export async function createAtleta(atleta) {
  try {
    console.log('Enviando datos para crear atleta:', atleta);
    const response = await axios.post(API_URL, {
      dni: atleta.dni,
      nombre: atleta.nombre,
      tiempo: atleta.tiempo,
      posicion: atleta.posicion,
      ciudad: atleta.ciudadId || atleta.ciudad
    });
    
    console.log('Atleta creado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * @param {string} id 
 * @param {Object} cambios 
 * @returns {Promise<Object>} 
 */
export async function updateAtleta(id, cambios) {
  try {
    console.log(`Actualizando atleta ID: ${id} con cambios:`, cambios);
    
    const datosActualizacion = { ...cambios };
    
    if (cambios.ciudadId) {
      datosActualizacion.ciudad = cambios.ciudadId;
      delete datosActualizacion.ciudadId;
    }
    
    console.log('Datos de actualización:', datosActualizacion);
    
    const response = await axios.put(`${API_URL}/${id}`, datosActualizacion);
    console.log('Atleta actualizado exitosamente:', response.data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}

/**

 * @param {string} id 
 * @returns {Promise<Object>} 
 */
export async function deleteAtleta(id) {
  try {
    console.log(`Eliminando atleta ID: ${id}`);
    const response = await axios.delete(`${API_URL}/${id}`);
    console.log('Atleta eliminado exitosamente');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}
