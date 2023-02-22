// pages/detail-song/detail-song.js
import recommendStore from "../../store/recommendStore"
Page({
	data: {
		songs: []
	},
	handleRecomendSongs(value){
		this.setData({ songs: value })
	},
	onLoad(){
		recommendStore.onState("recommendSongs", this.handleRecomendSongs)
	},
	onUnload(){
		recommendStore.offState("recommendSongs", this.handleRecomendSongs)
	}
})