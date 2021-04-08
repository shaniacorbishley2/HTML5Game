<template>
  <div class="main" :id="containerId" v-if="downloaded">
    <HealthBar/>
  </div>
  <div class="main" v-else>
    Downloading ...
  </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HealthBar from './HealthBar.vue';

@Component({
  components: { HealthBar }
})
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