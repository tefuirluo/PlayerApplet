// pages/music-play/music-play.js
const app = getApp()
const audioContext = wx.createInnerAudioContext()

const modeNames = ["order", "repeat", "random"]

import { getSongDetail, getSongLyric } from "../../servers/player"
import playerStore from "../../store/playStore"
import { throttle } from 'underscore'
import { pauseLyric } from "../../utils/pause-lyric"

Page({
	data: {
		id: 0,
		stateKeys: ["id", "currentSongs", "durationTime", "currentTime", "lyricInfos", "currentLyricText", "currentLyricIndex"],

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

		playModeIndex: 0, // 0 => 顺序播放	1 => 单曲循环		2 => 随机播放
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
		// 1. 获取传入的id
		const id = options.id
		// 更新歌曲的进度
		// const throttleUpDateProgress = throttle(this.upDateProgress, 500, {
		// 	 leading: false,
		// 	 trailing: false
		// })
		// if (!this.data.isSliderChanging && !this.data.isWaiting) {
		// 	throttleUpDateProgress()
		// }
		playerStore.dispatch("playMusicWithSongId", id)
		

		// 5. 获取 store 的共享数据
		playerStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
		playerStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler)
	},
	upDateProgress: throttle(function(currentTime) {
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
	onSliderChange(event){
		this.isWaiting = true
		setTimeout(()=> {
			this.isWaiting = false
		}, 1500)
		// 1. 获取点击的滑块位置对应的值
		const value = event.detail.value
		// 2. 计算出要播放的位置时间
		const currentTime = value / 100 * this.data.durationTime
		// 3. 设置播放器，播放计算出来的时间
		audioContext.seek(currentTime / 1000)
		this.setData({ currentTime, isSliderChanging: false })
	},
	// 节流
	onSliderChanging: throttle(function(event){
		const value = event.detail.value
		const currentTime = value / 100 * this.data.durationTime
		this.setData({ currentTime })
		// 滑动
		this.data.isSliderChanging = true
	}),
	onPlayOrPauseTap(){
		if (!audioContext.paused) {
			audioContext.pause()
			this.setData({ isPlaying: false})
		} else {
			audioContext.play()
			this.setData({ isPlaying: true})
		}
	},
	onPrevBtnTap(){
		this.changeNewSong(false)
	},
	onNextBtnTap(){
		this.changeNewSong()
	},
	changeNewSong(isNext = true){
				// 获取之前的数据
				const length = this.data.playSongList.length
				let index = this.data.playSongIndex
				// 根据之前的数据计算最新的索引
				switch (this.data.playModeIndex) {
					case 1:	// 单曲循环 case 穿透
					case 0: // 顺序播放
						index = isNext ? index + 1 : index - 1
						if (index === length) { index = 0 }
						if (index === -1) { index = length - 1 }
						break
					// case 1: // 单曲循环
					// 	break
					case 2: // 随机播放
						index = Math.floor(Math.random() * length)
						break
					
				}	
				// 根据索引获取当前歌曲的信息
				const newSong = this.data.playSongList[index]
				// console.log(newSong);
				// 初始化之前的数据
				this.setData({ currentSongs: {}, sliderValue: 0, currentTime: 0, durationTime: 0 })
				// 开始播放之前的数据
				this.setupPlaySong(newSong.id)
		
				// 保存最新的索引值 
				playerStore.setState("playSongIndex", index)
	},
	onModeBtnTap(){
		// 1. 计算新的模式
		let modeIndex = this.data.playModeIndex
		modeIndex = modeIndex + 1
		if (modeIndex === 3) modeIndex = 0
		
		// 设置是否是单曲循环
		if (modeIndex === 1) {
			audioContext.loop = true
		} else {
			audioContext.loop = false
		}

		// 2. 保存当前的模式
		this.setData({ playModeIndex: modeIndex, playModeName: modeNames[modeIndex] })
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
		lyricInfos, currentLyricText, currentLyricIndex
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
			this.setData({ currentLyricText })
		}
		if (currentLyricIndex !== undefined) {
			//  修改 lyricScrollTop
			this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
		}
	},
	onUnload(){
		playerStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
		playerStore.offState(this.data.stateKeys, this.getPlayerInfosHandler)
	}
})