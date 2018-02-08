<template>
	<div>

		<nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
			<a class="navbar-brand" href="#">Kent Rehberi</a><br>
			<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>

			<div class="collapse navbar-collapse" id="navbarsExampleDefault">
				<ul class="navbar-nav mr-auto">
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-search" aria-hidden="true"></i> Listele</a>
						<div class="dropdown-menu navDropDown" aria-labelledby="dropdown01">
							<a v-on:click="openParcelPanel()" class="nav-link" href="#"><i class="fa fa-th-large" aria-hidden="true"></i> Parsel - <i class="fa fa-file-text" aria-hidden="true"></i> eÇap</a>
							<a v-on:click="openEntrancePanel();" class="nav-link" href="#"><i class="fa fa-circle-o" aria-hidden="true"></i> Kapı</a>
							<a v-on:click="openRoadPanel();" class="nav-link" href="#"><i class="fa fa-exchange" aria-hidden="true"></i> Yol</a>
							<a v-on:click="alert();" class="nav-link" href="#"><i class="fa fa-map-pin" aria-hidden="true"></i> Önemli Nokta</a>
						</div>
					</li>
				</ul>
			</li>
			<form class="form-inline my-2 my-lg-0">
				<input class="form-control mr-sm-2" type="text" aria-label="Ara" placeholder="Mahalle, Parsel, Poi, vs...">
				<button class="btn btn-outline-success my-2 my-sm-0" type="submit" v-on:click="searchAll($event)">Ara</button>
			</form>
		</div>
	</nav>
	<div class="search-all text-center" v-if="searchedData.length > 0">
		<ul v-for="data in searchedData" class="list-group">
			<li v-on:click="alert();" class="list-group-item d-flex justify-content-between align-items-center">{{data.name}}
				<span class="badge badge-primary badge-pill">{{data.count}}</span></li>
			</ul>
			<button class="btn btn-outline-danger" v-on:click="clearSearchResult">Kapat</button>

		</div>

		<Parcel ref="parcel"/>
		<Road ref="road"/>
    <Entrance ref="entrance"/>
		<div id="map"/>

	</div>
</template>

<script>
    //scp -r /Users/saricicek/ibo\'s/codeIt/vueeee/urbanInfoUi/dist/ 51.140.72.184:/home/saricicek/urbanInfoUi/

import Parcel from "./Parcel";
import Road from "./Road";
import Entrance from "./Entrance";

export default {
  name: "Map",
  data: function() {
    return {
      map: null,
      searchedData: []
    };
  },
  mounted() {
    document.getElementById("map").style.height =
      document.documentElement.clientHeight - 57 + "px";
    this.map = L.map("map", {
      minZoom: 15,
      maxZoom: 19,
      zoomControl: false,
      bounceAtZoomLimits: false
    }).setView([39.961, 32.878], 16);

    let osmLayer = this.map.invalidateSize();
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      minZoom: 15,
      maxZoom: 19
    }).addTo(this.map);

    let buildingLayer = L.tileLayer
      .wms(this.layerUrl, {
        layers: "urbanInfo:building",
        transparent: true,
        format: "image/png",
        minZoom: 15,
        maxZoom: 19,
        tms: true
      })
      .addTo(this.map);

    let parcelLayer = L.tileLayer
      .wms(this.layerUrl, {
        layers: "urbanInfo:cluster_parcel",
        transparent: true,
        format: "image/png",
        minZoom: 15,
        maxZoom: 19
      })
      .addTo(this.map);

      let entranceLayer = L.tileLayer
      .wms(this.layerUrl, {
        layers: "urbanInfo:entrance",
        transparent: true,
        format: "image/png",
        minZoom: 15,
        maxZoom: 19
      })
      .addTo(this.map);

    let planLayer = L.tileLayer
      .wms(this.layerUrl, {
        layers: "urbanInfo:imar_detay",
        transparent: true,
        format: "image/png",
        minZoom: 15,
        maxZoom: 19
      })
      .addTo(this.map);

    let baseMaps = {};

    let overlayMaps = {
      Bina: buildingLayer,
      Parsel: parcelLayer,
      Kapı: entranceLayer,
      "İmar Planı": planLayer
    };

    L.control
      .zoom({
        position: "bottomright"
      })
      .addTo(this.map);

    L.control
      .layers(baseMaps, overlayMaps, { position: "bottomright" })
      .addTo(this.map);
  },
  methods: {
    openEntrancePanel() {
      $(".navbar-collapse").collapse("hide");
      var entranceVue = this.$refs.entrance;
      entranceVue.openPanel();
    },
    openParcelPanel() {
      $(".navbar-collapse").collapse("hide");
      var parcelVue = this.$refs.parcel;
      parcelVue.openPanel();
    },
    openRoadPanel() {
      $(".navbar-collapse").collapse("hide");
      var roadVue = this.$refs.road;
      roadVue.openPanel();
    },
    searchAll(event) {
      $(".navbar-collapse").collapse("hide");
      this.searchedData = [
        { name: "Mahalle", count: 5 },
        { name: "Parsel", count: 14 },
        { name: "Önemli Nokta", count: 3 }
      ];
      event.preventDefault();
    },
    clearSearchResult() {
      this.searchedData = [];
    },
    alert() {
      $(".navbar-collapse").collapse("hide");
      alert("not ready yet");
    }
  },
  components: {
    Parcel,
    Road,
    Entrance
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 100%;
  height: 1000px;
  margin-top: 57px;
}

.search-all {
  height: 100%;
  width: 25%;
  height: auto;
  position: fixed;
  z-index: 500;
  top: 55px;
  right: 0;
  background-color: white;
  overflow-x: hidden;
  transition: 0.5s;
  margin-top: 2px;
  margin-right: 7px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 3);
  opacity: 0.9;
}

.navDropDown {
  background-color: #343a40;
}
</style>
