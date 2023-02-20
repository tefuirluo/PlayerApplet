import { getTopMvList } from "../../servers/video"

// pages/main-vided/main-vided.js
Page({
	data: {
		videoList: []
	},
	onLoad(){
		// 发送网络请求
		this.fetchTopMv()
	},
	// 发送网络请求的方法
	async fetchTopMv(){
		// getTopMvList().then(res => {
		// 	this.setData({ videoList: res.data })
		// })
		const res = await getTopMvList()
		this.setData({ videoList: res.data })
	}
})