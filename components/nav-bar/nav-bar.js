// components/nav-bar/nav-bar.js
const app = getApp()
Component({
	options: {
		multipleSlots: true
	},
	properties: {
		title: {
			type: String,
			value: "导航标题"
		}
	},
	/**
	 * 组件的初始数据
	 */
	data: {
		statusHeight: 20,
	},
	lifetimes: {
		attached() {
			this.setData({ statusHeight: app.globalData.statusHeight })
		}
	},
	methods: {
		onGoBackLastPage(){
			wx.navigateBack()
		}
	}
})
