<template>
	<div class="contain" v-show="show">
		<div id="findbox">
			客人姓名<br />
			<input type="text" v-model="find_name"/><br />
			客人身份证号<br />
			<input type="text" v-model="find_idcard" /><br>
			<button @click="findbox_exit">取消</button><button @click="find">查询</button>
		</div>
		<header>
			<h2 id="pagetitle">入住客人信息·录入</h2>
			<button @click="findbox_show">查询客户入住信息</button>
			&numsp;从<input type="date" v-model="fliterdate"/>开始&numsp;<button @click="fliterall">筛选</button><button @click="fliterend">筛选完毕</button>
			<img id="hotelimg" alt="酒店全景图" src="/hotel.webp" />
		</header>
		<div class="listbox">
			<table id="listtable" cellspacing="0">
				<tr>
					<th>来客号</th>
					<th>登记名</th>
					<th>登记身份证号</th>
					<th>联系方式</th>
					<th>房号</th>
					<th>房型</th>
					<th>入住时间</th>
					<th>备注</th>
				</tr>
			</table>
		</div>
		<div class="pagesbox">
			<span>每页
				<select id="shownum" @change="selchange">
					<option value="10">10</option>
					<option value="20">20</option>
					<option value="50">30</option>
				</select>条记录</span> <span> 第{{nowpage}}页/共{{allpages}}页</span>
				   &ensp;<button @click="tappage">跳转</button>到第<input type="text" v-model="tab_page" id="taptopage">页
			<div>
				<ul class="pagesbar">
					<li id="pre" @click="pre">《&lt;&lt;</li>
					<li class="pagestab" @click="pagetab">{{midpage-2>1?"...":1}}</li>
					<li class="pagestab" @click="pagetab">{{midpage-1<=allpages?midpage-1:"..."}}</li>
					<li class="pagestab" @click="pagetab">{{midpage<=allpages?midpage:"..."}}</li>
					<li class="pagestab" @click="pagetab">{{midpage+1<=allpages?midpage+1:"..."}}</li>
					<li class="pagestab" @click="pagetab">{{midpage+2<=allpages?midpage+2:"..."}}</li>
					<li class="pagestab" @click="pagetab">{{midpage+3<=allpages?midpage+3:"..."}}</li>
					<li class="pagestab" @click="pagetab">{{midpage+4<=allpages?midpage+4:"..."}}</li>

					<li id="next" @click="next">>>》</li>
				</ul>
			</div>
		</div>
	</div>

</template>

