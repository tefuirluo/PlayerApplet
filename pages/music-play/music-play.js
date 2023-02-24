// pages/music-play/music-play.js
const app = getApp()
const audioContext = wx.createInnerAudioContext()

import { getSongDetail, getSongLyric } from "../../servers/player"
import { throttle } from 'underscore'
import { pauseLyric } from "../../utils/pause-lyric"

Page({
	data: {
		pageTitles: ["歌曲", "歌词", "推荐"],
		id: 0,
		currentSongs: {},
		lycString: "",
		currentLyricText: "",
		currentPage: 0,
		contentHeight: 0,
		currentTime: 0,
		durationTime: 0,
		sliderValue: 0,
		isSliderChanging: false,
		isWaiting: false,
		isPlaying: true,
		lyricInfos: [],
		currentLyricIndex: -1
		// statusHeight: 20
	},
	async onLoad(){
		// 0. 获取设备信息
		this.setData({ 
			statusHeight: app.globalData.statusHeight,
			contentHeight: app.globalData.contentHeight
		 })
		// 1. 获取传入的id
		const id = this.options.id
		this.setData({ id })

		// 2 请求歌曲相关的数据
		// 2.1 根据 id 获取歌曲的详情
		// const res = await getSongDetail(id)
		// this.setData({ currentSongs: res.songs[0]})
		getSongDetail(id).then(res => {
			this.setData({ 
				currentSongs: res.songs[0],
				durationTime: res.songs[0].dt
			 })

		})

		// 2.2. 根据 id 获取歌词信息
		getSongLyric(id).then(res => {
			const lycString = res.lrc.lyric
			const lyricInfos = pauseLyric(lycString)
			this.setData({ lyricInfos })
		})
		// 3. 播放当前的歌曲
		audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
		audioContext.autoplay = true
		// audioContext.onCanplay()

		// 4. 监听播放的进度
		const throttleUpDateProgress = throttle(
			this.upDateProgress,
			 300,
			 { leading:false, trailing: false})
		audioContext.onTimeUpdate(() => {
			// 1. 更新歌曲进度
			if (!this.data.isSliderChanging && !this.data.isWaiting) {
				throttleUpDateProgress()
			}
			// 2. 匹配正确的歌词
			if (!this.data.lyricInfos.length) return
			let index = this.data.lyricInfos.length - 1
			for (let i = 0; i < this.data.lyricInfos.length; i++) {
				const info = this.data.lyricInfos[i]
				if (info.time > audioContext.currentTime * 1000) {
					index = i - 1
					break
				}
			}
			// 减少 currentLyricText 歌词的匹配次数
			if (index === this.data.currentLyricIndex) return
			const currentLyricText = this.data.lyricInfos[index].text
			this.setData({ currentLyricText, currentLyricIndex: index })
		})
		audioContext.onWaiting(()=> {
			audioContext.pause()
		})
		audioContext.onCanplay(()=>{
			audioContext.play()
		})
	},
	upDateProgress(){
		// 1. 记录当前时间 
		const sliderValue = this.data.currentTime / this.data.durationTime * 100
		this.setData({ currentTime: audioContext.currentTime * 1000, sliderValue })
		
	},
	// 事件监听
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
	onSliderChanging(event){
		const value = event.detail.value
		const currentTime = value / 100 * this.data.durationTime
		this.setData({ currentTime })
		// 滑动
		this.data.isSliderChanging = true
	},
	onPlayOrPauseTap(){
		if (!audioContext.paused) {
			audioContext.pause()
			this.setData({ isPlaying: false})
		} else {
			audioContext.play()
			this.setData({ isPlaying: true})
		}
		
		
	}
})