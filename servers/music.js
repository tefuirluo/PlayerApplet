import { hyReqInstance } from "./index"
export function getMusicBanner(type = 0){
	return hyReqInstance.get({
		url: "/banner",
		data: {
			type
		}
	})
}