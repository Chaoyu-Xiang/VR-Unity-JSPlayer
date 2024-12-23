import { createContext, useContext, Dispatch } from 'react'
import { PlayerState } from '../types';
import { PlayerAction } from '../actions';

export const PlayerContext = createContext<PlayerState | null>(null);
export const PlayerDispatchContext = createContext<Dispatch<PlayerAction> | null>(null);

export function usePlayerContext() {
    return useContext(PlayerContext);
}

export function usePlayerDispatchContext() {
    return useContext(PlayerDispatchContext);
}