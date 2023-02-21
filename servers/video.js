import { hyReqInstance } from "./index";

export function getTopMvList(offset = 0, limit = 20){
	return hyReqInstance.get({
		url: "/top/mv",
		data: {
			limit,
			offset
		}
	})
}
export function getMvUrl(id){
	return hyReqInstance.get({
		url: "/mv/url",
		data: {
			id
		}
	})
}
export function getMvInfo(mvid){
	return hyReqInstance.get({
		url: "/mv/detail",
		data: {
			mvid
		}
	})
}
export function getMvRelate(id){
	return hyReqInstance.get({
		url: "/related/allvideo",
		data: {
			id
		}
	})
}
