// pages/music-play/music-play.js
const app = getApp()
const audioContext = wx.createInnerAudioContext()

import { getSongDetail, getSongLyric } from "../../servers/player"
Page({
	data: {
		pageTitles: ["歌曲", "歌词", "推荐"],
		id: 0,
		currentSongs: {},
		lycString: "",
		currentPage: 0,
		contentHeight: 0,
		currentTime: 0,
		durationTime: 0,
		sliderValue: 0,
		isSliderChanging: false
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
			this.setData({ lycString: res.lrc.lyric })
		})
		// 3. 播放当前的歌曲
		audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
		// audioContext.autoplay = true
		// audioContext.onCanplay()

		// 4. 监听播放的进度
		audioContext.onTimeUpdate(() => {
			if (!this.data.isSliderChanging) {
			// 1. 记录当前时间 
			// console.log("onTimeUpdate", audioContext.currentTime);
			this.setData({ currentTime: audioContext.currentTime * 1000 })
			// 2. 修改 sliderValue
			const sliderValue = this.data.currentTime / this.data.durationTime * 100
			this.setData({ sliderValue })
			}
		})
		audioContext.onWaiting(()=> {
			audioContext.pause()
		})
		audioContext.onCanplay(()=>{
			audioContext.play()
		})
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
	}
})