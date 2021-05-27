<template>
  <el-header height="auto" style="background: #1F74FF">
    <el-container>
      <el-aside width="80%">
        <div style="font-size: 30px; font-family: Helvetica; color: white; text-align: center; margin-top: 20px">
          EVENTSY
        </div>
      </el-aside>
      <el-main style="display: grid; grid-template-columns: auto auto;">
        <el-button align="right" @click="registerVisible=true">
          Register
        </el-button>
        <el-button align="right">
          Login
        </el-button>
      </el-main>
    </el-container>
  </el-header>
  <el-dialog v-model="registerVisible" title="Register" width="50%">
    <el-form ref="registration" :model="registration" >
      <el-form-item label="First Name">
        <el-input v-model="registration.firstName"></el-input>
      </el-form-item>
      <el-form-item label="Last Name">
        <el-input v-model="registration.lastName"></el-input>
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="registration.emial"></el-input>
      </el-form-item>
      <el-form-item label="Password">
        <el-input v-model="registration.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="checkRegister(); register()">Register</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>

export default {
  data: function() {
    return {
      registration: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',

      },
      registerVisible: false,
      email: '',
      validRegister: false
    }

  },
  methods: {
    async register() {

      console.log(this.registration)
      if (this.validRegister) {
        await this.axios.post('http://localhost:4941/api/v1/users/register', this.registration)
            .then((res) => {
              console.log(res);
            })
      } else {
        <el-alert type="error" title="Password must be at least 8 characters"></el-alert>
      }

    },
    checkRegister() {
      if (this.registration.password.length >= 8) {
        this.validRegister = true
      }
    }
  }
}
</script>

.el-header {
padding: 5px;
color: rgb(255,255,255);
}
