<template>
  <div class="main" :id="containerId" v-if="downloaded" />
  <div class="main" v-else>
    Downloading ...
  </div>
</template>


<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class Game extends Vue {
  public downloaded: boolean = false;
  public gameInstance: any = null;
  public containerId: string = 'game-container';
    
  async mounted() {
    const game = await import(/* webpackChunkName: "game" */ '../game/game');
    this.downloaded = true;
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId)
    })
  }

  destroyed() {
    this.gameInstance.destroy(false)
  }
}
</script>

<style lang="scss">
div {
  background-color: $red-g;
}
</style>