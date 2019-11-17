<template>
  <div class="modules">
    <vue-headful title="Monitorer - Логи"/>
    <v-container class="fill-height" fluid>
      <v-row class="shrink" align="center" justify="center">
        <v-col>
          <v-card>
            <v-card-title>
              Логи
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Пошук"
                single-line
                hide-details
              ></v-text-field>
            </v-card-title>
            <v-data-table
              :headers="headers"
              :items="records"
              :custom-filter="filterLogs"
              :search="search"
              class="elevation-1"
              :header-props="{
        sortByText: 'Відсортувати'
      }"
              :footer-props="{
        
        itemsPerPageText: 'К-сть записів',
        itemsPerPageAllText: 'Всі'
      }"
            >
              <template
                v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }"
              >{{ pageStart }} - {{ pageStop }} з {{ itemsLength }}</template>
              <template v-slot:item.device="{ item }">
                <span
                  class="title text-center"
                  v-if="findDevice(item.externalId)"
                >{{findDevice(item.externalId).title}}</span>
                <span class="subtitle-1">(ID: {{item.externalId}})</span>
              </template>
              <template v-slot:item.data="{ item }">{{JSON.parse(item.data)}}</template>
              <template
                v-slot:item.createdAt="{ item }"
              >{{ $moment(item.createdAt).format('DD/MM/YYYY HH:mm') }}</template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "records",
  data() {
    return {
      headers: [
        {
          text: "Пристрій",
          align: "left",
          value: "device"
        },
        { text: "Дані", value: "data", sortable: false },
        { text: "Дата", value: "createdAt" }
      ],

      records: [],
      devices: [],
      search: ""
    };
  },

  created() {
    this.getRecords();
    this.getDevices();
  },
  methods: {
    getDevices() {
      let vm = this;
      vm.$axios
        .get("device")
        .then(function(response) {
          // handle success
          vm.devices = response.data.devices;
          console.log(response);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .finally(function() {
          // always executed
        });
    },
    getRecords() {
      let vm = this;
      vm.$axios
        .get("record")
        .then(function(response) {
          // handle success
          vm.records = response.data.records;
          console.log(response);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        })
        .finally(function() {
          // always executed
        });
    },
    findDevice(id) {
      console.log(id);
      return _.find(this.devices, function(o) {
        return o.externalId == id;
      });
    },

    filterLogs(value, search, item) {
      let vm = this;
      //console.log(`Value - ${value}, Item - ${item}, Search - ${search}`)
      return (
        value != null &&
        search != null &&
        typeof value === "string" &&
        value
          .toString()
          .toLowerCase()
          .indexOf(search) !== -1
      );
      //  return vm.logs.filter((i) => {
      //   return vm.$date_format(vm.$date_json(i.createdAt), 'dd/MM/yyyy').toString() == search.toString().toLowerCase();
      // })
    }
  }
};
</script>
