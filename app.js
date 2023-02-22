// app.js
App({
	globalData: {
		screenWidth: 375,
		screenHeight: 667
	},
	onLaunch(){
		// 获取设备信息
		wx.getSystemInfo({
			success: (res) => {
				this.globalData.screenWidth = res.screenWidth
				this.globalData.screenHeight = res.screenHeight
			}
		})
	}
})
