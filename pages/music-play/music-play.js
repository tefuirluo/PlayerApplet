// pages/music-play/music-play.js
const app = getApp()
import { getSongDetail, getSongLyric } from "../../servers/player"
Page({
	data: {
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

		// 2. 根据 id 获取歌曲的详情
		// const res = await getSongDetail(id)
		// this.setData({ currentSongs: res.songs[0]})
		getSongDetail(id).then(res => {
			this.setData({ currentSongs: res.songs[0] })
		})

		// 3. 根据 id 获取歌词信息
		getSongLyric(id).then(res => {
			this.setData({ lycString: res.lrc.lyric })
		})
	},
	// 事件监听
	onSwiperChange(event){
		this.setData({ currentPage: event.detail.current })
	}
})