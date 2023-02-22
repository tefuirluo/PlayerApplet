import { HYEventStore } from "hy-event-store"
import { getMusicPlayListDetail }  from "../servers/music"

const rankingMap = {
	newRanking: 3779629,
	originRanking: 2884035,
	upRanking: 19723756
}
const rankingStore = new HYEventStore({
	state: {
		// 榜单
		newRanking: {},
		originRanking: {},
		upRanking: {}
	},
	actions: {
		async fetchRankingDataAction(ctx){
			for(const key in rankingMap){
				const id = rankingMap[key]
				const res = await getMusicPlayListDetail(id)
				ctx[key] = res.playlist
			}
		}
	}
})

export default rankingStore