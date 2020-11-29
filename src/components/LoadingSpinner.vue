<template>
  <div class="spinner" />
</template>

<style scoped>
.spinner {
  width: 100px;
  height: 100px;
  margin: 2em auto;
  border-top: 5px solid;
  border-radius: 50%;
  animation: spinner .5s ease-out infinite;
}

@keyframes spinner {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
