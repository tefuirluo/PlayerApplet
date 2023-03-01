// pages/detail-video/detail-video.js
import { getMvUrl, getMvInfo, getMvRelate } from "../../../servers/video"
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		id: 0,
		MvUrl: '',
		mvInfo: {},
		relateVideo: {},
		danmuList: [
			{
				text: '房东的猫',
				color: "#e3e3e3",
				time: 3
			},
			{
				text: '好听好听',
				color: "#e3e3e3",
				time: 4
			},
			{
				text: '真喜欢',
				color: "#e3e3e3",
				time: 5
			}
		]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		// 1. 获取id
		const id = options.id
		this.setData({ id })
		 
		// 2. 请求数据
		this.fetchMvUrl()
		this.fetchMvInfo()
		this.fetchMvRelate()
	},
	async fetchMvUrl(id){
		const res = await	getMvUrl(this.data.id)
		this.setData({MvUrl: res.data.url})
	},
	async fetchMvInfo(){
		const res = await getMvInfo(this.data.id)
		this.setData({ mvInfo: res.data })
	},
	async fetchMvRelate(){
		const res = await getMvRelate(this.data.id)
		this.setData({ relateVideo: res.data })
	}
})