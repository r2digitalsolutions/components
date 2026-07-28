import type { CanvasDocument, CanvasLayer } from './canvasDocument.js';

export type CanvasExportFormat = 'png' | 'jpeg' | 'json';

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous';
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error(`Failed to load ${src}`));
		img.src = src;
	});
}

function applyLayerTransform(
	ctx: CanvasRenderingContext2D,
	layer: CanvasLayer,
	cx: number,
	cy: number
) {
	ctx.translate(cx, cy);
	if (layer.rotation) ctx.rotate((layer.rotation * Math.PI) / 180);
	ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
	ctx.translate(-cx, -cy);
}

function drawShapePath(ctx: CanvasRenderingContext2D, layer: CanvasLayer) {
	const { x, y, w, h } = layer.rect;
	const fill = layer.fill ?? '#3b82f6';

	ctx.beginPath();
	switch (layer.kind) {
		case 'rect':
		case 'roundRect':
		case 'sticky': {
			const r = Math.min(layer.borderRadius ?? (layer.kind === 'roundRect' ? 24 : 0), w / 2, h / 2);
			if (r > 0 && typeof ctx.roundRect === 'function') {
				ctx.roundRect(x, y, w, h, r);
			} else {
				ctx.rect(x, y, w, h);
			}
			break;
		}
		case 'ellipse':
			ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
			break;
		case 'triangle':
			ctx.moveTo(x + w / 2, y);
			ctx.lineTo(x + w, y + h);
			ctx.lineTo(x, y + h);
			ctx.closePath();
			break;
		case 'diamond':
			ctx.moveTo(x + w / 2, y);
			ctx.lineTo(x + w, y + h / 2);
			ctx.lineTo(x + w / 2, y + h);
			ctx.lineTo(x, y + h / 2);
			ctx.closePath();
			break;
		case 'star': {
			const cx = x + w / 2;
			const cy = y + h / 2;
			const spikes = 5;
			const outer = Math.min(w, h) / 2;
			const inner = outer * 0.4;
			for (let i = 0; i < spikes * 2; i++) {
				const radius = i % 2 === 0 ? outer : inner;
				const angle = (i * Math.PI) / spikes - Math.PI / 2;
				const px = cx + Math.cos(angle) * radius;
				const py = cy + Math.sin(angle) * radius;
				if (i === 0) ctx.moveTo(px, py);
				else ctx.lineTo(px, py);
			}
			ctx.closePath();
			break;
		}
		case 'hexagon': {
			const cx = x + w / 2;
			const cy = y + h / 2;
			for (let i = 0; i < 6; i++) {
				const angle = (Math.PI / 3) * i - Math.PI / 6;
				const px = cx + (w / 2) * Math.cos(angle);
				const py = cy + (h / 2) * Math.sin(angle);
				if (i === 0) ctx.moveTo(px, py);
				else ctx.lineTo(px, py);
			}
			ctx.closePath();
			break;
		}
		case 'pentagon': {
			const cx = x + w / 2;
			const cy = y + h / 2;
			const r = Math.min(w, h) / 2;
			for (let i = 0; i < 5; i++) {
				const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
				const px = cx + r * Math.cos(angle);
				const py = cy + r * Math.sin(angle);
				if (i === 0) ctx.moveTo(px, py);
				else ctx.lineTo(px, py);
			}
			ctx.closePath();
			break;
		}
		case 'heart': {
			const cx = x + w / 2;
			const top = y + h * 0.3;
			ctx.moveTo(cx, y + h * 0.9);
			ctx.bezierCurveTo(x, y + h * 0.6, x, top, cx, y + h * 0.35);
			ctx.bezierCurveTo(x + w, top, x + w, y + h * 0.6, cx, y + h * 0.9);
			ctx.closePath();
			break;
		}
		case 'line': {
			const mid = y + h / 2;
			ctx.moveTo(x, mid);
			ctx.lineTo(x + w, mid);
			ctx.strokeStyle = fill;
			ctx.lineWidth = Math.max(2, layer.strokeWidth ?? 4);
			ctx.lineCap = 'round';
			ctx.stroke();
			return;
		}
		case 'arrow': {
			const mid = y + h / 2;
			const sw = Math.max(2, layer.strokeWidth ?? 4);
			ctx.strokeStyle = fill;
			ctx.fillStyle = fill;
			ctx.lineWidth = sw;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';
			ctx.moveTo(x, mid);
			ctx.lineTo(x + w * 0.78, mid);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(x + w * 0.68, mid - h * 0.35);
			ctx.lineTo(x + w * 0.95, mid);
			ctx.lineTo(x + w * 0.68, mid + h * 0.35);
			ctx.closePath();
			ctx.fill();
			return;
		}
		default:
			ctx.rect(x, y, w, h);
	}

	ctx.fillStyle = fill;
	ctx.fill();
	if (layer.stroke) {
		ctx.strokeStyle = layer.stroke;
		ctx.lineWidth = layer.strokeWidth ?? 2;
		ctx.stroke();
	}
}

