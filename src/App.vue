<template>
  <el-header height="auto" style="background: #1F74FF">
    <el-container>
      <el-aside width="70%">
        <div style="font-size: 30px; font-family: Helvetica; color: white; text-align: center; margin-top: 20px; display: grid; grid-template-columns: 40% 60%">
            <div v-if="loggedIn">
              <CreateEvent @createEvent="createEvent"></CreateEvent>
              <MyEvents @goToEvent="goToEvent"></MyEvents>
              <el-button v-if="$route.path=='/'" class="button" @click="goToUser">Account</el-button>
            </div>
            <el-label-wrap>
              Eventsy
            </el-label-wrap>
        </div>
      </el-aside>
      <el-main style="display: grid; grid-template-columns: auto auto auto;">
        <el-button class="button" align="right" @click="goHome()">
          Home
        </el-button>
        <el-button class="button" align="right" @click="registerVisible=true" v-if="!loggedIn">
          Register
        </el-button>
        <el-button class="button" align="right" @click="loginVisible=true" v-if="!loggedIn">
          Login
        </el-button>
        <el-button class="button" align="right" @click="logout()" v-if="loggedIn">
          Logout
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
      <el-upload
        action="#"
        class="avatar-uploader"
        :on-change="updateImage"
        :auto-upload="false"
        :limit="1"
        :before-remove="removeImage"
      >
        Upload Profile Image
      </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('registration')">Register</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog v-model="loginVisible" title="Log In" width="30%">
    <el-form ref="login" :model="login" :rules="logRules">
      <el-form-item label="Email" prop="email">
        <el-input v-model="login.email"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="login.password" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="checkLogin('login')">Login</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import MyEvents from "./components/MyEvents";
import CreateEvent from "./components/CreateEvent";
export default {
  components: {MyEvents, CreateEvent},
  data: function() {
    return {
      registration: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      },
      login: {
        email: '',
        password: ''
      },
      logRules: {
        email: [
          { required: true, message: 'Email is required', trigger: 'blur' }
        ],
        password: [
          { required: true, message: 'Length should be at least 8', trigger: 'blur' }
        ]
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
      loginVisible: false,
      userId: -1,
      auth: '',
      loggedIn: localStorage.getItem('token') !== null,
      image: '',
      uploadDisabled: false
    }

  },
  methods: {
    removeImage() {
      this.image = '';
    },
    updateImage(file) {
      this.image = file.raw;
    },
    createEvent() {

    },
    goToUser() {
      this.$router.push({path: '/users/' + localStorage.getItem('userId')})
    },
    goToEvent(val) {
      console.log(val);
      this.$router.push({path: '/'})
      this.$router.push({path: '/event/' +val});
      //location.reload();
    },
    goHome() {
      this.$router.push({path: '/'})
    },
    async submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const firstName = this.registration['firstName'];
          let lastName = this.registration['lastName'];
          let email = this.registration['email'];
          let password = this.registration['password'];
          let imageType = this.image['type'];
          console.log(imageType)
          if (imageType === 'image/jpeg' || imageType === 'image/jpg' || imageType === 'image/png' || imageType === 'image/gif' || imageType === undefined) {
            this.axios.post('http://localhost:4941/api/v1/users/register',
                {firstName, lastName, email, password}
            )
                .then((res) => {
                  this.userId = res.data.userId;
                  let email = this.registration['email'];
                  let password = this.registration['password'];
                  this.axios.post('http://localhost:4941/api/v1/users/login',
                      {email, password})
                      .then((res) => {
                        this.userId = res.data.userId;
                        this.token = res.data.token;
                        localStorage.setItem("token", this.token);
                        localStorage.setItem("userId", this.userId);
                        let image = this.image;
                        if (imageType !== undefined) {
                          this.axios.put('http://localhost:4941/api/v1/users/' + localStorage.getItem('userId') + '/image',
                              {image},
                              {
                                headers: {
                                  'X-Authorization': localStorage.getItem('token'),
                                  'Content-Type': imageType
                                }
                              }).then(() => {
                            this.registerVisible = false;
                            this.loginVisible = false;
                            this.loggedIn = true;
                            this.$router.push({path: '/'});
                          }) .catch((err) => {
                            console.log(err);
                          })
                        } else {
                          this.registerVisible = false;
                          this.loginVisible = false;
                          this.loggedIn = true;
                          this.$router.push({path: '/'});
                        }
                      }).catch(() => {
                    this.$message.warning('Invalid Email');
                  })
                })
          } else {
            this.$message.error('Incorrect image format')
          }
        }
      })
    },
    async logMeIn() {
      let email = this.login['email'];
      let password = this.login['password'];
      this.axios.post('http://localhost:4941/api/v1/users/login',
          {email, password})
          .then((res) => {
            this.userId = res.data.userId;
            this.token = res.data.token;
            console.log(this.auth);
            localStorage.setItem("token", this.token);
            localStorage.setItem("userId", this.userId);
            this.registerVisible = false;
            this.loginVisible = false;
            this.loggedIn = true;
            this.$router.push({path: '/'});
          }).catch(() => {
            this.$message.warning('incorrect email or password')
      })
    },
    checkLogin(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.logMeIn();
        }
      })
    },
    logout() {
      localStorage.clear();
      this.$router.push({path: '/'});
      location.reload();
    }
  },


}
</script>

<style>
.el-header {
  padding: 5px;
  color: #000;
}
.button {
  height: 25px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>