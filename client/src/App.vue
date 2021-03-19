<template>
  <Game />
</template>

<script lang="ts">
import Game from './components/Game.vue';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  components: { Game }
})
export default class App extends Vue {
  
}
</script>