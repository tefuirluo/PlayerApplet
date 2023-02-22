import {HYEventStore} from "hy-event-store"
import { getMusicPlayListDetail } from "../servers/music"
const recommendStore = new HYEventStore({
	state: {
		recommendSongs: []
	},
	actions: {
		async fetchRecommendSongActions(ctx){
			const res = await getMusicPlayListDetail(3778678)
			ctx.recommendSongs = res.playlist.tracks
		}
	}
})
export default recommendStore