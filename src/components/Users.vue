<template>
  <div id="main" v-if="auth">
    <el-container style="width: 100%" v-model="user">
      <el-header height="20%">
        <div style="display: grid; grid-auto-columns: 50% 50%; width: 100%">
          <div style="text-align: center;">
            <el-col style="font-weight: bold; font-family: Helvetica; font-size: 40px">{{user.firstName}}</el-col>
          </div>
          <div style="text-align: center;">
            <el-col style="font-weight: bold; font-family: Helvetica; font-size: 40px">{{user.lastName}}</el-col>
          </div>
        </div>
        <el-row>
          <el-image align="left" :src="'http://localhost:4941/api/v1/users/' + userId + '/image'" onerror="this.src = 'https://thepeakid.com/wp-content/uploads/2016/03/default-profile-picture.jpg'" fit="fill" style="width: 100px; height: 100px; border: thin solid #DCDFE6; border-radius: 5px"></el-image>
        </el-row>
        <el-row>
          Email: {{user.email}}
        </el-row>
      </el-header>
    </el-container>
  </div>
  <div v-if="!auth">
    You are not logged in as this user!
  </div>
</template>

<script>
export default {
  name: "Users.vue",
  data() {
    return {
      user: '',
      userId: '',
      auth: this.$route.params.id === localStorage.getItem('userId')
    }
  },
  mounted() {
    this.axios.get('http://localhost:4941/api/v1/users/' + localStorage.getItem('userId'), {headers: {'X-Authorization': localStorage.getItem('token')}})
    .then((res) => {
      this.user = res.data;
      this.userId = localStorage.getItem('userId');
      console.log(this.$route.params.id);
    })
  }
}
</script>

<style scoped>
#main {
  font-family: 'Ubuntu', sans-serif;

  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto;
  grid-row-gap: 1em;
  max-width: 95%;
  height: 600px;
  background-color: white;
  margin: 1em auto;
  padding: 0.5em 0 0.5em 0;
  border-radius: 20px;
  border: 2px solid rgba(0, 0, 0, 0.02);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15);
}
</style>