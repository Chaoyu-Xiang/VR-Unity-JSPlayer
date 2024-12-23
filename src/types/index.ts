export enum PlayerControlState {
    PLAYING = "PLAYING",
    PAUSED = "PAUSED",
    STOP = "STOP"

}

export enum PlayerActions {
    SET_URL = "SET_URL",
    PLAY = "PLAY",
    PAUSE = "PAUSE",
    STOP = "STOP",
    SET_VOLUME = "SET_VOLUME",
    SET_CHANNEL = "SET_CHANNEL",
    SET_VOD = "SET_VOD",
    BRIDGE_READY = "BRIDGE_READY",
    PLAYER_READY = "PLAYER_READY",
    SET_SEEK = "SET_SEEK",
    SET_CC = "SET_CC",
    SET_CC_TRACKS = "SET_CC_TRACKS",
    SET_CC_TRACK = "SET_CC_TRACK",
    SET_PROGRESS = "SET_PROGRESS",
    SET_STARTED = "SET_STARTED",
    SET_DURATION = "SET_DURATION",
    RESOURCE_END = "RESOURCE_END",
    CONTENT_COMPLETE = "CONTENT_COMPLETE",
    RESOURCE_BUFFERING = "RESOURCE_BUFFERING",
    PLAYBACK_STATE = "PLAYBACK_STATE",
    QUALITY_CHANGE = "QUALITY_CHANGE"
}

export enum PlaybackState {
    IDLE = "idle",
    PAUSED = "paused",
    PLAYING = "playing",
    STOPPED = "stopped",
    WAITING = "waiting"

}

export type CCtrack = {
    id: string;
    language: string;
    kind: TextTrackKind;
    label?: string;
    default?: boolean;
}

export type CC = {
    text: string,
    startTime: number,
    endTime: number
}

export type Progress = {
    contentTime?: number;
    contentDuration?: number;
    streamTime?: number;
    streamDuration?: number;
    sessionTime?: number;
    playbackTime?: number;
    elapsedTimeMs?: number;
}

export type PlayerPlaybackState = {
    playbackState?: PlaybackState
}

export type PlayerQuality = {
    bitrate?: number;
    category?: string[];
    codec?: string;
    enabled?: boolean;
    height?: number;
    index?: number;
    width?: number;
}

export enum StreamType {
    VOD = 'vod',
    LIVE = 'live'
}

export type PlayerState = {
    url?: string,
    volume?: number,
    seek?: number,
    state?: PlayerControlState
    drmKey?: string,
    bearer?: string,
    cc?: CC,
    ccTracks?: CCtrack[],
    progress?: Progress,
    buffering?: boolean,
    playbackState?: PlayerPlaybackState,
    quality?: PlayerQuality,
    type?: StreamType,
    isDrm?: boolean
} 