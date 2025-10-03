<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content">
      <header class="modal-header">
        <slot name="header"></slot>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </header>
      <section class="modal-body">
        <slot></slot>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'BaseModal'
};
</script>

<style lang="css">
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  border-radius: 6px;
  padding: 1rem;
  min-width: 300px;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-body {
  margin-top: 1rem;
}
</style>
