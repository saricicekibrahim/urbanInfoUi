<template>
	<div>

		<div id="entrancePanel" class="sidenav">

			<div class="panel-header sticky-top" style="background-color: white;"><h1>KAPILAR<a href="#" class="closebtn" v-on:click="openPanel()"><i class="fa fa-chevron-left"></i></a></h1></div>
			<form class="searchForm row form-horizontal">
				             
                <div class="col-8">
				<input v-model="entranceSearchTxt" class="form-control" type="text" aria-label="Ara" placeholder="Kapı No Yazınız">
                </div>
                <div class="col-4">
				<button v-on:click="fetchEntrances($event)" class="btn btn-outline-success" type="submit">Ara</button>
                
              </div>
              </form>
              

			<br>
			<loading-screen ref="loadingScreen" :loadingText="loadingTextTr">
				<table v-if="entrances.length > 0" class="table table-striped">
					<thead>
						<tr>
							<th>Kapı No</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="entrance in entrances">
							<td>
								<button v-on:click="zoomEntrance(entrance.geometry, entrance.properties.bina_no)" type="button" class="btn btn-outline-info btn-sm" href="#" data-toggle="tooltip" title="Göster!">{{entrance.properties.bina_no}}</button>
							</td>
						</tr>
					</tbody>
				</table>	
			</loading-screen>
		</div>

	</div>
</template>

<script>
import LoadingScreen from "vue-loading-screen";

export default {
  name: "Panel",
  data() {
    return {
      entrances: [],
      collapsed: false,
      searchLayer: null,
      entranceSearchTxt: null
    };
  },
  props: {
    loadingTextTr: {
      type: String,
      default: "Lütfen Bekleyiniz!"
    }
  },
  methods: {
    openPanel() {
      if (this.collapsed) {
        $("#entrancePanel")[0].style.width = 0;
        this.collapsed = false;
      } else {
        $("#parcelPanel")[0].style.width = 0;
        $("#roadPanel")[0].style.width = 0;
        let windowWidth = document.documentElement.clientWidth;
        if (windowWidth <= 1000) {
          $("#entrancePanel")[0].style.width = windowWidth + "px";
        } else {
          $("#entrancePanel")[0].style.width = windowWidth / 4 + "px";
        }

        this.collapsed = true;
        this.$parent.$refs.parcel.collapsed = false;
        this.$parent.$refs.road.collapsed = false;
      }
    },
    zoomEntrance(argGeometry, argName) {
      if (this.searchLayer != null) {
        this.$parent.map.removeLayer(this.searchLayer);
      }
      this.searchLayer = L.geoJSON(argGeometry);
      this.searchLayer.addTo(this.$parent.map);
      this.$parent.map.fitBounds(this.searchLayer.getBounds());
      this.searchLayer.bindPopup("En şirin kapı benim " + argName).openPopup();
    },
    fetchEntrances(event) {
      event.preventDefault();
      this.entrances = [];
      let url = this.dataUrl + "entrance";

      if (this.entranceSearchTxt) {
        url +=
          "&CQL_FILTER=bina_no LIKE '%25" + this.entranceSearchTxt.toLocaleUpperCase('tr-TR') + "%25'";
      }

console.log(url);
      const p = this.$http.get(url);
      this.$refs.loadingScreen.load(p);
      p.then(function(response) {
        let entranceFeatures = [];
        $.each(response.body.features, function(key, value) {
          entranceFeatures.push(value);
        });
        this.entrances = entranceFeatures;
      });
    }
  },
  components: {
    LoadingScreen
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidenav {
  height: 100%;
  width: 0;
  position: fixed;
  z-index: 500;
  top: 55px;
  left: 0;
  background-color: white;
  overflow-x: hidden;
  transition: 0.5s;
  margin-top: 2px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 3);
  opacity: 0.9;
}

.sidenav .closebtn {
  position: absolute;
  margin-top: 10px;
  right: 15px;
  font-size: 24px;
  margin-left: 50px;
  color: black;
}

.panel-header {
  box-shadow: 0 0 5px rgba(0, 0, 0, 1);
}

.table td,
th {
  text-align: center;
}
.searchForm {
  margin-left: 20px;
  width: 100%;
}
</style>
