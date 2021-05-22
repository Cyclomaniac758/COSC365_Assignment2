<template>
  <el-main id="main">
    <el-row>
      <el-col :span="10">
        <div class="grid-content">dfthed</div>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
export default {
name: "Event.vue"
}
</script>

<style scoped>
#main {
  font-family: 'Ubuntu', sans-serif;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto;
  grid-row-gap: 1em;

  max-width: 95%;
  background-color: white;
  margin: 1em auto;
  padding: 0.5em 0 0.5em 0;
  border-radius: 20px;
  border: 2px solid rgba(0, 0, 0, 0.02);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
}
.el-row {
  margin-bottom: 20px;
&:last-child {
   margin-bottom: 0;
 }
}
</style>