<template>
  <div class="home">
    <VideoScore msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import VideoScore from "@/components/VideoScore.vue";

export default {
  name: "home",
  components: {
    VideoScore
  }
};
</script>
