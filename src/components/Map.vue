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
						<a class="nav-link dropdown-toggle" href="#" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fa fa-search" aria-hidden="true"></i> Ara</a>
						<div class="dropdown-menu" style="background-color: #343a40 " aria-labelledby="dropdown01">
							<a v-on:click="parcelPanel()" class="nav-link" href="#"><i class="fa fa-th-large" aria-hidden="true"></i> Parsel</a>
							<a v-on:click="doorPanel()" class="nav-link" href="#"><i class="fa fa-circle-o" aria-hidden="true"></i> Kapı</a>
							<a v-on:click="roadPanel()" class="nav-link" href="#"><i class="fa fa-exchange" aria-hidden="true"></i> Yol</a>
							<a v-on:click="poiPanel()" class="nav-link" href="#"><i class="fa fa-map-pin" aria-hidden="true"></i> Önemli Nokta</a>
						</div>
					</li>
					<li class="nav-item">
						<a v-on:click="parcelPanel()" class="nav-link" href="#"><i class="fa fa-file-text" aria-hidden="true"></i> İmar Durumu</a>          
					</li>
				</ul>
			</li>
			<form class="form-inline my-2 my-lg-0">
				<input class="form-control mr-sm-2" type="text" aria-label="Ara" placeholder="Mahalle, Parsel, Poi, vs...">

				<button class="btn btn-outline-success my-2 my-sm-0" type="submit" v-on:click="doSmt()">Ara</button>
			</form>
		</div>
	</nav>
				<div class="eben text-center" v-if="cars.length > 0">
					<ul v-for="car in cars" class="list-group">
					  <li class="list-group-item d-flex justify-content-between align-items-center">{{car.name}}
					          <span class="badge badge-primary badge-pill">14</span></li>
					</ul>
					<button class="btn btn-outline-danger" v-on:click="clearSearchResult">Kapat</button>

				</div>

	<Parcel ref="parcel"/>
	<div id="map" style="height: 2000px;">

	</div>


</div>
</template>

<script>
	import Parcel from './Parcel'
	export default {
		name: 'Map',
		data : function() {
			return {
				map : null,
				cars: []
			}
		},
		mounted() {
			this.map = L.map('map',{ zoomControl:false }).setView([39.9, 32.9], 13);
			L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			}).addTo(this.map);

			document.getElementById("map").style.height = document.documentElement.clientHeight + "px";
		},
		methods: { 
			parcelPanel(){
				var child = this.$refs.parcel;
				child.parcelPanel();
			},
			doSmt(){
				this.cars = 
				[
        { "name":"Mahalle",},
        { "name":"Parsel", },
        { "name":"Önemli Nokta" }
    ]
			},
			clearSearchResult(){
				this.cars = [];
			}
		},
		components: {
			Parcel
		}
	}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
	width: auto;
	height: 100%;
	margin-top: 57px;
}

	.eben {
		height: 100%;
		width: 25%;
		height:auto;
		position: fixed;
		z-index: 500;
		top: 55px;
		right: 0;
		background-color: white;
		overflow-x: hidden;
		transition: 0.5s;
		margin-top: 2px;
		margin-right: 7px;
		box-shadow: 0 0 20px rgba(0,0,0,3);
		opacity:.9;
	}

</style>
