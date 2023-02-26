// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import recommendStore from "../../store/recommendStore"
import {getMusicPlayListDetail} from "../../servers/music"
import playerStore from "../../store/playStore"
Page({
	data: {
		type: "ranking",
		key: "newRanking",
		id: "",
		songInfo: {}
	},
	onLoad(options) {
		// 1. 确定数据的类型
		const type = options.type
		// this.data.type = type
		this.setData({ type })
		// 获取 store 中榜单中的数据
		if(type === "ranking"){
			const key = options.key
			this.data.key = key
			rankingStore.onState(key, this.handleRanking)
		} else if (type === "recommend") {
			recommendStore.onState("recommendSongInfo", this.handleRanking)
		} else if (type === "menu") {
			const id = options.id
			this.data.id = id
			this.fetchMenuSongInfo()
		}
	},
	async fetchMenuSongInfo(){
		const res = await getMusicPlayListDetail(this.data.id)
		this.setData({ songInfo: res.playlist })
	},
	// wxml 事件监听
	onItemTap(){
		playerStore.setState("playSongList", this.data.songInfo.tracks)
	},
	// store 共享数据
	handleRanking(value){
		if (this.data.type === "recommend") {
			value.name = "推荐歌曲"
		}
		this.setData({ songInfo: value })
		wx.setNavigationBarTitle({
			title: value.name
		})
	},
	onUnload(){
		if (this.data.type === "ranking") {
			rankingStore.offState(this.data.key, this.handleRanking)
		} else if (this.data.type === "recommend") {
			recommendStore.offState("recommendSongInfo", this.handleRanking)
		}
		playerStore.offState("playSongList", this.data.songInfo.tracks)
	}
})