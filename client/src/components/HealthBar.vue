<template>
    <div class="health-bar">
        Health: {{health}}
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class HealthBar extends Vue {
    public isDead: boolean = false;

    private maxHealth: number = 100;

    // public get health() {
    //     return this.$store.getters
    // }

    public created() {

    }

    public updateHealth() {
        // UPDATE PLAYER HEALTH WHEN EVENT EMITTED
    }
}
</script>