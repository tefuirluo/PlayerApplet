// pages/music-play/music-play.js
import playerStore, { audioContext } from "../../store/playStore"
import { throttle } from 'underscore'

const app = getApp()
const modeNames = ["order", "repeat", "random"]

Page({
	data: {
		id: 0,
		stateKeys: ["id", "currentSongs", "durationTime", "currentTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying", "playModeIndex"],

		currentSongs: {},
		currentTime: 0,
		durationTime: 0,
		lyricInfos: [],
		currentLyricText: "",
		currentLyricIndex: -1,

		isPlaying: true,

		playSongIndex: 0,
		playSongList: [],
		isFirstPlay: true,

		playModeName: "order",

		pageTitles: ["歌曲", "歌词"],
		currentPage: 0,
		contentHeight: 0,
		sliderValue: 0,
		isSliderChanging: false,
		isWaiting: false,

		lyricScrollTop: 0
		// statusHeight: 20
	},
onLoad(options){
		// 0. 获取设备信息
		this.setData({ 
			statusHeight: app.globalData.statusHeight,
			contentHeight: app.globalData.contentHeight
		 })
		const id = options.id
		if (id) playerStore.dispatch("playMusicWithSongIdAction", id)
		playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
		playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler)
	},
	upDateProgress: throttle(function(currentTime) {
		if (this.data.isSliderChanging) return
			// 1. 记录当前时间 
			// 2. 修改 sliderValue
			const sliderValue = currentTime / this.data.durationTime * 100
			this.setData({ currentTime, sliderValue })
	}, 800, { leading: false, trailing: false }),

	// 事件监听
	onNavBtnTap(){
		wx.navigateBack()
	},
	onSwiperChange(event){
		this.setData({ currentPage: event.detail.current })
	},
	onNavTabItemTap(event){
		const index = event.currentTarget.dataset.index
		this.setData({ currentPage: index })
	},
	// 节流
	onSliderChange(event){
		this.isWaiting = true
		setTimeout(()=> {
			this.isWaiting = false
		}, 1500)
		const value = event.detail.value
		const currentTime = value / 100 * this.data.durationTime
		audioContext.seek(currentTime / 1000)
		this.setData({ currentTime, isSliderChanging: false })
	},
	onSliderChanging: throttle(function(event){
		const value = event.detail.value
		const currentTime = value / 100 * this.data.durationTime
		this.setData({ currentTime })
		this.data.isSliderChanging = true
	}),
	onPlayOrPauseTap(){
		playerStore.dispatch("changePlayMusicStatusAction")
	},
	onPrevBtnTap(){
		playerStore.dispatch("playNewMusicAction", false)
	},
	onNextBtnTap(){
		playerStore.dispatch("playNewMusicAction", true)
	},
	onModeBtnTap(){
		playerStore.dispatch("changePlayModeAction")
	},
	// store 共享数据
	getPlaySongInfosHandler({ playSongList, playSongIndex }){
		if (playSongList) {
			this.setData({ playSongList})
		}
		// index 有为 0 的可能
		if (playSongIndex !== undefined) {
			this.setData({ playSongIndex })
		}
	},
	getPlayerInfosHandler({
		id, currentSongs, durationTime, currentTime, 
		lyricInfos, currentLyricText, currentLyricIndex, 
		isPlaying, playModeIndex
	}){
		if (id !== undefined) {
			this.setData({ id })
		}
		if (currentSongs) {
			this.setData({ currentSongs })
		}
		if (durationTime !== undefined) {
			this.setData({ durationTime })
		}
		if (currentTime !== undefined) {
			// 根据当前时间改变进度
			this.upDateProgress(currentTime)
		}
		if (lyricInfos) {
			this.setData({ lyricInfos })
		}
		if (currentLyricText) {
		}
		if (currentLyricIndex !== undefined) {
			//  修改 lyricScrollTop
			this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
		}
		if (isPlaying !== undefined) {
			this.setData({ isPlaying })
		}
		if (playModeIndex !== undefined) {
			this.setData({ playModeName: modeNames[playModeIndex] })
		}
	},
	onUnload(){
		playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
		playerStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler)
	}
})