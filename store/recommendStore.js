import {HYEventStore} from "hy-event-store"
import { getMusicPlayListDetail } from "../servers/music"
const recommendStore = new HYEventStore({
	state: {
		recommendSongInfo: {}
	},
	actions: {
		async fetchRecommendSongActions(ctx){
			const res = await getMusicPlayListDetail(3778678)
			ctx.recommendSongInfo = res.playlist
		}
	}
})
export default recommendStore