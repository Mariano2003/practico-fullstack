<template>
  <BaseModal @close="$emit('close')">
    <template #header>
      <h2>{{ ciudad?.nombre ? 'Editar Ciudad' : 'Nueva Ciudad' }}</h2>
    </template>

    <form @submit.prevent="guardar">
      <div>
        <label>Nombre:</label>
        <input v-model="form.nombre" type="text" required />
      </div>

      <div v-if="error" style="color:red">{{ error }}</div>

      <button type="submit">{{ ciudad?.nombre ? 'Actualizar' : 'Crear' }}</button>
      <button type="button" @click="$emit('close')">Cancelar</button>
    </form>
  </BaseModal>
</template>

<script lang="ts">
import { reactive, watch } from 'vue';
import { useCiudades } from '../composables/useCiudades';
import BaseModal from '../components/BaseModal.vue';

export default {
  name: 'CiudadForm',
  components: { BaseModal },
  props: { ciudad: Object },
  emits: ['close', 'refresh'],
  setup(props, { emit }) {
    const { addCiudad, updateCiudad } = useCiudades();
    const error = reactive({ value: null });
    const form = reactive({ nombre: '' });

    const cargarCiudad = () => {
      form.nombre = props.ciudad?.nombre || '';
    };

    const guardar = async () => {
      error.value = null;
      if (!form.nombre.trim()) {
        error.value = 'El nombre es requerido';
        return;
      }

      try {
        if (props.ciudad?._id) {
          await updateCiudad(props.ciudad._id, { nombre: form.nombre });
        } else {
          await addCiudad({ nombre: form.nombre });
        }
        emit('refresh');
        emit('close');
      } catch (err) {
        error.value = err.message || 'Error al guardar ciudad';
      }
    };

    watch(() => props.ciudad, cargarCiudad, { immediate: true });

    return { form, error, guardar };
  }
};
</script>

<style lang="css">
form {
  background-color: #fff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

form div {
  margin-bottom: 0.75rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 0.4rem 0.8rem;
  margin: 0 0.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #007BFF;
  color: #fff;
}

button[type="button"] {
  background-color: #6c757d;
  color: #fff;
}
</style>
