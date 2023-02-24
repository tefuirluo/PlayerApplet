// pages/music-play/music-play.js
Page({
	data: {
		id: 0
	},
	onLoad(){
		const id = this.options.id
		this.setData({ id })
	}
})