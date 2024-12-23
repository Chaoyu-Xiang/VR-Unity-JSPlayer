import { PlayerActions, PlayerState } from "../types";
import { TextTrackInterface } from "@JSPlayer-js-react";

export interface PlayerBridge {
    postMessage: (action: PlayerActions, state?: PlayerState) => void
}

export interface CCTracks {
    details: TextTrackInterface,
}