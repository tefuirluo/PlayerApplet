import { getTopMvList } from "../../servers/video"

// pages/main-vided/main-vided.js
Page({
	data: {
		videoList: [],
		offset: 0,
		hasMore: true
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
		// 1. 获取数据
		const res = await getTopMvList(this.data.offset)
		// 2. 将新的数据追加到旧的数据中
		const newVideoList = [...this.data.videoList, ...res.data]
		// 3. 设置全新的数据
		this.setData({ videoList: newVideoList })
		this.data.offset = this.data.videoList.length
		this.data.hasMore = res.hasMore
	},
	onReachBottom(){
		// 1. 判断是否有更多数据
		if(!this.data.hasMore) return
		// 2. 请求
		this.fetchTopMv()
	}
})