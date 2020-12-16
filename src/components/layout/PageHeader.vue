<template>
    <header>
        <nav class="navbar navbar-dark navbar-expand-lg sticky-top bg-dark flex-md-nowrap p-0 shadow">
            <div class="container">
                <router-link
                  to="/"
                  class="navbar-brand">
                    Curson Test
                </router-link>
                <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/questions">Questions</router-link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
name: "PageHeader"
}
</script>
