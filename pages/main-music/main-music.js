import { getMusicBanner } from "../../servers/music"
import querySelect from "../../utils/query-select"
// import throttle from "../../utils/throttle"
import { throttle } from "underscore"

// 禁用第一次首先执行的话，传递{leading: false}，还有如果你想禁用最后一次执行的话，传递{trailing: false}。
const querySelectThrottle = throttle(querySelect, 100, { trailing: false })
// pages/main-music/main-music.js
Page({
	data: {
		searchValue: "",
		banners: [],
		bannerHeight: 150
	},
	onLoad(){
		this.fetchMusicBanner()
	},
	// 界面的事件监听函数
	onSearchClick(){
		wx.navigateTo({
			url: '/pages/detail-search/detail-search',
		})
	},
	onBannerImageLoad(event){
		// 获取 image 组件的高度
		querySelectThrottle(".banner-image").then(res => {
			this.setData({bannerHeight: res[0].height})
		})
	},
	// 网络请求的方法
	async fetchMusicBanner(){
		const res = await getMusicBanner()
		this.setData({ banners: res.banners })
	}
})