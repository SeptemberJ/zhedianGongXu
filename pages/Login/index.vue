<template>
	<view class="container">
		<view class="LogoBlock">
			<image src="../../static/logo.jpg"></image>
		</view>
		<view class="LineBlock">柘电</view>
		<view class="MainBlock">
			<view class="InputItem">
				<image src="../../static/Mail.png"></image>
				<input class="uni-input" type="text" v-model="fname" placeholder="账号" style="width: 200px;height:100%;display: inline-block;"/>
			</view>
			<view class="InputItem BorderTop">
				<image src="../../static/lock.png"></image>
				<input class="uni-input" type="text" v-model="fpsd" placeholder="密码" style="width: 200px;height:100%;display: inline-block;"/>
			</view>
		</view>
		<view class="LoginBt" @click="login">Log In</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	import { combineRequsetData } from '../../utils/util.js'

	export default {
		data() {
			return {
				fname: '',
				fpsd: ''
			}
		},
		methods: {
			...mapMutations(['updateUserInfo']),
			login () {
				var tmpData = "<FUser><![CDATA[" + this.fname + "]]></FUser>"
					tmpData += "<FPSW><![CDATA[" + this.fpsd + "]]></FPSW>"
				uni.request({
					url: this.$store.state.MainUrl,
					method: 'POST',
					data: combineRequsetData('PDA_Login', tmpData),
					header:{
						'Content-Type':'text/xml;charset=utf-8'
					},
					success: (res) => {
						if (res.data[0].code == 1) {
							this.updateUserInfo({fuser: this.fname, fdept: res.data[0].FDept})
							uni.navigateTo({
							    url: '../Scan/index'
							})
						} else {
							uni.showModal({
								content: '账号或者密码错误,请重试！',
								showCancel: false
							})
						}
					},
					fail: (err) => {
						console.log('request fail', err)
					},
					complete: () => {
					}
				})
			}

		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
	.LogoBlock{
		width: 100%;
		text-align: center;
	}
	.LogoBlock image{
		/* width: 125px;
		height: 52px; */
	}
	.LineBlock::before{
		position: absolute;
		left: 5%;
		margin-top: 10px;
		content: '';
		width: 30%;
		height: 1px;
		background-color: #000;
	}
	.LineBlock{
		width: 30%;
		text-align: center;
		margin-left: 35%;
		font-size: 28px;
	}
	.LineBlock::after{
		position: absolute;
		right: 5%;
		margin-top: 10px;
		content: '';
		width: 30%;
		height: 1px;
		background-color: #000;
	}
	.MainBlock{
		width: 100%;
		height: 104px;
		border-radius: 5px;
		margin-top: 40px;
		border: 1px solid #CCC;
	}
	.InputItem{
		width: 100%;
		height: 50px;
		float: left;
	}
	.InputItem image{
		width: 30px;
		height: 30px;
		margin: 10px;
		display: inline-block;
	}
	.BorderTop{
		border-top: 1px solid #CCC;
	}
	.LoginBt{
		width: 100%;
		height: 50px;
		border-radius: 5px;
		background-color: #ff9800;
		color: #fff;
		text-align: center;
		line-height: 50px;
		margin-top: 40px;
	}
</style>
