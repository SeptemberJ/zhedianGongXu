<template>
	<view class="container">
		<view class="TopBar">
			<view class="SearchBlock">
				<image src="../../static/search.png" @click="search"></image>
				<input class="uni-input" confirm-type="done" v-model="keyword" placeholder="项目编号" style="width: 150px;height:100%;display: inline-block;" />
				<image v-if="keyword" src="../../static/close.png" style="float: right;" @click="clear"></image>
			</view>
			<button type="primary" @click="scanFno" style="width: 80px;height:35px;line-height:35px;display: inline-block;">扫码</button>
		</view>
		<view class="ColumnTit">
			<text class="BorderRight">零件号</text>
			<text class="BorderRight">未完成数量</text>
			<text>实际完成数量</text>
		</view>
		<view style="margin-bottom: 100px;">
			<view class="ColumnTit Noborder" v-for="item in dataList">
				<text class="BorderRight">{{ item.FText}}</text>
				<text class="BorderRight">{{ item.FUnQty}}</text>
				<text>{{ item.FQty}}</text>
			</view>
		</view>
		<view class="FooterBlock">
			<button type="primary" @click="scanLJ" style="height:35px;line-height:35px;">零件号二维码扫码</button>
		</view>
		
		<uni-popup ref="popup" type="dialog">
		    <uni-popup-dialog type="input" mode="input" placeholder="请输入实际完成数量" message="成功消息" :duration="2000" :before-close="true" @close="close" @confirm="confirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	// import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue'
	import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue'
	import { combineRequsetData } from '../../utils/util.js'

	export default {
		components: {
			uniPopup,
			uniPopupDialog
		},
		data() {
			return {
				keyword: '',
				dataList: [],
				scanFText: '',
				curItem: {}
			}
		},
		created () {
		},
		methods: {
			clear () {
				this.keyword = ''
			},
			search () {
				this.getList()
			},
			// 项目编号扫码
			scanFno () {
				uni.scanCode({
				    onlyFromCamera: true,
				    success: (res) => {
						this.keyword = res.result
						this.getList()
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			// 零件号扫码
			scanLJ () {
				if (this.dataList.length == 0) {
					uni.showModal({
						content: '请先根据项目编号查询列表！',
						showCancel: false
					})
					return false
				}
				uni.scanCode({
				    onlyFromCamera: true,
				    success: (res) => {
						this.scanFText = res.result.split(',')[0]
						let checkResult = this.dataList.filter(this.checkFText)
						if (checkResult.length == 0) {
							uni.showModal({
								content: '请确认您的零件号！',
								showCancel: false
							})
						} else {
							this.curItem = checkResult[0]
							this.$refs.popup.open()
						}
					},
					fail: (err) => {
						console.log(err)
					}
				})
			},
			checkFText(item) {
			    return item.FText == this.scanFText
			},
			close(done){
				this.curItem = {}
				this.scanFText = ''
				done()
			},
			// 确认提交实际完成数量并刷新
			confirm(done,value){
				if (!value) {
					uni.showModal({
						content: '请输入实际完成数量！',
						showCancel: false
					})
					return false
				}
				if (value <= 0) {
					uni.showModal({
						content: '实际完成数量应大于0！',
						showCancel: false
					})
					return false
				}
				if (value && value > this.curItem.FUnQty) {
					uni.showModal({
						content: '实际完成数量不能大于未完成数量！',
						showCancel: false
					})
					return false
				}
				var tmpData = "<FID><![CDATA[" + this.curItem.FID + "]]></FID>"
					tmpData += "<FIndex><![CDATA[" + this.curItem.FIndex + "]]></FIndex>"
					tmpData += "<FDept><![CDATA[" + this.$store.state.fdept + "]]></FDept>"
					tmpData += '<FQty><![CDATA[' + value + ']]></FQty>'
					tmpData += "<FUser><![CDATA[" + this.$store.state.fuser + "]]></FUser>"
				uni.request({
					url: this.$store.state.MainUrl,
					method: 'POST',
					data: combineRequsetData('save', tmpData),
					header:{
						'Content-Type':'text/xml;charset=utf-8'
					},
					success: (res) => {
						if (res.data[0].code == 1) {
							this.getList()
							done()
						} else if (res.data[0].code == 2) {
							uni.showModal({
								content: '存在未完工的工序，汇报失败！',
								showCancel: false
							})
						} else {
							uni.showModal({
								content: '汇报失败,请重试！',
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
			},
			getList () {
				var tmpData = "<FSQL><![CDATA[EXEC [Z_GONGXU] '" + this.keyword + "','" + this.$store.state.fdept + "']]></FSQL>"
				uni.request({
					url: this.$store.state.MainUrl,
					method: 'POST',
					data: combineRequsetData('JA_LIST', tmpData),
					header:{
						'Content-Type':'text/xml;charset=utf-8'
					},
					success: (res) => {
						this.dataList = res.data
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
		padding: 20px 10px;
		font-size: 14px;
		line-height: 24px;
	}
	.SearchBlock{
		width: calc(100% - 80px - 10px - 2px);
		height: 35px;
		display: inline-block;
		margin-right: 10px;
		border: 1px solid #CCCCCC;
		border-radius: 5px;
	}
	.SearchBlock image{
		width: 25px;
		height: 25px;
		margin: 5px;
		display: inline-block;
	}
	.ColumnTit{
		width: 100%;
		/* height: 35px; */
		margin-top: 20px;
		border: 1px solid #CCCCCC;
		border-radius: 5px;
	}
	.ColumnTit text{
		width: 26%;
		/* height: 35px; */
		line-height: 35px;
		text-align: center;
		display: inline-block;
	}
	.ColumnTit text:nth-of-type(1){
		width: 48%;
	}
	.Noborder{
		margin-top: 0;
		border-left: 0;
		border-top: 0;
		border-right: 0;
	}
	.BorderRight{
		border-right: 0px solid #CCCCCC;
	}
	.FooterBlock{
		width: 60%;
		height: 50px;
		display: block;
		position: fixed;
		bottom: 0;
		left: 20%;
	}
</style>
