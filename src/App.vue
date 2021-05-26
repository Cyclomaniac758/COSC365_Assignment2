<template>
  <el-header height="auto" style="background: #1F74FF">
    <el-container>
      <el-aside width="80%">
        <div style="font-size: 30px; font-family: Helvetica; color: white; text-align: center; margin-top: 20px">
          EVENTSY
        </div>
      </el-aside>
      <el-main style="display: grid; grid-template-columns: auto auto;">
        <el-button align="right">
          Register
        </el-button>
        <el-button align="right">
          Login
        </el-button>
      </el-main>
    </el-container>
  </el-header>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

.el-header {
padding: 5px;
color: rgb(255,255,255);
}
