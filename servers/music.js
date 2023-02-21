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