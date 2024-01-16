<template>
  <div class="py-6">
    <h1 class="text-center text-3xl font-bold text-gray-600">
      Transperant Pricing, Real Data, Complete Price Breakdown {data.version}
    </h1>
    <UserRegistrationForm />
  </div>
</template>

<script setup lang="ts">
const { data } = await useAsyncGql({
  operation: "version",
});
</script>
