// components/menu-area/menu-area.js
const app = getApp()
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		title: {
			type: String,
			value: "默认歌单"
		},
		menuList: {
			type: Array,
			value: []
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		screenWidth: 375
	},
	lifetimes: {
		attached() {
			this.setData({ screenWidth: app.globalData.screenWidth })
		}
	}
})
