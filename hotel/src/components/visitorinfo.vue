<template>
	<div class="contain" v-show="show">
		<header>
			<h2 id="pagetitle">入住客人信息·录入</h2>
			<img id="hotelimg" alt="酒店全景图" src="/hotel.webp"/>
		</header>
		<div class="writeinfo">
			<form id="iup_infonfocontent" action="http://172.20.10.7:8001/up_info" method="POST"  target="_top">
				入住人- <br /><input type="text" name="visitor"><br />
				身份证号-<br /><input type="text" name="idcard"/><br />
				联系方式-<br /><input type="text" name="phone"/><br />
				房号- <br /> <input type="text" name="room"/><br />
				房型-  <select class="roomtype" name="roomtype">
					<option value="单人房" selected>单人房</option>
					<option value="双人房">双人房</option>
					<option value="三人房">三人房</option>
				</select><br />
				备注-  <br /><input type="text" name="others"/><br />
				<input type="submit"  value="完成"/>
				<input type="reset" value="重置"/>
				
			</form>
		</div>
  </div>
</template>

<script>
export default {
  name: 'visitorinfo',
  props: {
    msg: String,
	
  },
  data() {
    return {
      count: 0,
	  show:true
    }
  } ,
  methods:{
	  
	  
  }
}
</script>
<style>
	@media screen and (max-width:800px){
		html{
			font-size: 1rem;
		}
		
	}
	
	header{
		padding: 1rem;
		width: 80%;
		background-color: greenyellow;
		border: 0.1rem dotted orangered;
		position:relative;
		left: 10%;
	}
	#pagetitle{
		textalign:center;
		
	}
	#hotelimg{
		width: 100%;
		height: 10rem;
	}
	.writeinfo{
		font-size: 1rem;
		padding: 1rem;
		width: 80%;
		height: 80%;
		background-color: skyblue;
		border: 0.1rem dotted orangered;
		position:relative;
		left: 10%;
	}
	input{
		font-size: 1rem;
	}
	
</style>
