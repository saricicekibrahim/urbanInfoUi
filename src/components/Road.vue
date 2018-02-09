<template>
	<div>

		<div id="roadPanel" class="sidenav">

			<div class="panel-header sticky-top" style="background-color: white;"><h1>YOLLAR<a href="#" class="closebtn" v-on:click="openPanel()"><i class="fa fa-chevron-left"></i></a></h1></div>
			<form class="searchForm row form-horizontal">
				             
                <div class="col-8">
				<input v-model="roadSearchTxt" class="form-control" type="text" aria-label="Ara" placeholder="Yol Adı Yazınız">
                </div>
                <div class="col-4">
				<button v-on:click="fetchRoads($event)" class="btn btn-outline-success" type="submit">Ara</button>
                
              </div>
              </form>
              

			<br>
			<loading-screen ref="loadingScreen" :loadingText="loadingTextTr">
				<table v-if="roads.length > 0" class="table table-striped">
					<thead>
						<tr>
							<th>Yol Adı</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="road in roads">
							<td>
								<button v-on:click="zoomRoad(road.geometry, road.properties.adi)" type="button" class="btn btn-outline-info btn-sm" href="#" data-toggle="tooltip" title="Göster!">{{road.properties.adi}}</button>
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
      roads: [],
      collapsed: false,
      searchLayer: null,
      roadSearchTxt: null
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
        $("#roadPanel")[0].style.width = 0;
        this.collapsed = false;
      } else {
        $("#parcelPanel")[0].style.width = 0;
        $("#entrancePanel")[0].style.width = 0;
        let windowWidth = document.documentElement.clientWidth;
        if (windowWidth <= 1000) {
          $("#roadPanel")[0].style.width = windowWidth + "px";
        } else {
          $("#roadPanel")[0].style.width = windowWidth / 4 + "px";
        }

        this.collapsed = true;
        this.$parent.$refs.parcel.collapsed = false;
        this.$parent.$refs.entrance.collapsed = false;
      }
    },
    zoomRoad(argGeometry, argName) {
      if (this.searchLayer != null) {
        this.$parent.map.removeLayer(this.searchLayer);
      }
      this.searchLayer = L.geoJSON(argGeometry);
      this.searchLayer.addTo(this.$parent.map);
      this.$parent.map.fitBounds(this.searchLayer.getBounds());
      this.searchLayer.bindPopup("En şirin yol benim " + argName).openPopup();
    },
    fetchRoads(event) {
      event.preventDefault();
      this.roads = [];
      let url = this.dataUrl + "road";

      if (this.roadSearchTxt) {
        url +=
          "&CQL_FILTER=adi LIKE '%25" + this.roadSearchTxt.toLocaleUpperCase('tr-TR') + "%25'";
      }

console.log(url);
      const p = this.$http.get(url);
      this.$refs.loadingScreen.load(p);
      p.then(function(response) {
        let roadFeatures = [];
        $.each(response.body.features, function(key, value) {
          roadFeatures.push(value);
        });
        this.roads = roadFeatures;
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
