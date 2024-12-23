// @ts-nocheck
import { useRef, useState, useEffect } from 'react'
import {
    Autoplay,
    JSPlayer,
    PlayerEvent,
    PlayerOptionsInterface,
    ResourceConfigurationInterface,
    VideoPlayerInterface,
    TextTrackInfoChangeEventInterface,
    ContentProgressEventInterface,
    PlayerEventInterface,
} from '@JSPlayer-js-react';
import { dashjs, DASHJS } from '@JSPlayer-js-dashjs';
import { usePlayerContext, usePlayerDispatchContext } from '../context/playerContext';
import { PlayerActions, PlayerState, PlayerControlState } from '../types';
import { PlayerBridge } from '../interfaces';
import PostMessage from '../objects/PostMessage';
import { hlsjs, HLSJS } from '@JSPlayer-js-hlsjs';

export default function Player({ postMessage }: PlayerBridge) {

    const playerRef = useRef<VideoPlayerInterface>()
    const postMessageRef = useRef<PostMessage>()

    const playerState = usePlayerContext<PlayerState>()
    const dispatch = usePlayerDispatchContext<Dispatch<PlayerAction>>()

    const url = useRef<string>()
    const CCLoaded = useRef<boolean>(false)

    /* JSPlayer Player Settings and Initial State */
    const [options] = useState<PlayerOptionsInterface>({
        //for development purposes, this will allow visualize the video on start in browsers
        autoplay: Autoplay.ATTEMPT_UNMUTED,
        renderTextTrackNatively: false,
        textLanguage: 'en',
        plugins: [
            dashjs(),
            hlsjs()
        ]
    });

    const [resource, setResource] = useState<ResourceConfigurationInterface>({
        location: null
    })

    const CCEntry = (e) => {
        const cues = e.detail.activeCues;
        let processedCues: TextCuepointInterface[] = new Array<TextCuepointInterface>()
        cues.forEach(textCue => {
            processedCues.push({
                text: textCue.text,
                startTime: textCue.startTime,
                endTime: textCue.endTime
            })
        });
        for (let i = processedCues.length - 1; i > 0; i--) {
            if (processedCues[i].startTime === processedCues[i - 1]?.startTime) {
                if (processedCues[i].text !== processedCues[i - 1].text)
                    processedCues[i - 1].text = processedCues[i].text + " " + processedCues[i - 1].text
                processedCues.splice(i, 1)
            }
        }
        processedCues.forEach(textCue => {
            postMessageRef.current.setCC(textCue)
        })
    };

    const getJSPlayerAdapter = (playerState: PlayerState) => {
        return playerState.isDrm === false ? HLSJS : DASHJS
    }

    useEffect(() => {
        if (playerState) {
            if (url.current !== playerState.url && playerState.url !== undefined) {
                const composedResource = {
                    location: {
                        mediaUrl: playerState.url,
                        drm: {
                            widevine: {
                                url: playerState.drmKey,
                                header: {
                                    "Authorization": "Bearer " + playerState.bearer
                                },
                                "audioRobustness": "SW_SECURE_CRYPTO",
                                "videoRobustness": "SW_SECURE_CRYPTO"
                            }
                        }
                    },
                    playback: {
                        adapter: {
                            id: getJSPlayerAdapter(playerState),
                        }
                    }
                }
                setResource(composedResource)
                url.current = playerState.url
            }

            const player = playerRef.current

            if (player) {

                //Volume
                player.volume = playerState.volume

                //Seek and Reset
                if (playerState.seek !== undefined) {
                    //seconds between 0 and content duration
                    player.seek(playerState.seek)
                    dispatch({
                        type: PlayerActions.SET_SEEK,
                        payload: {
                            ...playerState,
                            seek: undefined
                        }
                    })
                }

                // Play                
                if (playerState.state === PlayerControlState.PLAYING)
                    player.play()

                //Pause
                if (playerState.state === PlayerControlState.PAUSED)
                    player.pause()

                //Stop
                if (playerState.state === PlayerControlState.STOP)
                    player.stop()
            }
        }
    }, [playerState, dispatch])

    const listenToTextTracksChange = (event: TextTrackInfoChangeEventInterface) => {
        if (!CCLoaded.current) {
            playerRef.current?.off(PlayerEvent.TEXT_CUEPOINT, CCEntry)
            postMessageRef.current.setCCTracks(event.detail.textTracks)
            playerRef.current.textTrackEnabled = true
            playerRef.current.on(PlayerEvent.TEXT_CUEPOINT, CCEntry)
            CCLoaded.current = true
        }

        // Temp fix for CC breaking after an ad break
        // if (playerRef.current.getAdapter('playback').getId() === DASHJS) {
        //     playerRef.current.getAdapter('playback').player.enableText(false)
        //     playerRef.current.getAdapter('playback').player.enableText(true)
        // }
    }

    const listenToContentProgress = (progress: ContentProgressEventInterface) => {
        postMessageRef.current.setProgress(progress.detail)
    }

    const listenToContentStart = (player: PlayerEventInterface) => {
        postMessageRef.current.setStarted()
    }

    const listenToContentDuration = (player: PlayerEventInterface) => {
        postMessageRef.current.setDuration(player.target.contentDuration)
    }

    const listenToContentComplete = () => {
        postMessageRef.current.setEnd()
    }

    const listenToResourceBuffering = (player: ResourceBufferingEventInterface) => {
        postMessageRef.current.setBuffering(player.detail.buffering)
    }

    const listenToPlayerStateChange = (player: PlaybackStateChangeEventInterface) => {
        postMessageRef.current.setPlayerState(player.detail.playbackState)
    }

    const listenToQualityChange = (player: QualityChangeEventInterface) => {
        postMessageRef.current.setPlayerQuality(player.detail.quality)
    }

    const listenToPlayerChange = (player: VideoPlayerInterface) => {
        if (player) {


            if (playerRef.current) {
                //Clear listeners
                playerRef.current.off(PlayerEvent.TEXT_CUEPOINT, CCEntry)
                playerRef.current.off(PlayerEvent.TEXT_TRACKS_CHANGE, listenToTextTracksChange)
                playerRef.current.off(PlayerEvent.LOG_EVENT, listenToContentProgress)
                playerRef.current.off(PlayerEvent.CONTENT_START, listenToContentStart)
                playerRef.current.off(PlayerEvent.CONTENT_DURATION_AVAILABLE, listenToContentDuration)
                playerRef.current.off(PlayerEvent.CONTENT_COMPLETE, listenToContentComplete)
                playerRef.current.off(PlayerEvent.RESOURCE_BUFFERING, listenToResourceBuffering)
                playerRef.current.off(PlayerEvent.PLAYBACK_STATE_CHANGE, listenToPlayerStateChange)
                playerRef.current.off(PlayerEvent.QUALITY_CHANGE, listenToQualityChange)
            }
            playerRef.current = player
            CCLoaded.current = false

            //CC
            playerRef.current.on(PlayerEvent.TEXT_TRACKS_CHANGE, listenToTextTracksChange)

            //Content events
            playerRef.current.on(PlayerEvent.CONTENT_PROGRESS, listenToContentProgress)
            playerRef.current.on(PlayerEvent.CONTENT_START, listenToContentStart)
            playerRef.current.on(PlayerEvent.CONTENT_DURATION_AVAILABLE, listenToContentDuration)
            playerRef.current.on(PlayerEvent.CONTENT_COMPLETE, listenToContentComplete)
            playerRef.current.on(PlayerEvent.RESOURCE_BUFFERING, listenToResourceBuffering)
            playerRef.current.on(PlayerEvent.PLAYBACK_STATE_CHANGE, listenToPlayerStateChange)
            playerRef.current.on(PlayerEvent.QUALITY_CHANGE, listenToQualityChange)

            postMessageRef.current.setPlayerReady()

        }
    }

    // Trace resource events
    useEffect(() => { console.log(`Resource: ${JSON.stringify(resource)}`) }, [resource])
    useEffect(() => {
        if (postMessage) {
            postMessageRef.current = new PostMessage(postMessage)
        }
    }, [postMessage])

    return (
        <JSPlayer
            options={options}
            ref={listenToPlayerChange}
            onError={error => console.log(error)}
            onPlayerChange={player => console.log(player)}
            resource={resource}
            hls={true}
            dash={true}
        />
    )
}
