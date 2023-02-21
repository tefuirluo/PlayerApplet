import { getMusicBanner } from "../../servers/music"

// pages/main-music/main-music.js
Page({
	data: {
		searchValue: "",
		banners: []
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
	// 网络请求的方法
	async fetchMusicBanner(){
		const res = await getMusicBanner()
		this.setData({ banners: res.banners })
	}
})