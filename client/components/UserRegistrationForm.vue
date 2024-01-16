<template>
  <div>
    <div v-if="step === 1">
      <label>Email:</label>
      <input v-model="email" type="email" />
      <button @click="nextStep">Next</button>
    </div>

    <div v-else-if="step === 2">
      <label>Password:</label>
      <input v-model="password" type="password" />

      <template v-if="emailExists">
        <button @click="nextStep">Next</button>
      </template>

      <template v-else>
        <label>Confirm Password:</label>
        <input v-model="confirmPassword" type="password" />
        <button @click="nextStep">Next</button>
      </template>
    </div>

    <div v-else-if="step === 3">
      <label>OTP:</label>
      <input v-model="otp" type="text" />
      <button @click="verifyOTP">Verify</button>
    </div>

    <div v-else-if="step === 4">
      <label>First Name:</label>
      <input v-model="firstName" type="text" />
      <label>Last Name:</label>
      <input v-model="lastName" type="text" />
      <label>City:</label>
      <input v-model="city" type="text" />
      <button @click="submitForm">Submit</button>
    </div>
  </div>
</template>

<script>

export default {
  name: "OnboardingForm",
  data() {
    return {
      step: 1,
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
      firstName: "",
      lastName: "",
      city: "",
      emailExists: false, // Set to true if email exists
    };
  },
  methods: {
    nextStep() {
      this.step++;
    },
    verifyOTP() {
      // Implement OTP verification logic here
      // If OTP is valid, move to the next step
      this.nextStep();
    },
    submitForm() {
      // Implement form submission logic here
      // You can send the data to the server or perform any other actions
      console.log("Form submitted!");
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