<script>
	import axios from 'axios'
	import {
		onMounted,
		ref
	} from 'vue'
	export default {
		name: 'visitorsshow',
		props: {
			msg: String,

		},
		data() {
			return {
				count: 0,
				show: true
			}
		},
		methods: {
			disappear() {
				this.show = false

			}
		},
		setup() {
			var midpage = ref(3);
			var nowpage = ref(1);
			var allpages = ref(0);
			var shownum = ref(10);
			var find_name=ref(null);
			var find_idcard=ref(null);
			var tab_page=ref(null);
			var fliterdate=ref(null);
			var fliterend=function(){
				var pagesbox = document.getElementsByClassName('pagesbox');
				pagesbox[0].style.display="block";
				var re = document.getElementsByClassName('data_lists');
				for(var m=re.length-1;m>=0;m--){
					re[m].style.display="table-row";
				}
				var re1 = document.getElementsByClassName('fliter_lists');
				for(var n=re1.length-1;n>=0;n--){
					re1[n].remove();
				}
			}
			var fliterall=function(){
				// console.log(fliterdate.value)
				if(fliterdate.value==null){
					alert("请选择筛选的时间！")
				}
				axios.get('http://172.20.10.7:8001/fliterdate',{
					params:{
						datevalue:fliterdate.value
					}
					
				}).then(data=>{
					var data=data.data;
						if(data.length==0){
							alert("此日期当日无客源，请另选时间！")
						}
						var pagesbox = document.getElementsByClassName('pagesbox');
						pagesbox[0].style.display="none";
						var re = document.getElementsByClassName('data_lists');
						for(var m=re.length-1;m>=0;m--){
							re[m].style.display="none";
						}
						var re1 = document.getElementsByClassName('fliter_lists');
						for(var n=re1.length-1;n>=0;n--){
							re1[n].remove();
						}
						var tablebox = document.getElementById("listtable");
						for (var i = 0; i < data.length; i++) {
							var newtr = document.createElement('tr');
							newtr.setAttribute("class", "fliter_lists");
							tablebox.appendChild(newtr); //console.log(parm)
							for (var j = 0; j < 8; j++) {
								var newtd = document.createElement('td');
								newtr.appendChild(newtd);
								switch (j) {
									case 0:
										newtd.innerText = data[i].id;
										break;
									case 1:
										newtd.innerText = data[i].visitor;
										break;
									case 2:
										newtd.innerText = data[i].idcard;
										break;
									case 3:
										newtd.innerText = data[i].phone;
										break;
									case 4:
										newtd.innerText = data[i].room;
										break;
									case 5:
										newtd.innerText = data[i].roomtype;
										break;
									case 6:
										newtd.innerText = data[i].signtime;
										break;
									case 7:
										newtd.innerText = data[i].others;
										break;
								}
							}
						
						}
				})
			}
			var tappage=function(){
				if (!Number.isNaN(tab_page.value)) {
					nowpage.value =Math.floor(tab_page.value) ;
					var re = document.getElementsByClassName('data_lists');
					for (var i = re.length - 1; i >= 0; i--) {
						re[i].remove();
					}
					getall().then(() => {
						pagesbar_update();
					});
				}
			};
			var find=function(){
				//console.log(find_idcard.value)
				axios.get('http://172.20.10.7:8001/findbyidname',{
					params:{
						findname:find_name.value,
						findidcard:find_idcard.value
					}
				}).then(data=>{
					//console.log(data.data)
					var data=data.data;
						var pagesbox = document.getElementsByClassName('pagesbox');
						pagesbox[0].style.display="none";
						var re = document.getElementsByClassName('data_lists');
						for(var m=re.length-1;m>=0;m--){
							re[m].style.display="none";
						}
						var re1 = document.getElementsByClassName('find_lists');
						for(var n=re1.length-1;n>=0;n--){
							re1[n].remove();
						}
						var tablebox = document.getElementById("listtable");
						for (var i = 0; i < data.length; i++) {
							var newtr = document.createElement('tr');
							newtr.setAttribute("class", "find_lists");
							tablebox.appendChild(newtr); //console.log(parm)
							for (var j = 0; j < 8; j++) {
								var newtd = document.createElement('td');
								newtr.appendChild(newtd);
								switch (j) {
									case 0:
										newtd.innerText = data[i].id;
										break;
									case 1:
										newtd.innerText = data[i].visitor;
										break;
									case 2:
										newtd.innerText = data[i].idcard;
										break;
									case 3:
										newtd.innerText = data[i].phone;
										break;
									case 4:
										newtd.innerText = data[i].room;
										break;
									case 5:
										newtd.innerText = data[i].roomtype;
										break;
									case 6:
										newtd.innerText = data[i].signtime;
										break;
									case 7:
										newtd.innerText = data[i].others;
										break;
								}
							}
						
						}
						
				})
				
			};
			var findbox_show = function() {
				var findbox = document.getElementById("findbox");
				findbox.style.display = "block";
			};
			var findbox_exit=function(){
				find_name.value=null;
				find_idcard.value=null;
					var findbox = document.getElementById("findbox");
					findbox.style.display = "none";
						var re1 = document.getElementsByClassName('find_lists');
						for(var n=re1.length-1;n>=0;n--){
							re1[n].remove();
						}
						var pagesbox = document.getElementsByClassName('pagesbox');
						pagesbox[0].style.display="block";
						var re = document.getElementsByClassName('data_lists');
						for(var m=re.length-1;m>=0;m--){
							re[m].style.display="table-row";
						}
			};
			var selchange = function(event) {
				//console.log(event.target.selectedIndex)
				var selindex = event.target.selectedIndex; 
				var seltext = event.target.options[selindex].text;
				if (!isNaN(seltext)) {
					shownum.value = Math.floor(seltext);
					//console.log(shownum.value+1)
					var re = document.getElementsByClassName('data_lists');
					for (var i = re.length - 1; i >= 0; i--) {
						re[i].remove();
					}
					getall().then(() => {
						pagesbar_update();
					});
				}
			};
			var pagetab = function(event) {
				//console.log(event.target.value)
				var pagetext = event.target.innerText;
				if (!Number.isNaN(pagetext)) {
					nowpage.value =Math.floor(pagetext) ;
					var re = document.getElementsByClassName('data_lists');
					for (var i = re.length - 1; i >= 0; i--) {
						re[i].remove();
					}
					getall().then(() => {
						pagesbar_update();
					});
				}
			};
			var pagesbar_update = function() {
				if (nowpage.value >= 3) {
					midpage.value = nowpage.value;
						// console.log(midpage.value+1)
					 // console.log(isNaN(nowpage.value))
				} else {
					midpage.value = 3;
				}
			};
			var pre = function() {
				nowpage.value -= 1;
				if (nowpage.value <= 0) {
					nowpage.value = 1;
					alert("页面到顶了！")
				} else {
					var re = document.getElementsByClassName('data_lists');
					for (var i = re.length - 1; i >= 0; i--) {
						re[i].remove();
					}
					getall().then(() => {
						pagesbar_update();
					});
				}

			};
			var next = function() {
				nowpage.value += 1;
				if (nowpage.value > allpages.value) {
					nowpage.value = allpages.value;
					alert("页面到顶了！")
				} else {
					var re = document.getElementsByClassName('data_lists');
					for (var i = re.length - 1; i >= 0; i--) {
						re[i].remove();
					}
					getall().then(() => {
						pagesbar_update();
					})
				}

			};
			var getall = function() {
				return new Promise((resolve, reject) => {
					axios.get('http://172.20.10.7:8001/getall').then(result => {
						//console.log(result.data)
						resolve("获取内容成功")
						var data = result.data;
						allpages.value = Math.ceil(data.length / shownum.value);
						var tablebox = document.getElementById("listtable");
						var parm = (nowpage.value - 1) * shownum.value;
						//console.log(parm)
						for (var i = parm; i < parm + shownum.value && i < data.length; i++) {
							var newtr = document.createElement('tr');
							newtr.setAttribute("class", "data_lists");
							tablebox.appendChild(newtr); //console.log(parm)
							for (var j = 0; j < 8; j++) {
								var newtd = document.createElement('td');
								newtr.appendChild(newtd);
								switch (j) {
									case 0:
										newtd.innerText = data[i].id;
										break;
									case 1:
										newtd.innerText = data[i].visitor;
										break;
									case 2:
										newtd.innerText = data[i].idcard;
										break;
									case 3:
										newtd.innerText = data[i].phone;
										break;
									case 4:
										newtd.innerText = data[i].room;
										break;
									case 5:
										newtd.innerText = data[i].roomtype;
										break;
									case 6:
										newtd.innerText = data[i].signtime;
										break;
									case 7:
										newtd.innerText = data[i].others;
										break;
								}
							}

						}
					})
				});

			};
			onMounted(() => {
				getall();
			});
			return {
				midpage,
				nowpage,
				allpages,
				pre,
				next,
				pagetab,
				selchange,
				findbox_show,
				findbox_exit,find,
				find_idcard,find_name,
				tappage,tab_page,
				fliterdate,fliterall,fliterend
			}
		}
	}
</script>
<style>
	@media screen and (max-width:800px) {
		html {
			font-size: 1rem;
		}

	}

	.pagesbox {}

	.contain {
		font-size: 1rem;
		position: relative;
		display: inline-block;
	}

	header {
		padding: 1rem;
		background-color: greenyellow;
		border: 0.1rem dotted orangered;
		position: relative;
		left: 10%;
	}

	#findbox {
		position: absolute;
		left: 10%;
		background-color: aliceblue;
		display: none;
		z-index: 2;
	}

	#pagetitle {
		textalign: center;

	}

	#hotelimg {
		width: 100%;
		height: 10rem;
	}

	.listbox {
		display: inline-block;
		padding: 1rem;

		position: relative;
		left: 10%;
		background-color: aliceblue;
	}

	#listtable {
		font-size: 1rem;
		width: 100%;
		border: 0.1rem dashed greenyellow;

	}

	#listtable tr,
	th,
	td {
		border: 0.1rem dashed greenyellow;
	}
#taptopage{
	width: 2rem;
}
	.pagesbar {
		display: flex;
		list-style: none;
		justify-content: center;
	}

	.pagesbar>li {
		border: 0.1rem solid black;
		margin: 0.1rem;
	}
</style>