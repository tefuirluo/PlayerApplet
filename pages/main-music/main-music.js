import { getMusicBanner, getMusicPlayListDetail, getSongMenuList } from "../../servers/music"
import recommendStore from "../../store/recommendStore"
import rankingStore, { rankingMap } from "../../store/rankingStore"
import playerStore from "../../store/playStore"
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
		bannerHeight: 0,

		// 歌单数据
		hotSongMenuList: [],
		recMenuList: [],
		
		// 巅峰榜数据
		isRankingDatas: false,
		rankingInfos: {},

		// 播放工具栏
		currentSongs: {},
		isPlaying: false
	},
	onLoad(){
		this.fetchMusicBanner()
		this.fetchHotSongMenuList()
		// this.fetchRecommendSongs()
		// 发起 action
		recommendStore.onState("recommendSongInfo", this.handleRecommendSongs)
		recommendStore.dispatch("fetchRecommendSongActions")
		for (const key in rankingMap) {
			rankingStore.onState(key, this.getRankingHandle(key))
		}
		playerStore.onStates(["currentSongs", "isPlaying"], this.handlePlayInfos)
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
			url: '/pages/detail-song/detail-song?type=recommend',
		})
	},
	onSongItemTap(event) {
		// console.log(this.data.recommendSongs);
		const index = event.currentTarget.dataset.index
		playerStore.setState("playSongList", this.data.recommendSongs)
		playerStore.setState("playSongIndex", index)
	},
	onPlayOrPauseBtnTap(){
		playerStore.dispatch("changePlayMusicStatusAction")
	},
	onPlayBarAlbumTap(){
		wx.navigateTo({
			url: '/pages/music-play/music-play',
		})
	},
	// 网络请求的方法
	async fetchMusicBanner(){
		const res = await getMusicBanner()
		this.setData({ banners: res.banners })
	},
	async fetchHotSongMenuList(){
		getSongMenuList().then(res=>{
			this.setData({ hotSongMenuList: res.playlists })
		}),
		getSongMenuList("古风").then(res=>{
			this.setData({ recMenuList: res.playlists })
		})
	},
	// 从 store 中获取数据
	handleRecommendSongs(value){
		if(!value.tracks) return 
		this.setData({ recommendSongs: value.tracks.slice(0, 6)})
	},
	getRankingHandle(ranking){
		return value => {
			if(!value.name) return
			this.setData({isRankingDatas: true})
			const newRankingInfos = { ...this.data.rankingInfos, [ranking]: value}
			this.setData({ rankingInfos:  newRankingInfos})
		}
	},
	handlePlayInfos({ currentSongs, isPlaying }){
		if (currentSongs) {
			this.setData({ currentSongs })
		}
		if (isPlaying !== undefined) {
			this.setData({ isPlaying })
		}
	},
	onUnload(){
		// 销毁
		recommendStore.offState("recommendSongs", this.handleRecommendSongs)
		rankingStore.offState("newRanking", this.handleNewRanking)
		rankingStore.offState("originRanking", this.handleOriginRanking)
		rankingStore.offState("upRanking", this.handleUpRanking)
		playerStore.offStates(["currentSongs", "isPlaying"], this.handlePlayInfos)
	}
})