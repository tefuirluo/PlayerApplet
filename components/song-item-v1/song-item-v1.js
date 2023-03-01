// components/song-item-v1/song-item-v1.js
Component({
	properties: {
		itemData: {
			type: Object,
			value: {}
		}
	},
	methods: {
		onSongItemTap(){
			const id = this.properties.itemData.id
			wx.navigateTo({
				url: `/packagePlay/pages/music-play/music-play?id=${id}`,
			})
		}
	}
})