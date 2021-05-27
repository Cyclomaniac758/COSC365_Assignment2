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
    <el-form ref="registration" :model="registration" :rules="regRules">
      <el-form-item label="First Name" prop="firstName">
        <el-input v-model="registration.firstName"></el-input>
      </el-form-item>
      <el-form-item label="Last Name" prop="lastName">
        <el-input v-model="registration.lastName"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model="registration.email"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="registration.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('registration')">Register</el-button>
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
      regRules: {
        firstName: [
          { required: true, message: 'First Name is required', trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: 'Last Name is required', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' }
        ],
        password: [
          { required: true, min: 8, message: 'Length should be at least 8', trigger: 'blur' }
        ]
      },
      registerVisible: false,
    }

  },
  methods: {
    async submitForm(formName) {

      console.log(this.registration)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const firstName = this.registration['firstName'];
          let lastName = this.registration['lastName'];
          let email = this.registration['email'];
          let password = this.registration['password'];
          this.axios.post('http://localhost:4941/api/v1/users/register',
              {firstName, lastName, email, password}
            )
              .then((res) => {

                console.log(res);
              }).catch((error) => {
                alert('Invalid Email');
                console.log(error)
          })
        }
      })
    }
  },
}
</script>

.el-header {
padding: 5px;
color: rgb(255,255,255);
}
