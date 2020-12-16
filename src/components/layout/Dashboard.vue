<template>
    <div>
        <page-header />
        <div class="container">
            <main>
                <h1 class="py-3">{{ pageTitle }}</h1>
                <router-view :key="$route.fullPath" />
            </main>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import PageHeader from "@/components/layout/PageHeader";
export default {
  name: "Dashboard",
  components: {
    PageHeader
  },
  computed: {
    ...mapState({
      pageTitle: state => state.pageTitle
    })
  }
}
</script>
