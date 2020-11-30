<template>
  <ErrorMessage error="Path not found" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default defineComponent({
  components: {
    ErrorMessage
  }
});
</script>
