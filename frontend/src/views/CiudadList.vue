<template>
  <div>
    <h1>Listado de Ciudades</h1>
    <button @click="nuevaCiudad">Nueva Ciudad</button>

    <table v-if="ciudades.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in ciudades" :key="c._id">
          <td>{{ c.nombre }}</td>
          <td>
            <button @click="editar(c)">Editar</button>
            <button @click="eliminar(c._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else>No hay ciudades aún.</div>

    <CiudadForm v-if="showForm" :ciudad="selectedCiudad" @close="cerrarForm" @refresh="cargarCiudades"/>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useCiudades } from '../composables/useCiudades.js';
import CiudadForm from '../views/CiudadForm.vue';
export default {
  name: 'CiudadList',
  components: { CiudadForm },
  setup() {
    const { ciudades, fetchCiudades, removeCiudad } = useCiudades();
    const showForm = ref(false);
    const selectedCiudad = ref(null);

    const cargarCiudades = () => fetchCiudades();

    const nuevaCiudad = () => {
      selectedCiudad.value = null;
      showForm.value = true;
    };

    const editar = (c) => {
      selectedCiudad.value = c;
      showForm.value = true;
    };

    const cerrarForm = () => (showForm.value = false);

    const eliminar = async (id) => {
      if (!id) {
        console.error('ID de ciudad no proporcionado');
        return;
      }
      
      if (confirm('¿Estás seguro de que deseas eliminar esta ciudad?')) {
        try {
          await removeCiudad(id);
        } catch (error) {
          console.error('Error al eliminar ciudad:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Error al eliminar la ciudad. Por favor, inténtalo de nuevo.';
          alert(errorMessage);
        }
      }
    };

    onMounted(cargarCiudades);

    return { ciudades, showForm, selectedCiudad, nuevaCiudad, editar, cerrarForm, eliminar, cargarCiudades };
  }
};
</script>

<style lang="css">
h1 {
  margin-bottom: 1rem;
}
button {
  margin: 0.2rem;
}
</style>
