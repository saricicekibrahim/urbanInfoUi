<template>
	<div>

		<div id="mySidenav" class="sidenav">

			<div class="panel-header sticky-top" style="background-color: white;"><h1>PARSELLER <a href="#" class="closebtn" v-on:click="parcelPanel()"><i class="fa fa-chevron-left"></i></a></h1></div>
			<form class="form-inline my-2 my-lg-0">
				<input class="form-control mr-sm-2" type="text" aria-label="Ara" placeholder="Ada/Parsel Yazınız">
				<button v-on:click="fetchParcels()" class="btn btn-outline-success my-2 my-sm-0" type="submit">Ara</button>
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
							<td v-on:click="eben(parcel.first)">{{parcel.first}}</td>
							<td v-on:click="eben(parcel.first)">{{parcel.first}}</td>
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
				collapsed : false
			}
		},
		props: {
			loadingTextTr: {
				type: String,
				default: 'Getiriyoruz!'
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
			eben(argName){
				this.$parent.map.setView([15.3, 32.9], 13);
			},
			fetchParcels(){
				this.parcels = [];
				const p = this.$http.get('https://raw.githubusercontent.com/robconery/json-sales-data/master/data/customers.json');
				this.$refs.loadingScreen.load(p);
				p.then(function(response){
					for(var i = 0 ; i<40; i++)
					{
						this.parcels.push(response.body[i]);
					}
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


</style>
