import { HYEventStore } from "hy-event-store"
import { pauseLyric } from "../utils/pause-lyric"
import { getSongDetail, getSongLyric } from "../servers/player"

export const audioContext = wx.createInnerAudioContext()

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

		isPlaying: false,
		playModeIndex: 0
	},
	actions: {
		playMusicWithSongIdAction(ctx, id){
			// 重置
			ctx.currentSongs= {}
			ctx.sliderValue = 0,
			ctx.currentTime = 0,
			ctx.durationTime = 0,
			ctx.currentLyricIndex = 0,
			ctx.currentLyricText = ""
			ctx.lyricInfos = []

			ctx.id = id
			ctx.isPlaying = true
			getSongDetail(id).then(res => {	
				 ctx.currentSongs = res.songs[0]
				 ctx.durationTime = res.songs[0].dt
			})
			getSongLyric(id).then(res => {
				const lycString = res.lrc.lyric
				const lyricInfos = pauseLyric(lycString)
				ctx.lyricInfos = lyricInfos
			})
			audioContext.stop()
			audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
			audioContext.autoplay = true
			if(ctx.isFirstPlay) {
				ctx.isFirstPlay = false	
				audioContext.onTimeUpdate(() => {
					ctx.currentTime = audioContext.currentTime * 1000
					if (!ctx.lyricInfos.length) return
					let index = ctx.lyricInfos.length - 1
					for (let i = 0; i < ctx.lyricInfos.length; i++) {
						const info = ctx.lyricInfos[i]
						if (info.time > audioContext.currentTime * 1000) {
							index = i - 1
							break
						}
					}
					if (index === ctx.currentLyricIndex) return
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
					this.dispatch("playNewMusicAction")
				})
			}
		},
		changePlayMusicStatusAction(ctx){
			if (!audioContext.paused) {
				audioContext.pause()
				ctx.isPlaying = false
			} else {
				audioContext.play()
				ctx.isPlaying = true
			}
		},
		changePlayModeAction(ctx){
			let modeIndex = ctx.playModeIndex
			modeIndex = modeIndex + 1
			if (modeIndex === 3) modeIndex = 0
			if (modeIndex === 1) {
				audioContext.loop = true
			} else {
				audioContext.loop = false
			}
			ctx.playModeIndex = modeIndex
		},
		playNewMusicAction(ctx, isNext = true) {
			const length = ctx.playSongList.length
			let index = ctx.playSongIndex
			switch (ctx.playModeIndex) {
				case 1:	// 单曲循环
				case 0: // 顺序播放
					index = isNext ? index + 1 : index - 1
					if (index === length) { index = 0 }
					if (index === -1) { index = length - 1 }
					break
				case 2: // 随机播放
					index = Math.floor(Math.random() * length)
					break		
			}	
			const newSong = ctx.playSongList[index]
			this.dispatch("playMusicWithSongIdAction", newSong.id)
			ctx.playSongIndex = index
		}
	}
})

export default playerStore