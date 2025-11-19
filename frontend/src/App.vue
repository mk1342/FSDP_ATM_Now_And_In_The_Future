<script setup>
    import { ref, onMounted } from 'vue'
    import axios from 'axios'

    const user = ref(null)
    const loading = ref(true)
    const error = ref(null)

    // MongoDB ObjectId here; SHOULD BE DYNAMIC, BUT I LAZY
    const userId = "691b674d5674016195ca9583" //or whatever the id is in mongoDB 

    onMounted(async () => {
        try {
            const res = await axios.get(`http://localhost:3000/users/${userId}`)
            user.value = res.data
        } catch (err) {
            error.value = err.message
        } finally {
            loading.value = false
        }
    })
</script>

<template>
  <div style="padding:20px; font-family: monospace;">

    <h2>Raw User JSON</h2>

    <div v-if="loading">Loading...</div>
    <div v-if="error">Error: {{ error }}</div>

    <!-- This prints the raw JSON nicely formatted -->
    <pre v-if="user">{{ JSON.stringify(user, null, 2) }}</pre>

  </div>
</template>

<style>
body {
  margin: 0;
  background: #fafafa;
}
</style>
