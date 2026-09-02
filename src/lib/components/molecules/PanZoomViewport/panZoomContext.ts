import { getContext } from 'svelte';

export const PAN_ZOOM_CTX = Symbol('panZoom');

export type PanZoomContext = {
	consumeClick: () => boolean;
};

export function getPanZoomContext() {
	return getContext<PanZoomContext | undefined>(PAN_ZOOM_CTX);
}
