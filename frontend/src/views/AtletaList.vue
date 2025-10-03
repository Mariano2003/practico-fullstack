<template>
  <div>
    <h1>Listado de Atletas</h1>
    <button @click="nuevoAtleta">Nuevo Atleta</button>

    <table v-if="atletas.length">
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Tiempo</th>
          <th>Posición</th>
          <th>Ciudad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in atletas" :key="a._id">
          <td>{{ a.dni }}</td>
          <td>{{ a.nombre }}</td>
          <td>{{ a.tiempo }}</td>
          <td>{{ a.posicion }}</td>
          <td>{{ ciudades.find(c => c._id === a.ciudadId)?.nombre || 'N/D' }}</td>
          <td>
            <button @click="editar(a)">Editar</button>
            <button @click="eliminar(a)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else>No hay atletas aún.</div>

    <AtletaForm
      v-if="showForm"
      :atleta="selectedAtleta"
      @close="cerrarForm"
      @refresh="cargarAtletas"
    />
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { useAtletas } from '../composables/useAtletas';
import { useCiudades } from '../composables/useCiudades';
import AtletaForm from './AtletaForm.vue';

export default {
  name: 'AtletaList',
  components: { AtletaForm },
  setup() {
    const { atletas, fetchAtletas, removeAtleta } = useAtletas();
    const { ciudades, fetchCiudades } = useCiudades();
    const showForm = ref(false);
    const selectedAtleta = ref(null);

    const cargarAtletas = () => fetchAtletas();
    const cargarCiudades = () => fetchCiudades();

    const nuevoAtleta = () => {
      selectedAtleta.value = null;
      showForm.value = true;
    };

    const editar = (a) => {
      selectedAtleta.value = a;
      showForm.value = true;
    };

    const cerrarForm = () => (showForm.value = false);

    const eliminar = async (atleta) => {
      console.log('Eliminando atleta:', atleta);
      
      const atletaId = atleta?.id || atleta?._id;
      
      if (!atleta || !atletaId) {
        console.error('Datos del atleta incompletos o ID no encontrado:', atleta);
        alert('Error: No se pudo identificar correctamente al atleta a eliminar');
        return;
      }
      
      if (confirm(`¿Estás seguro de que deseas eliminar a ${atleta.nombre} (${atleta.dni})?`)) {
        try {
          console.log('ID a eliminar:', atletaId);
          const result = await removeAtleta(atletaId);
          
          if (result && result.success) {
            console.log('Atleta eliminado correctamente');
            await cargarAtletas();
          } else {
            const errorMsg = result?.error || 'Error al eliminar el atleta';
            console.error('Error en la respuesta:', result);
            alert(errorMsg);
          }
        } catch (err) {
          console.error('Error al eliminar atleta:', err);
          alert('Error al conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.');
        }
      }
    };

    onMounted(() => {
      cargarAtletas();
      cargarCiudades();
    });

    return {
      atletas,
      ciudades,
      showForm,
      selectedAtleta,
      nuevoAtleta,
      editar,
      cerrarForm,
      eliminar,
      cargarAtletas
    };
  }
};
</script>
