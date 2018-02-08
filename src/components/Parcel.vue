<template>
	<div>

		<div id="parcelPanel" class="sidenav">

			<div class="panel-header sticky-top" style="background-color: white;"><h1>PARSELLER<a href="#" class="closebtn" v-on:click="openPanel()"><i class="fa fa-chevron-left"></i></a></h1></div>
			<form class="searchForm row form-horizontal">
				             
                <div class="col-8">
				<input v-model="parselSearchTxt" class="form-control" type="text" aria-label="Ara" placeholder="Ada/Parsel Yazınız">
                </div>
                <div class="col-4">
				<button v-on:click="fetchParcels($event)" class="btn btn-outline-success" type="submit">Ara</button>
                
              </div>
              </form>

			<br>
			<loading-screen ref="loadingScreen" :loadingText="loadingTextTr">
				<table v-if="parcels.length > 0" class="table table-striped">
					<thead>
						<tr>
							<th>Parsel</th>
							<th>Mahalle</th>
              <th>Çap</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="parcel in parcels">
							<td>
								<button v-on:click="zoomParcel(parcel.geometry, parcel.properties.ada_parsel)" type="button" class="btn btn-outline-info btn-sm" href="#" data-toggle="tooltip" title="Göster!">{{parcel.properties.ada_parsel}}</button>
							</td>
							<td>Aydınlıkevler</td>
								<td><button type="button" class="btn btn-outline-info btn-sm" href="#" data-toggle="tooltip" title="eÇap">eÇap</button>
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
      parcels: [],
      collapsed: false,
      searchLayer: null,
      parselSearchTxt: null
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
        $("#parcelPanel")[0].style.width = 0;
        this.collapsed = false;
      } else {
        $("#roadPanel")[0].style.width = 0;
        $("#entrancePanel")[0].style.width = 0;
        let windowWidth = document.documentElement.clientWidth;
        if (windowWidth <= 1000) {
          $("#parcelPanel")[0].style.width = windowWidth + "px";
        } else {
          $("#parcelPanel")[0].style.width = windowWidth / 4 + "px";
        }

        this.collapsed = true;
        this.$parent.$refs.road.collapsed = false;
        this.$parent.$refs.entrance.collapsed = false;
      }
    },
    zoomParcel(argGeometry, argName) {
      if (this.searchLayer != null) {
        this.$parent.map.removeLayer(this.searchLayer);
      }
      this.searchLayer = L.geoJSON(argGeometry);
      this.searchLayer.addTo(this.$parent.map);
      this.$parent.map.fitBounds(this.searchLayer.getBounds());
      this.searchLayer
        .bindPopup("En şirin parsel benim " + argName)
        .openPopup();
    },
    fetchParcels(event) {
      event.preventDefault();
      this.parcels = [];
      let url = this.dataUrl + "parcel";
      if (this.parselSearchTxt) {
        url +=
          "&CQL_FILTER=ada_parsel LIKE '%25" + this.parselSearchTxt + "%25'";
      }
      const p = this.$http.get(url);
      this.$refs.loadingScreen.load(p);
      p.then(function(response) {
        let parcelFeatures = [];
        $.each(response.body.features, function(key, value) {
          parcelFeatures.push(value);
        });
        this.parcels = parcelFeatures;
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
