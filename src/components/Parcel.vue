<template>
	<div>

		<div id="mySidenav" class="sidenav">

			<div class="panel-header sticky-top" style="background-color: white;"><h1>PARSELLER<a href="#" class="closebtn" v-on:click="parcelPanel()"><i class="fa fa-chevron-left"></i></a></h1></div>
			<form class="searchForm form-inline my-2 my-lg-0">
				<input v-model="parselSearchTxt" class="form-control mr-sm-2" type="text" aria-label="Ara" placeholder="Ada/Parsel Yazınız">
				<button v-on:click="fetchParcels($event)" class="btn btn-outline-success my-2 my-sm-0" type="submit">Ara</button>
			</form>
			<br>
			<loading-screen ref="loadingScreen" :loadingText="loadingTextTr">
				<table v-if="parcels.length > 0" class="table table-striped">
					<thead>
						<tr>
							<th>Parsel No</th>
							<th>Mahalle</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="parcel in parcels">
							<td>
								<button v-on:click="zoomParcel(parcel.geometry, parcel.properties.ada_parsel)" type="button" class="btn btn-outline-info btn-sm" href="#" data-toggle="tooltip" title="Göster!">{{parcel.properties.ada_parsel}}</button>
							</td>
							<td>{{parcel.properties.mahalle_id}}</td>
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
				parcels : [],
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
			parcelPanel() {
				if(this.collapsed)
				{
					document.getElementById("mySidenav").style.width = "0";
					this.collapsed = false;
				}
				else{
					document.getElementById("mySidenav").style.width = document.documentElement.clientWidth / 4 + "px";
					this.collapsed = true;
				}

			},
			zoomParcel(argGeometry, argName){
				if(this.searchLayer != null){
					this.$parent.map.removeLayer(this.searchLayer);
				}
				this.searchLayer = L.geoJSON(argGeometry);
				this.searchLayer.addTo(this.$parent.map);
				this.$parent.map.fitBounds(this.searchLayer.getBounds());
				this.searchLayer.bindPopup("En şirin parsel benim " + argName).openPopup();
			},
			fetchParcels(event){
				event.preventDefault();
				this.parcels = [];
				let url = this.dataUrl + "parcel";
				if(this.parselSearchTxt){
					url += "&CQL_FILTER=ada_parsel LIKE '%25" + this.parselSearchTxt + "%25'";
				}
				const p = this.$http.get(url);
				this.$refs.loadingScreen.load(p);
				p.then(function(response){
					let parcelFeatures=[];
					$.each(response.body.features, function(key, value) {
     					parcelFeatures.push(value);
   					});
   					this.parcels = parcelFeatures;
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
