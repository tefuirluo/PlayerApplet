// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getSongMenuList } from "../../servers/music"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		songMenus: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.fetchGetAllMenuList()
	},
	// 发送网络请求
	async fetchGetAllMenuList(){
		// 获取 tags
		const tagRes = await getSongMenuTag()
		const tags = tagRes.tags

		// 根据 tags 获取对应的歌单
		const allPromise = []
		for(const tag of tags) {
			const promise = await getSongMenuList(tag.name)
			allPromise.push(promise)
		}
		Promise.all(allPromise).then(res => {
			this.setData({ songMenus: allPromise })
		})
	}
})