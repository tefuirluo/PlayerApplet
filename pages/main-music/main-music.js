import { getMusicBanner, getMusicPlayListDetail } from "../../servers/music"
import recommendStore from "../../store/recommendStore"
import querySelect from "../../utils/query-select"
import { throttle } from "underscore"

// 禁用第一次首先执行的话，传递{leading: false}，还有如果你想禁用最后一次执行的话，传递{trailing: false}。
const querySelectThrottle = throttle(querySelect, 100, { trailing: false })
// pages/main-music/main-music.js
Page({
	data: {
		searchValue: "",
		banners: [],
		recommendSongs: [],
		bannerHeight: 150
	},
	onLoad(){
		this.fetchMusicBanner(),
		// this.fetchRecommendSongs()
		// 发起 action
		recommendStore.onState("recommendSongs", (value) => {
			this.setData({ recommendSongs: value.slice(0, 6)})
		})
		recommendStore.dispatch("fetchRecommendSongActions")
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
	onRecommendMoreClick(){
		wx.navigateTo({
			url: '/pages/detail-song/detail-song',
		})
	},
	// 网络请求的方法
	async fetchMusicBanner(){
		const res = await getMusicBanner()
		this.setData({ banners: res.banners })
	},
	async fetchRecommendSongs(){
		const res = await getMusicPlayListDetail(3778678)
		const playlist = res.playlist
		const recommendSongs = playlist.tracks.slice(0, 6)
		this.setData({ recommendSongs })
	}
})