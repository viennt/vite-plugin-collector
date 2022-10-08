<script setup>
import navigations from '~navigations'
</script>

<template>
    <div>
        <router-link v-for="navigation in navigations" :to="{ name: navigation.path }">
            {{ navigation.label }}
        </router-link>
    </div>

    <router-view></router-view>
</template>

<style scoped>
a {
    color: #FFFFFF;
    font-weight: bold;
    border-right: 2px solid #F8F8F2;
    padding: 0 12px;
    text-decoration: underline;
}

a:last-child {
    border-right: none;
}
</style>
