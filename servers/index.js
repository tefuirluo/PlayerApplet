// 封装为类 => 实例
class HYRequest {
	constructor(baseURL){
		this.baseURL = baseURL
	}
	request(options) {
		const { url } = options
		return new Promise((resovle, reject)=> {
			wx.request({
				...options,
				url: this.baseURL + url,
				success: (res) => {
					resovle(res.data)
				},
				fail: (err) =>{
					console.log("err",err);
				}
			})
		})
	}
	get(options) {
		return this.request({
			...options,
			method: "get"
		})
	}
	post(options) {
		return this.request({
			...options,
			method: "post"
		})
	}
}
// baseURL
export const hyReqInstance = new HYRequest("http://codercba.com:9002")
// export const hyReqInstance = new HYRequest("https://coderwhy-music.vercel.app/")