<template>
	<div>

		<div id="roadPanel" class="sidenav">

			<div class="panel-header sticky-top" style="background-color: white;"><h1>YOLLAR<a href="#" class="closebtn" v-on:click="openPanel()"><i class="fa fa-chevron-left"></i></a></h1></div>
			<form class="searchForm form-inline my-2 my-lg-0">
				<input v-model="parselSearchTxt" class="form-control mr-sm-2" type="text" aria-label="Ara" placeholder="Ada/Parsel Yazınız">
				<button v-on:click="fetchRoads($event)" class="btn btn-outline-success my-2 my-sm-0" type="submit">Ara</button>
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
	import LoadingScreen from 'vue-loading-screen';

	export default {
		name: 'Panel',
		data () {
			return {
				roads : [],
				collapsed : false,
				searchLayer : null,
				parselSearchTxt : null
			}
		},
		props: {
			loadingTextTr: {
				type: String,
				default: 'Lütfen Bekleyiniz!'
			}
		},
		methods: { 
			openPanel() {
				if(this.collapsed)
				{
					document.getElementById("roadPanel").style.width = "0";
					this.collapsed = false;
				}
				else{
					document.getElementById("parcelPanel").style.width = "0";
					document.getElementById("roadPanel").style.width = document.documentElement.clientWidth / 4 + "px";
					this.collapsed = true;
				}

			},
			zoomRoad(argGeometry, argName){
				if(this.searchLayer != null){
					this.$parent.map.removeLayer(this.searchLayer);
				}
				this.searchLayer = L.geoJSON(argGeometry);
				this.searchLayer.addTo(this.$parent.map);
				this.$parent.map.fitBounds(this.searchLayer.getBounds());
				this.searchLayer.bindPopup("En şirin yol benim " + argName).openPopup();
			},
			fetchRoads(event){
				event.preventDefault();
				this.roads = [];
				let url = this.dataUrl + "road";
				const p = this.$http.get(url);
				this.$refs.loadingScreen.load(p);
				p.then(function(response){
					let roadFeatures=[];
					$.each(response.body.features, function(key, value) {
						roadFeatures.push(value);
					});
					this.roads = roadFeatures;
				});
			}

		},
		components: {
			LoadingScreen,
		}

	}


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
	box-shadow: 0 0 20px rgba(0,0,0,3);
	opacity:.9;
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
	box-shadow: 0 0 5px rgba(0,0,0,1);
}

.table td, th {
	text-align: center;   
}
.searchForm{
	margin: 0 auto;
	width:80%
}
</style>
