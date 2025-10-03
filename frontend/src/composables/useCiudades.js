import { ref } from 'vue';
import * as ciudadesService from '../Services/ciudadesService.js';

export function useCiudades() {
  const ciudades = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const fetchCiudades = async () => {
    loading.value = true;
    error.value = null;
    try {
      ciudades.value = await ciudadesService.getCiudades();
    } catch (err) {
      error.value = err.response?.data?.error || err.message;
    } finally {
      loading.value = false;
    }
  };

  const addCiudad = async (payload) => {
    loading.value = true;
    error.value = null;
    try {
      await ciudadesService.createCiudad(payload);
      await fetchCiudades();
    } catch (err) {
      error.value = err.response?.data?.errors?.[0] || err.response?.data?.error || err.message;
    } finally {
      loading.value = false;
    }
  };

  const updateCiudad = async (id, payload) => {
    loading.value = true;
    error.value = null;
    try {
      await ciudadesService.updateCiudad(id, payload);
      await fetchCiudades();
    } catch (err) {
      error.value = err.response?.data?.errors?.[0] || err.response?.data?.error || err.message;
    } finally {
      loading.value = false;
    }
  };

  const removeCiudad = async (id) => {
    if (!id) {
      throw new Error('ID de ciudad no proporcionado');
    }
    
    loading.value = true;
    error.value = null;
    try {
      await ciudadesService.deleteCiudad(id);
      await fetchCiudades();
    } catch (err) {
      error.value = err.response?.data?.error || err.message;
    } finally {
      loading.value = false;
    }
  };

  return { ciudades, loading, error, fetchCiudades, addCiudad, updateCiudad, removeCiudad };
}
