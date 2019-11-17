<template>

  <div class="scene">
    <vue-headful title="Monitorer - Сцени"/>
    <v-container class="fill-height" fluid>
      <v-row v-if="scenes.length>0">
        <v-col v-for="(scene, index) in scenes" :key="scene._id" md="6" sm="12">
          <v-card class="mx-auto">
            <v-dialog v-model="deleteDialog" persistent max-width="500px">
              <v-card>
                <v-card-title class="headline">Видалити назавжди?</v-card-title>
                <v-card-text>
                  <h2>Модуль: {{editedItem.title}}</h2>
                  <h3>Опис: {{editedItem.description}}</h3>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="close">Відміна</v-btn>
                  <v-btn color="primary" text @click="deleteItem">Видалити</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialog" max-width="900px">
              <!-- <template v-slot:activator="{ on }">
              <v-icon @click="editItem(scene)" class="ma-2" large v-on="on">mdi-pencil</v-icon>
              </template>-->
              <v-card>
                <v-card-title>
                  <span class="headline">{{editedIndex>-1?'Редагувати сцену':'Додати сцену'}}</span>
                </v-card-title>

                <v-card-text>
                  <v-form ref="form">
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12">
                          <v-text-field v-model="editedItem.title" label="Назва"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-text-field v-model="editedItem.description" label="Опис"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-select
                            v-model="editedItem.device"
                            :items="devices"
                            item-text="title"
                            return-object
                            @change="selectDevice"
                            label="Виберіть пристрій"
                            single-line
                          ></v-select>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-row align="center">
                            <v-card class="mx-auto" max-width="900px">
                              <v-list-item-group multiple>
                                <v-list-item
                                  two-line
                                  v-for="param in editedItem.params"
                                  :key="param.prop"
                                >
                                  <template>
                                    <v-list-item-action>
                                      <v-checkbox
                                        v-if="editedIndex>-1"
                                        v-model="param.selected"
                                        color="primary"
                                        @change="!param.selected"
                                      ></v-checkbox>
                                      <v-checkbox
                                        v-else
                                        v-model="param.selected"
                                        color="primary"
                                        @change="!param.selected"
                                      ></v-checkbox>
                                    </v-list-item-action>

                                    <v-list-item-content>
                                      <v-list-item-action-text
                                        class="mr-3 subtitle-1"
                                      >Параметр: {{param.prop}}</v-list-item-action-text>
                                      <v-row>
                                        <v-col>
                                          <v-text-field
                                            v-model="param.title"
                                            label="Назва  параметру"
                                          ></v-text-field>
                                        </v-col>
                                         <v-col>
                                          <v-text-field
                                            v-model="param.suffix"
                                            label="Cуфікс"
                                          ></v-text-field>
                                        </v-col>
                                        <v-col>
                                          <v-text-field
                                            v-model="param.criticalVal"
                                            label="Критичне значення"
                                          ></v-text-field>
                                        </v-col>
                                        
                                      </v-row>
                                    </v-list-item-content>
                                  </template>
                                </v-list-item>
                              </v-list-item-group>
                            </v-card>
                          </v-row>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-row align="center">
                            <v-checkbox
                              v-model="editedItem.options.useIrwin"
                              hide-details
                              class="shrink mr-2 mt-0"
                              label="Визначати аномалії ?"
                            ></v-checkbox>
                          </v-row>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-row align="center">
                            <v-text-field
                              :disabled="!editedItem.options.useIrwin"
                              v-model="editedItem.options.irwinNum"
                              label="Введіть кількість значень"
                            ></v-text-field>
                          </v-row>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-row align="center">
                            <v-checkbox
                              v-model="editedItem.options.bar"
                              hide-details
                              class="shrink mr-2 mt-0"
                              label="Графіки?"
                            ></v-checkbox>
                          </v-row>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-row align="center">
                            <v-checkbox
                              v-model="editedItem.options.splitted"
                              :disabled="!editedItem.options.bar"
                              hide-details
                              class="shrink mr-2 mt-0"
                              label="Розділені графіки"
                            ></v-checkbox>
                          </v-row>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-row align="center">
                            <v-checkbox
                              v-model="editedItem.options.lastValue"
                              hide-details
                              class="shrink mr-2 mt-0"
                              label="Останнє значення"
                            ></v-checkbox>
                          </v-row>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <v-row align="center">
                            <v-checkbox
                              v-model="editedItem.options.limit"
                              :disabled="!editedItem.options.bar"
                              hide-details
                              class="shrink mr-2 mt-0"
                            ></v-checkbox>
                            <v-text-field
                              :disabled="!editedItem.options.limit"
                              v-model="editedItem.options.limitValue"
                              label="Введіть кількість значень"
                            ></v-text-field>
                          </v-row>
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

            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="headline">{{scene.title}}</v-list-item-title>
                <v-list-item-subtitle>{{scene.description}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-chip</v-icon>
              </v-list-item-icon>
              <v-list-item-subtitle>{{scene.device.title}}</v-list-item-subtitle>
            </v-list-item>

            <v-card-text v-if="scene.options.bar">
              <v-row no-gutters align="center">
                <v-col v-if="scene.options.splitted">
                  <div v-for="(param, index) in scene.params" :key="param.prop" md="6" sm="12">
                    <apexchart
                      type="area"
                      :options="options(param)"
                      :series="SplitSeries(param, scene)"
                    ></apexchart>
                  </div>
                </v-col>
                <v-col v-else>
                <div >
                  <apexchart
                    type="area"
                    :options="options()"
                    :series="OneSeries(scene.params, scene)"
                  ></apexchart>
                </div>
                </v-col>
              </v-row>
            </v-card-text>
            <span v-if="scene.options.useIrwin">
             
              <span v-for="(param, index) in scene.params"
                :key="param.prop">
              <v-card 
                 v-if="finder(scene._id, param.prop).abnormalValues.length>0"
                class="mx-2"
                color="#F9F9F9"
              >
                <row >
                  <v-card-title>
                    {{param.title}}, {{param.suffix}}
                    <v-spacer></v-spacer>
                    <div class="subtitle-2">Аномалії за методом Ірвіна</div>
                  </v-card-title>
                </row>
                <v-card-text>
                  <v-list  class="transparent">
                    <v-list-item
                      v-for="(abnormalValue, index) in finder(scene._id, param.prop).abnormalValues"
                      :key="abnormalValue"
                    >
                      <v-list-item-title>{{index+1}}.</v-list-item-title>
                      <v-list-item-subtitle
                        class="red--text subtitle-1"
                      >{{ abnormalValue.value.value }}</v-list-item-subtitle>
                      <v-list-item-subtitle
                        class="text-right"
                      >{{$moment(abnormalValue.value.date).format('DD/MM/YYYY HH:mm')}}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </span>
            </span>
            <v-card class="mx-2" color="#F9F9F9" v-if="scene.options.lastValue">
              <v-card-title>
                Останнє значення
                <v-spacer></v-spacer>
                <div class="subtitle-2">{{$moment(findLastLog(scene).createdAt).format('DD MMMM YYYY о HH:mm') }}</div>
              </v-card-title>
              <v-card-text>
                <v-list class="transparent">
                  <v-list-item v-for="(param, index) in scene.params" :key="param.prop">
                    <v-list-item-title>{{ param.title }} </v-list-item-title>
                    <v-list-item-subtitle
                      :class="checkForExcess(JSON.parse(findLastLog(scene).data)[param.prop], param.criticalVal)?'red--text':''"
                    >{{ JSON.parse(findLastLog(scene).data)[param.prop] }} {{param.suffix}}</v-list-item-subtitle>
                    <v-list-item-subtitle class="text-right">{{ param.criticalVal }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <v-card-actions>
             
              <v-icon class="ma-2" @click="editItem(scene)">mdi-pencil</v-icon>
              <v-divider vertical></v-divider>
              <v-icon class="ma-2" @click="deleter(scene)">mdi-delete-forever</v-icon>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-btn fixed fab bottom right large @click="editItem()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-container>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "scenes",
  data() {
    return {
      scenes: [],
      logs: [],
      devices: [],
      editedItem: {
        title: "",
        device: "",
        params: [],
        options: {
          lastValue: false,
          limit: false,
          limitValue: -1,
          useIrwin: false,
          irwinNum: 10,
          splitted: false,
          bar: false
        },
        description: ""
      },
      editedIndex: -1,
      dialog: false,
      deleteDialog: false,
      abnormalValues: []
    };
  },

  created() {
    this.getScenes();
    this.getDevices();
    
  },

  methods: {
    finder(id, prop) {
      return _.find(this.abnormalValues, function(o) {
        return o.scene == id && o.param == prop;
      });
    },

    findLastLog(scene) {
      return _.find(this.logs, function(l) {
        return l.externalId == scene.device.externalId;
      });
    },

    checkForExcess(value, controlValue) {
      if (controlValue && value) {
        let char = controlValue.split(" ")[0];
        let val = controlValue.split(" ")[1];
        switch (char) {
          case ">":
            if (Number(value) > Number(val)) return true;
            break;
          case "<":
            if (Number(value) < Number(val)) return true;
            break;
          case "=":
            if (Number(value) == Number(val)) return true;
            break;
          case ">=":
            if (Number(value) >= Number(val)) return true;
            break;
          case "<=":
            if (Number(value) <= Number(val)) return true;
            break;
        }
      } else {
        return false;
      }
    },

    irwinMethod(scene, param) {
      let vm = this;

      vm.$axios
        .get(
          "record/device/" +
            scene.device.externalId +
            "/" +
            scene.options.irwinNum
        )
        .then(function(response) {
          let values = [];
          let lamb = 0;
          if (scene.options.irwinNum >= 0 && scene.options.irwinNum <= 10)
            (lamb = 1), 5;
          else (lamb = 1), 3;
          _.forEach(response.data.records, function(rec) {
            if (JSON.parse(rec.data).hasOwnProperty(param)) {
              
              if (Number(JSON.parse(rec.data)[param])) {
                values.push({
                  date: rec.createdAt,
                  value: Number(JSON.parse(rec.data)[param])
                });
              } else {
                values.push(0);
              }
            } else {
              values.push(0);
            }
          });
          let lambdas = [];
          let avg = 0;
          let total = 0;
          let tempD = 0;
          let D = 0;
          let gamma = 0;
          _.forEach(values, function(val, index) {
            total += val.value;
          });
          avg = total / values.length;
          
          _.forEach(values, function(val) {
            tempD += Math.pow(val.value - avg, 2);
          });
          D = tempD / (values.length - 1);
          
          gamma = Math.sqrt(D);
         
          _.forEach(values, function(val, index) {
            if (index > 0) {
              lambdas.push(
                Math.abs(values[index].value - values[index - 1].value) / gamma
              );
            } else {
              lambdas.push(0);
            }
          });
          let abnormalValues = [];
          _.forEach(lambdas, function(lambda, index) {
            if (lambda > lamb) {
              abnormalValues.push({ value: values[index], index: index });
            }
          });
          vm.abnormalValues.push({
            scene: scene._id,
            param: param,
            abnormalValues: abnormalValues
          });
          
        });
    },
    selectDevice() {
      let vm = this;

      vm.$axios
        .get("record/device/" + vm.editedItem.device.externalId)
        .then(function(response) {
          // handle success
          vm.log = response.data.record;

          _.forEach(JSON.parse(vm.log.data), function(value, key) {
            if (key != "abnormal") {
              if (
                !_.find(vm.editedItem.params, function(o) {
                  return o.prop == key;
                })
              ) {
                vm.editedItem.params.push({
                  title: "",
                  prop: key,
                  criticalVal: "",
                  suffix:"",
                  selected: false
                });
              }
            }
          });
        })
        .catch(function(error) {
          // handle error
          //console.log(error);
        })
        .finally(function() {
          // always executed
        });
    },
    getScenes() {
      let vm = this;
      //console.log(JSON.stringify({limit:10}));
      vm.$axios
        .get("scene")
        .then(function(response) {
          // handle success
          vm.scenes = response.data.scenes;
          _.forEach(vm.scenes, function(scene) {
            vm.getLastLog(scene);
            _.forEach(scene.params, function(param) {
              vm.irwinMethod(scene, param.prop);
            });
          });
          //console.log(vm.scenes);
          //vm.MQTTConnection();
        })
        .catch(function(error) {
          // handle error
          //console.log(error);
        })
        .finally(function() {
          // always executed
        });
    },
    getDevices() {
      let vm = this;
      //console.log(JSON.stringify({limit:10}));
      vm.$axios
        .get("device")
        .then(function(response) {
          // handle success
          vm.devices = response.data.devices;
          //console.log(vm.devices);
          //vm.MQTTConnection();
        })
        .catch(function(error) {
          // handle error
          //console.log(error);
        })
        .finally(function() {
          // always executed
        });
    },
    getLastLog(scene) {
      let vm = this;
      //console.log(JSON.stringify({limit:10}));
      vm.$axios
        .get("record/device/" + scene.device.externalId + "/1")
        .then(function(response) {
          vm.logs.push(response.data.records[0]);
        });
    },
    options(param) {
      let vm = this;
      var ua = require("../../node_modules/apexcharts/dist/locales/ua.json");
      let option = {
        chart: {
          locales: [ua],
          defaultLocale: "ua",
          stacked: true,

          zoom: {
            type: "x",
            enabled: true,
            autoScaleYaxis: true
          },
          toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: false,
          },
          autoSelected: 'zoom' 
        },
        },
        plotOptions: {
          line: {
            curve: "smooth"
          }
        },
        dataLabels: {
          enabled: false
        },

        markers: {
          size: 0,
          style: "full"
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.5,
            opacityTo: 0,
            stops: [0, 90, 100]
          }
        },
        yaxis: {
          title: {
            text: ""
          }
        },
        xaxis: {
          type: "datetime"
        },

        tooltip: {
          shared: true,
          y: {
            formatter: function(val) {
              return val;
            }},
            x: {
            formatter: function(val) {
              let d = vm.$moment(val).format('DD MMMM YYYY HH:mm'); 
              let date = d.split(' ');
              date[1] = date[1].charAt(0).toUpperCase() + date[1].substring(1);
              
              return date.join(' ')
            }
          }
        }
      };
    //   if(param.hasOwnProperty('title')){
    //   option = {...option, ...{
    // yaxis: {
    //       title: {
    //         text: param.title
    //       }
    //     },
    // }}
    //   }
      if(param){option.yaxis.title.text = param.title;}
      else{
        option.yaxis.title.text="";
      }
      //console.log('PARAM', param.title)

      return option;
    },
    OneSeries(params, scene) {
      let vm = this;
      // setInterval(function(){
      if (scene.options.bar) {
        let serie = [];
        vm.$axios
          .get(
            "record/device/" +
              scene.device.externalId +
              "/" +
              scene.options.limitValue
          )
          .then(function(response) {
            _.forEach(params, function(param) {
              let s = { data: [] };

              _.forEach(response.data.records, function(value) {
                s.data.push({
                  y: JSON.parse(value.data)[param.prop],
                  x: value.createdAt
                });
              });
              serie.push({ name: param.title, data: s.data });
            });
          });

        // setInterval(function(){

        // vm.$axios.get('record/device/'+scene.device.externalId+'/'+scene.options.limitValue)
        // .then(function (response) {
        //    _.forEach(params, function(param){
        //       let s={data:[]};
        //        _.forEach(response.data.records, function(value){
        //          s.data.push({y:JSON.parse(value.data)[param.prop], x: value.createdAt})
        //        })
        //        serie.push({name:param.title, data:s.data});
        //    })
        // })
        //  vm.$apexcharts.exec(scene._id+scene._id, 'updateSeries', serie)
        //  //console.log(vm.$refs.ch.updateSeries({ data: serie })
        //   serie=[];
        //   }, 3000);
        return serie;
      }
    },

    SplitSeries(param, scene) {
      let vm = this;
      let serie = [{ data: [], name: "" }];
      if (this.scenes.length > 0) {
        if (scene.options.bar) {
          vm.$axios
            .get(
              "record/device/" +
                scene.device.externalId +
                "/" +
                scene.options.limitValue
            )
            .then(function(response) {
              serie[0].name = param.title;
              _.forEach(response.data.records, function(value) {
                serie[0].data.push({
                  y: JSON.parse(value.data)[param.prop],
                  x: value.createdAt
                });
              });
            });
          //vm.$apexcharts.exec(index.toString()+scene._id.toString(), 'updateSeries', serie);
          //     setInterval(function(){
          //           vm.$axios.get('record/device/'+scene.device.externalId+'/'+scene.options.limitValue)
          //           .then(function (response) {
          // serie[0].name = param.title;
          // _.forEach(response.data.records, function(value){
          //       serie[0].data.push({y:JSON.parse(value.data)[param.prop], x: value.createdAt})
          //     })
          //           })
          //           vm.$apexcharts.exec(index.toString()+scene._id.toString(), 'updateSeries', serie);
          //           serie = [{data:[], name:''}];
          //           }, 3000)
        }
      }
      return serie;
    },
    editItem(item) {
      if (item) {
        this.editedIndex = this.scenes.indexOf(item);
        //console.log("INDEX", this.editedIndex)
        _.forEach(item.params, function(p) {
          p.selected = true;
        });
        Object.assign(this.editedItem, item);
        this.dialog = true;
      } else {
        //console.log('HELLO', this)
        this.dialog = true;
      }
    },

    deleteItem() {
      let vm = this;
      this.$axios
        .delete("scene/" + this.editedItem._id)
        .then(function(response) {
          if (response.data) {
            vm.deleteDialog = false;
          }
        });
      this.$delete(this.scenes, this.editedIndex);
    },

    deleter(item) {
      Object.assign(this.editedItem, item);
      this.editedIndex = this.scenes.indexOf(item);
      this.deleteDialog = true;
    },

    close() {
      this.dialog = false;
      this.deleteDialog = false;
      Object.assign(this.editedItem, {});
      this.editedIndex = -1;
    },
    save() {
      let vm = this;
      if (this.editedIndex > -1) {
        Object.assign(vm.scenes[vm.editedIndex], vm.editedItem);
        //console.log('EI',vm.editedItem);
        let parameters = [];
        _.forEach(vm.editedItem.params, function(param, key) {
          //console.log('PARAMETER',param,key);
          if (param.selected) {
            //    if(!_.find(vm.editedItem.params, function(o) { return o.prop == key })){
            //    parameters.push({title:param.title, prop: param.prop, criticalVal: param.criticalVal})}
            //  }
            //console.log('PARAMETER',param);

            parameters.push({
              title: param.title,
              prop: param.prop,
              criticalVal: param.criticalVal,
              suffix: param.suffix
            });
          }
        });
        this.$axios
          .patch("scene/" + this.editedItem._id, {
            updateData: [
              {
                propName: "title",
                value: vm.editedItem.title
              },
              {
                propName: "options",
                value: vm.editedItem.options
              },
              {
                propName: "params",
                value: parameters
              },
              {
                propName: "device",
                value: vm.editedItem.device._id
              },
              {
                propName: "description",
                value: vm.editedItem.description
              }
            ]
            //  title: vm.editedItem.title,
            // options: vm.editedItem.options,
            // device: vm.editedItem.device._id,
            // description:vm.editedItem.description,
            // params: parameters
          })
          .then(function(response) {
            vm.$set(vm.scenes, vm.editedIndex, response.data.updated);
          });
        vm.close();
      } else {
        let parameters = [];
        _.forEach(vm.editedItem.params, function(param) {
          if (param.selected) {
            parameters.push({
              title: param.title,
              prop: param.prop,
              criticalVal: param.criticalVal,
              suffix: param.suffix
            });
          }
        });

        this.$axios
          .post("scene/", {
            title: vm.editedItem.title,
            options: vm.editedItem.options,
            device: vm.editedItem.device._id,
            description: vm.editedItem.description,
            params: parameters
          })
          .then(function(response) {
            //console.log(response);
            vm.scenes.push(response.data.document);
          });
        vm.close();
      }
    }
  }
};
</script>
