// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/google-fonts", "nuxt-graphql-client"],

  googleFonts: {
    families: {
      Rubik: {
        wght: [300, 400, 500],
        ital: [300, 400, 500],
      },
    },
  },
});
