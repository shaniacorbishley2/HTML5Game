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
        return this.$store.getters['playerModule/mainPlayerName'];
    }

    public set playerName(name: string) {
        this.$store.dispatch('playerModule/submitMainPlayerName', name);
    }

    public updated() {
        this.scaleInput();

        window.addEventListener("resize", () => {
            this.scaleInput();
        });
    }

    public showNameInput() {
        if (this.scene && this.scene.scene.isActive('mainMenuScene') && this.scene.scene.isVisible('mainMenuScene')) {
            return true;
        }
        return false;
    }

    private get scene(): Phaser.Scene | null {
        return this.$store.getters['playerModule/scene'];
    }

    private scaleToGameWidth(elementName: string, percent: number) {
        if (document !== null && document.getElementById(elementName)) {
            const width = this.gameWidth * percent;
            document.getElementById(elementName).style.width = `${width}px`;
        }
    }

    private scaleToGameHeight(elementName: string, percent: number) {
        if (document !== null && document.getElementById(elementName)) {
            const height = this.gameHeight * percent;
            document.getElementById(elementName).style.height = `${height}px`;
        }
    }

    private scaleFontSize(elementName: string, percent: number) {
        if (document !== null && document.getElementById(elementName)) {
            const fontSize = document.getElementById(elementName).getBoundingClientRect().height * percent;
            document.getElementById(elementName).style.fontSize = `${fontSize}px`;
        }
    }

    private scaleInput() {
        if (document !== null && document.getElementById('game-container')) {
            this.gameWidth = document.getElementById('game-container').getBoundingClientRect().width
            this.gameHeight = document.getElementById('game-container').getBoundingClientRect().height;

            this.scaleToGameWidth('name-input', 0.2);
            this.scaleToGameHeight('name-input', 0.05);
            this.scaleFontSize('name-input', 0.35);
        }
    }

}
</script>