// pages/main-music/main-music.js
Page({
	data: {
		searchValue: ""
	},
	// 界面的事件监听函数
	onSearchClick(){
		wx.navigateTo({
			url: '/pages/detail-search/detail-search',
		})
	}
})