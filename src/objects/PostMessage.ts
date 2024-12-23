import { CCtrack, PlayerActions, PlayerState } from "../types";
import { TextCuepointInterface, TextTrackInterface, ContentProgressEventDetailInterface, PlaybackStateChangeEventDetailInterface, QualityInterface } from '@JSPlayer-js-react'

export default class PostMessage {

    postMessage: (action: PlayerActions, state?: PlayerState, log?: boolean) => void

    constructor(postMessage: (action: PlayerActions, state?: PlayerState) => void) {
        this.postMessage = postMessage
    }

    public setCCTracks = (tracks: TextTrackInterface[]): void => {
        this.postMessage(PlayerActions.SET_CC_TRACKS, {
            ccTracks: tracks.map(track => {
                return track as CCtrack
            })
        })
    }

    public setCC = ({ text, startTime, endTime }: TextCuepointInterface) => {
        this.postMessage(PlayerActions.SET_CC, { cc: { text, startTime, endTime } })
    }

    public setProgress = (progress: ContentProgressEventDetailInterface) => {
        const { contentDuration } = progress
        if (contentDuration !== Infinity)
            this.postMessage(PlayerActions.SET_PROGRESS, { progress })
    }

    public setDuration = (contentDuration: number) => {
        if (contentDuration !== Infinity){
            this.postMessage(PlayerActions.SET_DURATION, { progress: { contentDuration } })
        }
    }

    public setStarted = () => {
        this.postMessage(PlayerActions.SET_STARTED)
    }

    public setEnd = () => {
        this.postMessage(PlayerActions.CONTENT_COMPLETE)
    }

    public setBuffering = (buffering: boolean) => {
        this.postMessage(PlayerActions.RESOURCE_BUFFERING, { buffering })
    }

    public setPlayerState = (playbackState: PlaybackStateChangeEventDetailInterface) => {
        this.postMessage(PlayerActions.PLAYBACK_STATE, { playbackState })
    }

    public setPlayerQuality = (quality: QualityInterface) => {
        this.postMessage(PlayerActions.QUALITY_CHANGE, { quality })
    }

    public setPlayerReady = () => {
        this.postMessage(PlayerActions.PLAYER_READY)
    }

}