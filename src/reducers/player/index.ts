import { PlayerState, PlayerActions, PlayerControlState } from "../../types"
import { PlayerAction } from "../../actions"

export const initPlayerState: PlayerState = {
    url: undefined,
    volume: 1,
    seek: undefined,
    state: PlayerControlState.PLAYING,
    drmKey: undefined,
    bearer: undefined
}

export const playerReducer = (playerState: PlayerState, action: PlayerAction): PlayerState => {
    switch (action?.type) {
        case PlayerActions.SET_URL:
            return {
                ...playerState,
                url: action.payload.url,
                drmKey: (action.payload.drmKey ? action.payload.drmKey : undefined),
                bearer: action.payload.bearer,
                type: action.payload.type,
                isDrm: action.payload.isDrm,
                state: PlayerControlState.PLAYING
            }
        case PlayerActions.SET_VOLUME:
            return {
                ...playerState,
                volume: action.payload.volume
            }
        case PlayerActions.SET_SEEK:
            return {
                ...playerState,
                seek: action.payload.seek
            }
        case PlayerActions.PLAY:
            return {
                ...playerState,
                state: PlayerControlState.PLAYING
            }
        case PlayerActions.PAUSE:
            return {
                ...playerState,
                state: PlayerControlState.PAUSED
            }
        case PlayerActions.STOP:
            return {
                ...playerState,
                state: PlayerControlState.STOP
            }
        default: {
            //throw Error('Unknown action: ' + action?.type);
            return playerState;
        }
    }
}