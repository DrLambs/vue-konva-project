<template>
  <div class="home">
    <Header style="color: #fff; font-size: 18px;">Vue-Konva-Project</Header>
    <CreateTemplate></CreateTemplate>
  </div>
</template>

<script>
import CreateTemplate from '@/components/Template/CreateTemplate'

export default {
  name: 'home',
  components: {
    CreateTemplate
  }
}
</script>
