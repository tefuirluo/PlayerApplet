import { getMusicBanner, getMusicPlayListDetail, getSongMenuList } from "../../servers/music"
import recommendStore from "../../store/recommendStore"
import rankingStore from "../../store/rankingStore"
import querySelect from "../../utils/query-select"
import { throttle } from "underscore"


// 禁用第一次首先执行的话，传递{leading: false}，还有如果你想禁用最后一次执行的话，传递{trailing: false}。
const querySelectThrottle = throttle(querySelect, 100, { trailing: false })
const app = getApp()
// pages/main-music/main-music.js
Page({
	data: {
		searchValue: "",
		banners: [],
		recommendSongs: [],

		screenWidth: 375,
		bannerHeight: 150,

		// 歌单数据
		hotSongMenuList: [],
		recMenuList: []
	},
	onLoad(){
		this.fetchMusicBanner(),
		this.fetchHotSongMenuList(),
		// this.fetchRecommendSongs()
		// 发起 action
		recommendStore.onState("recommendSongs", (value) => {
			this.setData({ recommendSongs: value.slice(0, 6)})
		})
		recommendStore.dispatch("fetchRecommendSongActions")
		rankingStore.dispatch("fetchRankingDataAction")
		// 获取屏幕尺寸
		this.setData({ screenWidth: app.globalData.screenWidth })
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
	// async fetchRecommendSongs(){
	// 	const res = await getMusicPlayListDetail(3778678)
	// 	const playlist = res.playlist
	// 	const recommendSongs = playlist.tracks.slice(0, 6)
	// 	this.setData({ recommendSongs })
	// }
	async fetchHotSongMenuList(){
		// const res = await getSongMenuList()
		// this.setData({ hotSongMenuList: res.playlists })
		getSongMenuList().then(res=>{
			this.setData({ hotSongMenuList: res.playlists })
		}),
		getSongMenuList("古风").then(res=>{
			this.setData({ recMenuList: res.playlists })
		})
	}
})