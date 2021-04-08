<template>
    <div class="health-bar">
        Health: {{this.health}}
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace } from 'vuex-class';

const PlayerModule = namespace('playerModule');

@Component({})
export default class HealthBar extends Vue {
    public isDead: boolean = false;

    private maxHealth: number = 100;

    @PlayerModule.Getter public health;
    
}
</script>