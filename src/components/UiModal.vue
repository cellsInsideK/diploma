<script setup lang="ts">
  const visible = defineModel()

  const handleOverlay = () => {
    visible.value = false;
  }
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="modal-overlay" @click.self="handleOverlay">
      <div class="modal">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
  .modal-overlay {
    position: fixed;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal {
    background-color: rgb(226, 217, 200);
    font-size: 18px;
    width: 450px;
    padding: 40px;
    border-radius: 20px;
  }

  @media (max-width: 1000px) {
    .modal {
      width: 320px;
      padding: 15px;
    }
  }
</style>