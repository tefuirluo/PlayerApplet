import { hyReqInstance } from "./index";

export function getSongDetail(ids){
	return hyReqInstance.get({
		url: "/song/detail",
		data: {
			ids
		}
	})
}

export function getSongLyric(id){
	return hyReqInstance.get({
		url: "/lyric",
		data: {
			id
		}
	})
}