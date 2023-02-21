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
	// 下拉加载更多
	onReachBottom(){
		// 1. 判断是否有更多数据
		if(!this.data.hasMore) return
		// 2. 请求
		this.fetchTopMv()
	},
	// 上拉刷新
	async onPullDownRefresh(){
		// 1. 数据置空
		this.setData({ videoList: []})
		this.data.offset = 0
		this.data.hasMore = true

		// 2. 重新请求新的数据
		await this.fetchTopMv()
		// 3. 停止下拉刷新
		wx.stopPullDownRefresh()
	},
	// 事件监听
	onVideoItemTap(event){
		// const item = event.currentTarget.dataset.item
		// wx.navigateTo({
		// 	url: `/pages/detail-video/detail-video?id=${item.id}`,
		// })
	}
})