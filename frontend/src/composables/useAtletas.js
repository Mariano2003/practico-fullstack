import * as atletasService from '../Services/atletasService';

import { ref } from 'vue';

export function useAtletas() {
  const atletas = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchAtletas = async () => {
    loading.value = true;
    error.value = null;
    try {
      atletas.value = await atletasService.getAtletas();
    } catch (err) {
      error.value = err.message || 'Error al obtener atletas';
    } finally {
      loading.value = false;
    }
  };

  const addAtleta = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      console.log('Enviando datos al servidor para crear atleta:', payload);
      
      if (!payload.dni || !payload.nombre || !payload.tiempo || !payload.ciudadId) {
        const missingFields = [];
        if (!payload.dni) missingFields.push('DNI');
        if (!payload.nombre) missingFields.push('nombre');
        if (!payload.tiempo) missingFields.push('tiempo');
        if (!payload.ciudadId) missingFields.push('ciudad');
        
        const errorMsg = `Faltan campos requeridos: ${missingFields.join(', ')}`;
        console.error(errorMsg);
        error.value = errorMsg;
        return { success: false, error: errorMsg };
      }
      
      const result = await atletasService.createAtleta(payload);
      console.log('Atleta creado exitosamente:', result);
      
      await fetchAtletas();
      
      return { 
        success: true,
        data: result
      };
      
    } catch (err) {
      console.error('Error en addAtleta:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      
      const errorMsg = err.message || 'Error al crear el atleta. Por favor, verifica los datos e inténtalo de nuevo.';
      error.value = errorMsg;
      return { 
        success: false, 
        error: errorMsg 
      };
    } finally {
      loading.value = false;
    }
  };

  const updateAtleta = async (id, payload) => {
    if (!id) {
      const errorMsg = 'ID de atleta no proporcionado para la actualización';
      console.error(errorMsg);
      error.value = errorMsg;
      return { success: false, error: errorMsg };
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      console.log(`Actualizando atleta ID: ${id} con datos:`, payload);
      
      if (!payload.dni || !payload.nombre || !payload.tiempo || !payload.ciudadId) {
        const missingFields = [];
        if (!payload.dni) missingFields.push('DNI');
        if (!payload.nombre) missingFields.push('nombre');
        if (!payload.tiempo) missingFields.push('tiempo');
        if (!payload.ciudadId) missingFields.push('ciudad');
        
        const errorMsg = `Faltan campos requeridos: ${missingFields.join(', ')}`;
        console.error(errorMsg);
        error.value = errorMsg;
        return { success: false, error: errorMsg };
      }
      
      const result = await atletasService.updateAtleta(id, payload);
      console.log('Atleta actualizado exitosamente:', result);
      
      await fetchAtletas();
      
      return { 
        success: true,
        data: result
      };
      
    } catch (err) {
      console.error('Error en updateAtleta:', {
        error: err,
        message: err.message,
        stack: err.stack,
        id,
        payload
      });
      
      const errorMsg = err.message || 'Error al actualizar el atleta. Por favor, verifica los datos e inténtalo de nuevo.';
      error.value = errorMsg;
      return { 
        success: false, 
        error: errorMsg 
      };
    } finally {
      loading.value = false;
    }
  };

  const removeAtleta = async (id) => {
    if (!id) {
      error.value = 'ID de atleta no proporcionado';
      return { success: false, error: error.value };
    }
    
    loading.value = true;
    error.value = null;
    
    try {
      console.log('Eliminando atleta con ID:', id);
      const result = await atletasService.deleteAtleta(id);
      console.log('Atleta eliminado:', result);
      await fetchAtletas();
      return { success: true };
    } catch (err) {
      console.error('Error en removeAtleta:', err);
      error.value = err.message || 'Error al eliminar atleta';
    } finally {
      loading.value = false;
    }
  };

  return {
    atletas,
    loading,
    error,
    fetchAtletas,
    addAtleta,
    updateAtleta,
    removeAtleta
  };
};
