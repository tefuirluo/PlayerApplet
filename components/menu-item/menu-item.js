// components/menu-item/menu-item.js
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		itemData: {
			type: Object,
			value: []
		}
	},
	methods: {
		onMuneItemClick(){
			const id = this.properties.itemData.id
			wx.navigateTo({
				url: `/pages/detail-song/detail-song?type=menu&id=${id}`,
			})
		}
	}
})
