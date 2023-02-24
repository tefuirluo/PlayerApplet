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
		contentHeight: 0
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
			this.setData({ currentSongs: res.songs[0] })
		})

		// 2.2. 根据 id 获取歌词信息
		getSongLyric(id).then(res => {
			this.setData({ lycString: res.lrc.lyric })
		})
		// 3. 播放当前的歌曲
		audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
		// audioContext.autoplay = true
		// audioContext.onCanplay()
	},
	// 事件监听
	onSwiperChange(event){
		this.setData({ currentPage: event.detail.current })
	},
	onNavTabItemTap(event){
		const index = event.currentTarget.dataset.index
		this.setData({ currentPage: index })
	}
})