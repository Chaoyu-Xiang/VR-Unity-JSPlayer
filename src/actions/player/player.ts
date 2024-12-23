import { PlayerActions, PlayerState } from "../../types";

export type PlayerAction = {
    type: PlayerActions,
    payload: PlayerState
}