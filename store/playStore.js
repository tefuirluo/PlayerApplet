import { HYEventStore } from "hy-event-store"
import { pauseLyric } from "../utils/pause-lyric"
import { getSongDetail, getSongLyric } from "../servers/player"

const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
	state: {
		playSongList: [],
		playSongIndex: 0,

		id: 0,
		currentSongs: {},
		currentTime: 0,
		durationTime: 0,
		lyricInfos: [],
		currentLyricText: "",
		currentLyricIndex: -1,

		isFirstPlay: true,
	},
	actions: {
		playMusicWithSongId(ctx, id){
			// 保存 id
			ctx.id = id

			// 2 请求歌曲相关的数据
			// 2.1 根据 id 获取歌曲的详情
			getSongDetail(id).then(res => {	
				 ctx.currentSongs = res.songs[0],
				 ctx.durationTime = res.songs[0].dt
			})
	
			// 2.2. 根据 id 获取歌词信息
			getSongLyric(id).then(res => {
				const lycString = res.lrc.lyric
				const lyricInfos = pauseLyric(lycString)
				ctx.lyricInfos = lyricInfos
			})
			// 3. 播放当前的歌曲
			audioContext.stop()
			audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
			audioContext.autoplay = true
	
			// 4. 监听播放的进度
			if(ctx.isFirstPlay) {
				ctx.isFirstPlay = false

				audioContext.onTimeUpdate(() => {
					// 1. 获取当前播放的时间
					ctx.currentTime = audioContext.currentTime
					// 2. 匹配正确的歌词
					if (!ctx.data.lyricInfos.length) return
					let index = ctx.lyricInfos.length - 1
					for (let i = 0; i < ctx.lyricInfos.length; i++) {
						const info = ctx.lyricInfos[i]
						if (info.time > audioContext.currentTime * 1000) {
							index = i - 1
							break
						}
					}
					// 减少 currentLyricText 歌词的匹配次数
					if (index === ctx.currentLyricIndex || index === -1) return
		
					// 获取歌词索引 index 和 文本 text
					const currentLyricText = ctx.lyricInfos[index].text
					ctx.currentLyricText = currentLyricText
					ctx.currentLyricIndex = index
				})
				audioContext.onWaiting(()=> {
					audioContext.pause()
				})
				audioContext.onCanplay(()=>{
					audioContext.play()
				})
				audioContext.onEnded(() => {
					if (audioContext.loop) return
					// this.changeNewSong()
					// TODO
					// 切换歌曲
				})
			}
		}
	}
})

export default playerStore