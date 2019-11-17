<template>
  <div class="modules">
    <vue-headful title="Monitorer - Пристрої"/>
    <v-container class="fill-height" fluid>
      <v-row class="shrink" align="center" justify="center">
        <v-dialog v-model="deleteDialog" persistent max-width="500px">
          <v-card>
            <v-card-title class="headline">Видалити назавжди?</v-card-title>
            <v-card-text>
              <h2>Пристрій: {{editedItem.title}}</h2>
              <h3>Опис: {{editedItem.description}}</h3>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="close">Відміна</v-btn>
              <v-btn color="primary" text @click="deleteItem">Видалити</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="headline">{{editedIndex>-1?'Редагувати пристрій':'Додати пристрій'}}</span>
            </v-card-title>

            <v-card-text>
              <v-form ref="form">
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field v-model="editedItem.title" label="Назва"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field v-model="editedItem.externalId" label="ІD"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field v-model="editedItem.description" label="Опис"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close()">Відміна</v-btn>
              <v-btn color="blue darken-1" text @click="save()">Зберегти</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="devices"
            :items-per-page="-1"
            :header-props="{
        sortByText: 'Відсортувати'
      }"
            :footer-props="{
        
        itemsPerPageText: 'К-сть записів',
        itemsPerPageAllText: 'Всі'
      }"
            class="elevation-1"
          >
            <template
              v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }"
            >{{ pageStart }} - {{ pageStop }} з {{ itemsLength }}</template>
            <template
              v-slot:item.createdAt="{ item }"
            >{{ $moment(item.createdAt).format('DD/MM/YYYY HH:mm') }}</template>
            <template v-slot:item.action="{ item }">
              <v-icon class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>

              <v-icon @click="deleter(item)">mdi-delete-forever</v-icon>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <v-btn fixed fab bottom right light large @click="editItem()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  name: "modules",
  data() {
    return {
      headers: [
        {
          text: "Пристрій",
          align: "left",
          value: "title"
        },
        { text: "Опис", value: "description" },
        { text: "ID", value: "externalId" },
        { text: "Дата створення", value: "createdAt" },
        { text: "Дії", value: "action", sortable: false }
      ],

      devices: [],
      editedItem: {
        _id: "",
        title: "",
        externalId: "",
        description: ""
      },
      editedIndex: -1,
      dialog: false,
      deleteDialog: false
    };
  },

  created() {
    this.getDevices();
    //this.getLastLog();
    //this.$mqtt.publish('param/param/param/test', 'message')
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
    editItem(item) {
      this.editedIndex = this.devices.indexOf(item);
      //console.log("INDEX", this.editedIndex)
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem() {
      let vm = this;
      this.$axios
        .delete("device/" + this.editedItem._id)
        .then(function(response) {
          if (response.data) {
            vm.deleteDialog = false;
          }
        });
      this.$delete(this.devices, this.editedIndex);
    },

    deleter(item) {
      this.editedItem = Object.assign({}, item);
      this.editedIndex = this.devices.indexOf(item);
      this.deleteDialog = true;
    },

    close() {
      this.dialog = false;
      this.deleteDialog = false;
      this.editedItem = Object.assign({}, {});
      this.editedIndex = -1;
    },
    save() {
      if (this.editedIndex > -1) {
        let vm = this;
        Object.assign(vm.devices[vm.editedIndex], vm.editedItem);

        this.$axios.patch("device/" + this.editedItem._id, {
          updateData: [
            {
              propName: "title",
              value: vm.editedItem.title
            },
            {
              propName: "externalId",
              value: vm.editedItem.externalId
            },
            {
              propName: "description",
              value: vm.editedItem.description
            }
          ]
        });
        vm.close();
      } else {
        let vm = this;

        this.$axios
          .post("device/", {
            title: vm.editedItem.title,
            externalId: vm.editedItem.externalId,
            description: vm.editedItem.description
          })
          .then(function(response) {
            console.log(response);
            vm.devices.push(response.data.document);
          });
        vm.close();
      }
    }
  }
};
</script>
