<template>
  <div id="app">
    <Header class="header">
      <div class="logo">Vue-Konva-Project</div>
      <div class="nav">
        <router-link to="/">创建模板</router-link> |
        <router-link to="/material">渲染模板</router-link>
      </div>
    </Header>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100vh;
  overflow: hidden;
}
.header {
  color: #fff;
  font-size: 18px;
  display: flex;
  justify-content: space-between;
}
.nav a {
  color: #fff;
  font-size: 14px;
}
.nav a:hover, .nav .router-link-exact-active {
  color: #57a3f3;
}
</style>
