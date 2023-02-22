import { hyReqInstance } from "./index"
export function getMusicBanner(type = 0){
	return hyReqInstance.get({
		url: "/banner",
		data: {
			type
		}
	})
}

export function getMusicPlayListDetail(id){
	return hyReqInstance.get({
		url: "/playlist/detail",
		data: {
			id
		}
	})
}
export function getSongMenuList(cat = "全部", limit = 6, offset = 0 ){
	return hyReqInstance.get({
		url: "/top/playlist",
		data: {
			cat,
			limit,
			offset
		}
	})
}