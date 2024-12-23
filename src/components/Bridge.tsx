/// @ts-nocheck
import { useEffect, useRef, useReducer } from 'react'
import { PlayerContext, PlayerDispatchContext } from '../context/playerContext';
import {
    initPlayerState,
    playerReducer
} from '../reducers/player';
import { PlayerAction } from '../actions/index'
import { PlayerActions, PlayerState } from '../types'
import Player from './Player';

export default function Bridge() {

    const [state, dispatch] = useReducer(playerReducer, initPlayerState)
    const webview = useRef<object>(null)

    /* 3D WebView Bridge */
    useEffect(() => {

        if (window.webview) {
            addMessageReceiverListener()
        } else {
            window.addEventListener('webviewready', addMessageReceiverListener)
        }

        return () => {
            window?.removeEventListener('webviewready', addMessageReceiverListener)
            window?.webview?.removeEventListener('message', messageReceiver)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])

    const addMessageReceiverListener = () => {
        webview.current = window.webview
        webview.current.addEventListener('message', messageReceiver);
        postMessage(PlayerActions.BRIDGE_READY)
    }

    const postMessage = (type: string, payload: PlayerState | null = null, log: boolean = false) => {
        webview?.current?.postMessage({ type, payload });
        if (log) {
            console.log(type, JSON.stringify(payload))
        }
    }

    const messageReceiver = (event) => {
        let message = JSON.parse(event.data) as PlayerAction;
        dispatch(message)
    }

    return (
        <PlayerContext.Provider value={state}>
            <PlayerDispatchContext.Provider value={dispatch}>
                <Player postMessage={postMessage} />
            </PlayerDispatchContext.Provider>
        </PlayerContext.Provider>
    )
}