function drawText(ctx: CanvasRenderingContext2D, layer: CanvasLayer) {
	const { x, y, w, h } = layer.rect;
	if (layer.kind === 'sticky' || layer.textBackground) {
		ctx.fillStyle = layer.kind === 'sticky' ? (layer.fill ?? '#fef08a') : (layer.textBackground as string);
		const r = layer.borderRadius ?? (layer.kind === 'sticky' ? 4 : 0);
		ctx.beginPath();
		if (r > 0 && typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, r);
		else ctx.rect(x, y, w, h);
		ctx.fill();
	}

	const size = layer.fontSize ?? 32;
	const weight = layer.fontWeight ?? 600;
	const style = layer.fontStyle ?? 'normal';
	const family = layer.fontFamily ?? 'system-ui, sans-serif';
	ctx.font = `${style} ${weight} ${size}px ${family}`;
	ctx.fillStyle = layer.color ?? (layer.kind === 'sticky' ? '#713f12' : '#0f172a');
	ctx.textBaseline = 'middle';
	ctx.textAlign = layer.textAlign === 'center' ? 'center' : layer.textAlign === 'right' ? 'right' : 'left';

	const pad = 8;
	const tx =
		layer.textAlign === 'center' ? x + w / 2 : layer.textAlign === 'right' ? x + w - pad : x + pad;
	const ty = layer.kind === 'sticky' ? y + pad + size / 2 : y + h / 2;
	const text = layer.text ?? (layer.kind === 'sticky' ? 'Note' : 'Text');

	if (layer.textDecoration === 'underline' || layer.textDecoration === 'line-through') {
		const metrics = ctx.measureText(text);
		const tw = metrics.width;
		const left =
			layer.textAlign === 'center' ? tx - tw / 2 : layer.textAlign === 'right' ? tx - tw : tx;
		ctx.fillText(text, tx, ty);
		ctx.beginPath();
		ctx.strokeStyle = ctx.fillStyle as string;
		ctx.lineWidth = Math.max(1, size / 16);
		const lineY =
			layer.textDecoration === 'line-through' ? ty : ty + size * 0.4;
		ctx.moveTo(left, lineY);
		ctx.lineTo(left + tw, lineY);
		ctx.stroke();
	} else {
		ctx.fillText(text, tx, ty);
	}
}

