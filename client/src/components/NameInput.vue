<template>
    <div class="name-input" v-if="this.showNameInput()">
        <input id="name-input" class="name-input__input" v-model="playerName" placeholder="Enter your name">  
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class NameInput extends Vue {
    public gameWidth: number | null = 0;

    public gameHeight: number | null = 0;


    public get playerName() {
        return this.$store.getters['playerModule/playerName'];
    }

    public set playerName(value: string) {
        this.$store.dispatch('playerModule/submitPlayerName', value);
    }

    public updated() {
        this.scaleInput();

        window.addEventListener("resize", () => {
            this.scaleInput();
        })
    }

    public showNameInput() {
        if (this.scene && this.scene.scene.isActive('mainMenuScene')) {
            return true;
        }
        return false;
    }

    private get scene(): Phaser.Scene | null {
        return this.$store.getters['playerModule/scene'];
    }

    private scaleToGameWidth(elementName: string, per: number) {
        if (document !== null && document.getElementById(elementName)) {

            var width = this.gameWidth * per;
            document.getElementById(elementName).style.width = `${width}px`;
        }
    }

    private scaleToGameHeight(elementName: string, per: number) {
        if (document !== null && document.getElementById(elementName)) {

            var height = this.gameHeight * per;
            document.getElementById(elementName).style.height = `${height}px`;
        }
    }

    private scaleInput() {
        if (document !== null && document.getElementById('game-container')) {
            this.gameWidth = document.getElementById('game-container').getBoundingClientRect().width
            this.gameHeight = document.getElementById('game-container').getBoundingClientRect().height;

            this.scaleToGameWidth('name-input', 0.2);
            this.scaleToGameHeight('name-input', 0.05);
        }
    }

}
</script>