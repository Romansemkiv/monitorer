<template>
  <v-app>
    <vue-headful title="Monitorer"/>
    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list dense>
        <v-list-item @click="changeRoute('Scenes')">
          <v-list-item-action>
            <v-icon large>mdi-cards-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">Сцени</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="changeRoute('Devices')">
          <v-list-item-action>
            <v-icon large>mdi-chip</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">Пристрої</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="changeRoute('Records')">
          <v-list-item-action>
            <v-icon large>mdi-format-list-bulleted-square</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="subtitle-1">Логи</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Monitorer</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer app>
      <span>Семенишин Олег &copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null
  }),
  created() {},
  sockets: {
    connect() {
      // Fired when the socket connects.
      this.isConnected = true;
    },

    disconnect() {
      this.isConnected = false;
    },

    // Fired when the server sends something on the "messageChannel" channel.
    messageChannel(data) {
      this.socketMessage = data;
    }
  },
  methods: {
    changeRoute(routeName) {
      return this.$router.push({ name: routeName });
    }
  }
};
</script>