async function drawLayer(ctx: CanvasRenderingContext2D, layer: CanvasLayer) {
	if (!layer.visible || layer.opacity <= 0) return;

	ctx.save();
	ctx.globalAlpha = layer.opacity;

	const { x, y, w, h } = layer.rect;
	const cx = x + w / 2;
	const cy = y + h / 2;
	applyLayerTransform(ctx, layer, cx, cy);

	if (layer.shadowBlur) {
		ctx.shadowBlur = layer.shadowBlur;
		ctx.shadowColor = layer.shadowColor ?? 'rgba(0,0,0,0.35)';
		ctx.shadowOffsetY = Math.round(layer.shadowBlur / 3);
	}

	if (layer.blur) {
		ctx.filter = `blur(${layer.blur}px)`;
	}

	if ((layer.kind === 'image' || layer.kind === 'video') && layer.src) {
		try {
			const img = await loadImage(layer.src);
			const fit = layer.objectFit ?? 'cover';
			if (layer.borderRadius) {
				ctx.beginPath();
				if (typeof ctx.roundRect === 'function') {
					ctx.roundRect(x, y, w, h, layer.borderRadius);
				} else {
					ctx.rect(x, y, w, h);
				}
				ctx.clip();
			}
			if (fit === 'fill') {
				ctx.drawImage(img, x, y, w, h);
			} else {
				const scale =
					fit === 'contain'
						? Math.min(w / img.naturalWidth, h / img.naturalHeight)
						: Math.max(w / img.naturalWidth, h / img.naturalHeight);
				const dw = img.naturalWidth * scale;
				const dh = img.naturalHeight * scale;
				const dx = x + (w - dw) / 2;
				const dy = y + (h - dh) / 2;
				ctx.drawImage(img, dx, dy, dw, dh);
			}
		} catch {
			ctx.fillStyle = '#e2e8f0';
			ctx.fillRect(x, y, w, h);
			ctx.fillStyle = '#64748b';
			ctx.font = '14px system-ui';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(layer.name || 'Media', x + w / 2, y + h / 2);
		}
	} else if (layer.kind === 'text' || layer.kind === 'sticky') {
		drawText(ctx, layer);
	} else {
		drawShapePath(ctx, layer);
	}

	ctx.restore();
}

/** Parse CSS color alpha; `transparent` / missing → 0. */
export function backgroundAlpha(color: string | undefined): number {
	const raw = (color ?? '').trim().toLowerCase();
	if (!raw || raw === 'transparent') return 0;
	if (raw.startsWith('#')) {
		const hex = raw.slice(1);
		if (hex.length === 4) return parseInt(hex[3] + hex[3], 16) / 255;
		if (hex.length === 8) return parseInt(hex.slice(6, 8), 16) / 255;
		return 1;
	}
	const m = raw.match(/^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*([\d.]+))?\s*\)$/);
	if (m) return m[1] !== undefined ? Number(m[1]) : 1;
	const h = raw.match(
		/^hsla?\(\s*[\d.]+\s*,\s*[\d.]+%\s*,\s*[\d.]+%(?:\s*,\s*([\d.]+))?\s*\)$/
	);
	if (h) return h[1] !== undefined ? Number(h[1]) : 1;
	return 1;
}

/** Renders the artboard at 1:1 document pixels into an offscreen canvas. */
export async function renderCanvasDocument(
	doc: CanvasDocument,
	opts?: { opaqueBackground?: boolean }
): Promise<HTMLCanvasElement> {
	const canvas = document.createElement('canvas');
	canvas.width = Math.max(1, Math.round(doc.width));
	canvas.height = Math.max(1, Math.round(doc.height));
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Canvas 2D unavailable');

	const bg = doc.background?.trim() || '#ffffff';
	const alpha = backgroundAlpha(bg);
	if (opts?.opaqueBackground || alpha > 0.001) {
		ctx.fillStyle = opts?.opaqueBackground && alpha < 0.001 ? '#ffffff' : bg;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	const layers = [...doc.layers].sort((a, b) => a.zIndex - b.zIndex);
	for (const layer of layers) {
		await drawLayer(ctx, layer);
	}
	return canvas;
}

export async function exportCanvasBlob(
	doc: CanvasDocument,
	format: 'png' | 'jpeg' = 'png',
	quality = 0.92
): Promise<Blob> {
	// JPEG has no alpha — force an opaque fill when the artboard is transparent.
	const canvas = await renderCanvasDocument(doc, { opaqueBackground: format === 'jpeg' });
	const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => (blob ? resolve(blob) : reject(new Error('Export failed'))),
			mime,
			quality
		);
	});
}

export function downloadBlob(blob: Blob, filename: string) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
