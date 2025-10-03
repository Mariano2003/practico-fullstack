<template>
  <BaseModal @close="$emit('close')">
    <template #header>
      <h2>{{ atleta && atleta.nombre ? 'Editar Atleta' : 'Nuevo Atleta' }}</h2>
    </template>
    <form @submit.prevent="handleSubmit">
      <div>
        <label>DNI:</label>
        <input v-model="form.dni" type="text" required :disabled="!!atleta" pattern="\d{7,8}" />
      </div>

      <div>
        <label>Nombre:</label>
        <input v-model="form.nombre" required />
      </div>

      <div>
        <label>Tiempo (HH:MM:SS):</label>
        <input v-model="form.tiempo" type="text" placeholder="00:00:00" required />
      </div>

      <div>
        <label>Posición:</label>
        <input v-model.number="form.posicion" type="number" min="1" required />
      </div>

      <div>
        <label>Ciudad:</label>
        <select v-model="form.ciudadId" required>
          <option value="">Seleccione una ciudad</option>
          <option v-for="c in ciudades" :key="c._id" :value="c._id">{{ c.nombre }}</option>
        </select>
      </div>

      <div v-if="error" style="color:red">{{ error }}</div>

      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="btn btn-secondary">Cancelar</button>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </div>
    </form>
  </BaseModal>
</template>

<script>
import { reactive, ref, onMounted, toRefs, watch } from 'vue';
import BaseModal from '../components/BaseModal.vue';
import { useAtletas } from '../composables/useAtletas.js';
import { useCiudades } from '../composables/useCiudades.js';
import { getAtletas } from '../Services/atletasService';

export default {
  name: 'AtletaForm',
  components: { BaseModal },
  props: {
    atleta: {
      type: Object,
      default: null
    }
  },
  setup(props, { emit }) {
    const { atleta } = toRefs(props);
    const { addAtleta, updateAtleta } = useAtletas();
    const { ciudades, fetchCiudades } = useCiudades();
    const error = ref('');

    const form = reactive({
      dni: '',
      nombre: '',
      tiempo: '',
      posicion: 1,
      ciudadId: ''
    });

    const cargarDatosAtleta = () => {
      if (atleta.value) {
        form.dni = atleta.value.dni || '';
        form.nombre = atleta.value.nombre || '';
        form.tiempo = atleta.value.tiempo || '';
        form.posicion = atleta.value.posicion || 1;
        form.ciudadId = atleta.value.ciudad?._id || atleta.value.ciudadId || '';
      }
    };

    const validarFormulario = () => {
      error.value = '';
      
      const dniStr = String(form.dni || '');
      
      if (!dniStr) return 'El DNI es requerido';
      if (!form.nombre?.trim()) return 'El nombre es requerido';
      if (!form.tiempo?.trim()) return 'El tiempo es requerido';
      if (!form.ciudadId) return 'Debe seleccionar una ciudad';
      
      if (!/^\d{7,8}$/.test(dniStr)) {
        return 'El DNI debe contener 7 u 8 dígitos';
      }
      
      if (!/^\d{2}:\d{2}:\d{2}$/.test(form.tiempo)) {
        return 'El tiempo debe estar en formato HH:MM:SS (ej: 01:30:45)';
      }
      
      return null;
    };

    const handleSubmit = async () => {
      error.value = '';
      const errorValidacion = validarFormulario();
      if (errorValidacion) {
        error.value = errorValidacion;
        return;
      }
      
      try {
        const atletaData = {
          dni: form.dni,
          nombre: form.nombre,
          tiempo: form.tiempo,
          posicion: form.posicion,
          ciudadId: form.ciudadId
        };
        
        if (atleta.value?._id) {
          const dniAnterior = String(atleta.value.dni || '');
          const dniNuevo = String(form.dni || '');
          
          if (dniAnterior !== dniNuevo) {
            const existeAtleta = await verificarAtletaExistente(dniNuevo);
            if (existeAtleta) {
              throw { 
                message: 'Ya existe un atleta con este DNI', 
                isDuplicateDNI: true 
              };
            }
          }
          
          await updateAtleta(atleta.value._id, atletaData);
        } else {
          const existeAtleta = await verificarAtletaExistente(String(form.dni));
          if (existeAtleta) {
            throw { 
              message: 'Ya existe un atleta con este DNI', 
              isDuplicateDNI: true 
            };
          }
          // Crear nuevo atleta
          await addAtleta(atletaData);
        }
        
        emit('saved');
        emit('close');
      } catch (err) {
        // Mostrar mensaje de error específico para DNI duplicado
        if (err.isDuplicateDNI || err.response?.status === 409 || err.message?.includes('Ya existe un atleta')) {
          error.value = 'Ya existe un atleta con este DNI. Por favor, verifica los datos.';
        } else {
          error.value = err.message || 'Error al guardar el atleta. Por favor, inténtalo de nuevo.';
        }
      }
    };

    onMounted(async () => {
      try {
        await fetchCiudades();
        cargarDatosAtleta();
      } catch (err) {
        error.value = 'Error al cargar los datos necesarios';
      }
    });
    
    watch(() => props.atleta, cargarDatosAtleta);
    
    const verificarAtletaExistente = async (dni) => {
      try {
        const dniStr = String(dni || '');
        if (!dniStr) return false;
        
        const atletas = await getAtletas();
        
        return atletas.some(a => {
          if (atleta.value?._id && a._id === atleta.value._id) {
            return false;
          }
          return String(a.dni) === dniStr;
        });
      } catch (err) {
        console.error('Error al verificar atleta existente:', err);
        return false;
      }
    };

    return {
      form,
      ciudades,
      error,
      handleSubmit
    };
  }
};
</script>

<style scoped>
.form-actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

.btn:hover {
  opacity: 0.9;
}

div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
</style>
