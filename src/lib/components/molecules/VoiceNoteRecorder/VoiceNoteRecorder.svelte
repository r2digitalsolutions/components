<script lang="ts">
	import WaveBars from '$lib/components/atoms/WaveBars/WaveBars.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import Mic from '@lucide/svelte/icons/mic';
	import Square from '@lucide/svelte/icons/square';
	import X from '@lucide/svelte/icons/x';
	import Play from '@lucide/svelte/icons/play';
	import Pause from '@lucide/svelte/icons/pause';
	import Download from '@lucide/svelte/icons/download';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import Trash2 from '@lucide/svelte/icons/trash-2';

	export type VoiceNoteStatus = 'idle' | 'recording' | 'recorded' | 'playing';

	interface VoiceNoteRecorderProps {
		recording?: boolean;
		duration?: number;
		bars?: number[];
		barCount?: number;
		maxDuration?: number;
		downloadName?: string;
		disabled?: boolean;
		class?: string;
		onstart?: () => void;
		onstop?: (blob: Blob | null) => void;
		oncancel?: () => void;
		onrecorded?: (blob: Blob, url: string) => void;
		onerror?: (error: Error) => void;
	}

	let {
		recording = $bindable(false),
		duration = $bindable(0),
		bars,
		barCount = 40,
		maxDuration = 120,
		downloadName = 'voice-note.webm',
		disabled = false,
		class: className = '',
		onstart,
		onstop,
		oncancel,
		onrecorded,
		onerror
	}: VoiceNoteRecorderProps = $props();

	let status = $state<VoiceNoteStatus>('idle');
	let liveBars = $state<number[]>(Array.from({ length: 40 }, () => 0.12));
	let recordedBars = $state<number[]>([]);
	let errorMsg = $state('');
	let playProgress = $state(0);
	let playTime = $state(0);

	let mediaRecorder: MediaRecorder | null = null;
	let mediaStream: MediaStream | null = null;
	let audioCtx: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let rafId = 0;
	let playRafId = 0;
	let chunks: BlobPart[] = [];
	let blob: Blob | null = null;
	let objectUrl = $state<string | null>(null);
	let audioEl = $state<HTMLAudioElement | null>(null);
	let startedAt = 0;
	let durationTimer: ReturnType<typeof setInterval> | undefined;
	let samples: number[] = [];
	let recordedDuration = $state(0);
	let srcReady = false;

	const displayBars = $derived(bars?.length ? bars : status === 'recording' ? liveBars : recordedBars);
	const displayTime = $derived(
		status === 'playing'
			? `${formatTime(playTime)} / ${formatTime(recordedDuration)}`
			: formatTime(status === 'recording' ? duration : recordedDuration || duration)
	);
	const isRecording = $derived(status === 'recording');
	const hasRecording = $derived(status === 'recorded' || status === 'playing');

	function formatTime(total: number) {
		const safe = Math.max(0, total);
		const mins = Math.floor(safe / 60);
		const secs = Math.floor(safe % 60);
		return `${mins}:${String(secs).padStart(2, '0')}`;
	}

	function clearTimers() {
		if (durationTimer) clearInterval(durationTimer);
		durationTimer = undefined;
		if (rafId) cancelAnimationFrame(rafId);
		rafId = 0;
		stopPlayLoop();
	}

	function stopPlayLoop() {
		if (playRafId) cancelAnimationFrame(playRafId);
		playRafId = 0;
	}

	function stopTracks() {
		mediaStream?.getTracks().forEach((t) => t.stop());
		mediaStream = null;
		if (audioCtx) {
			void audioCtx.close().catch(() => {});
			audioCtx = null;
		}
		analyser = null;
		mediaRecorder = null;
	}

	function revokeUrl() {
		if (objectUrl) URL.revokeObjectURL(objectUrl);
		objectUrl = null;
		srcReady = false;
	}

	function resetAudio() {
		stopPlayLoop();
		if (audioEl) {
			audioEl.pause();
			audioEl.removeAttribute('src');
			audioEl.load();
		}
		playProgress = 0;
		playTime = 0;
		srcReady = false;
	}

	function downsample(levels: number[], count: number): number[] {
		if (!levels.length) return Array.from({ length: count }, () => 0.12);
		if (levels.length <= count) {
			const pad = Array.from({ length: count - levels.length }, () => 0.12);
			return [...levels.map((v) => Math.min(1, Math.max(0.08, v))), ...pad];
		}
		const out: number[] = [];
		const bucket = levels.length / count;
		for (let i = 0; i < count; i++) {
			const start = Math.floor(i * bucket);
			const end = Math.floor((i + 1) * bucket);
			let peak = 0;
			for (let j = start; j < end; j++) peak = Math.max(peak, levels[j] ?? 0);
			out.push(Math.min(1, Math.max(0.08, peak)));
		}
		return out;
	}

	function tickAnalyser() {
		if (!analyser || status !== 'recording') return;
		const data = new Uint8Array(analyser.fftSize);
		analyser.getByteTimeDomainData(data);

		let sum = 0;
		for (let i = 0; i < data.length; i++) {
			const v = (data[i] - 128) / 128;
			sum += v * v;
		}
		const rms = Math.sqrt(sum / data.length);
		const level = Math.min(1, Math.pow(rms * 2.4, 0.7));

		samples.push(level);
		const window = samples.slice(-barCount);
		liveBars = Array.from({ length: barCount }, (_, i) => {
			const idx = i - (barCount - window.length);
			return idx >= 0 ? Math.max(0.1, window[idx]!) : 0.1;
		});

		rafId = requestAnimationFrame(tickAnalyser);
	}

	function tickPlayback() {
		if (!audioEl || status !== 'playing') {
			stopPlayLoop();
			return;
		}
		const total = audioEl.duration;
		if (total && Number.isFinite(total) && total > 0) {
			playProgress = Math.min(1, audioEl.currentTime / total);
			playTime = audioEl.currentTime;
			if (!recordedDuration || Math.abs(recordedDuration - total) > 0.35) {
				recordedDuration = total;
			}
		}
		playRafId = requestAnimationFrame(tickPlayback);
	}

	async function startRecording() {
		if (disabled || typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
			errorMsg = 'Microphone is not available in this environment.';
			onerror?.(new Error(errorMsg));
			return;
		}

		errorMsg = '';
		resetAudio();
		revokeUrl();
		blob = null;
		chunks = [];
		samples = [];
		recordedBars = [];
		liveBars = Array.from({ length: barCount }, () => 0.12);
		duration = 0;
		recordedDuration = 0;

		try {
			mediaStream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true
				}
			});

			audioCtx = new AudioContext();
			const source = audioCtx.createMediaStreamSource(mediaStream);
			analyser = audioCtx.createAnalyser();
			analyser.fftSize = 512;
			analyser.smoothingTimeConstant = 0.65;
			source.connect(analyser);

			const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
				? 'audio/webm;codecs=opus'
				: MediaRecorder.isTypeSupported('audio/webm')
					? 'audio/webm'
					: '';

			mediaRecorder = mime
				? new MediaRecorder(mediaStream, { mimeType: mime })
				: new MediaRecorder(mediaStream);

			mediaRecorder.ondataavailable = (e) => {
				if (e.data.size > 0) chunks.push(e.data);
			};

			mediaRecorder.onstop = () => {
				const type = mediaRecorder?.mimeType || 'audio/webm';
				blob = new Blob(chunks, { type });
				revokeUrl();
				objectUrl = URL.createObjectURL(blob);
				recordedBars = downsample(samples.length ? samples : liveBars, barCount);
				recordedDuration = Math.max(duration, 0.5);
				status = 'recorded';
				recording = false;
				onrecorded?.(blob, objectUrl);
				onstop?.(blob);
				stopTracks();
			};

			mediaRecorder.start(100);
			status = 'recording';
			recording = true;
			startedAt = Date.now();
			onstart?.();

			durationTimer = setInterval(() => {
				duration = Math.floor((Date.now() - startedAt) / 1000);
				if (duration >= maxDuration) stopRecording();
			}, 200);

			tickAnalyser();
		} catch (err) {
			stopTracks();
			status = 'idle';
			recording = false;
			errorMsg =
				err instanceof Error ? err.message : 'Could not access the microphone. Check permissions.';
			onerror?.(err instanceof Error ? err : new Error(errorMsg));
		}
	}

	function stopRecording() {
		clearTimers();
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
		} else {
			stopTracks();
			status = samples.length ? 'recorded' : 'idle';
			recording = false;
			onstop?.(blob);
		}
	}

	function cancelRecording() {
		clearTimers();
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.onstop = null;
			mediaRecorder.stop();
		}
		stopTracks();
		chunks = [];
		samples = [];
		blob = null;
		revokeUrl();
		resetAudio();
		liveBars = Array.from({ length: barCount }, () => 0.12);
		recordedBars = [];
		recordedDuration = 0;
		duration = 0;
		status = 'idle';
		recording = false;
		oncancel?.();
	}

	function deleteRecording() {
		cancelRecording();
	}

	function ensureAudioSrc() {
		if (!objectUrl || !audioEl) return false;
		if (!srcReady || audioEl.src !== objectUrl) {
			audioEl.src = objectUrl;
			srcReady = true;
		}
		return true;
	}

	function togglePlayback() {
		if (!objectUrl || !audioEl) return;
		if (status === 'playing') {
			audioEl.pause();
			stopPlayLoop();
			status = 'recorded';
			return;
		}
		if (!ensureAudioSrc()) return;
		if (playProgress >= 0.995) {
			audioEl.currentTime = 0;
			playProgress = 0;
			playTime = 0;
		}
		void audioEl.play().then(() => {
			status = 'playing';
			stopPlayLoop();
			playRafId = requestAnimationFrame(tickPlayback);
		});
	}

	function downloadRecording() {
		if (!objectUrl || !blob) return;
		const a = document.createElement('a');
		a.href = objectUrl;
		a.download =
			downloadName.endsWith('.webm') || downloadName.includes('.')
				? downloadName
				: `${downloadName}.webm`;
		a.click();
	}

	function onAudioEnded() {
		stopPlayLoop();
		status = 'recorded';
		playProgress = 1;
		playTime = recordedDuration;
	}

	$effect(() => {
		return () => {
			clearTimers();
			stopTracks();
			revokeUrl();
		};
	});
</script>

<audio bind:this={audioEl} class="hidden" preload="metadata" onended={onAudioEnded}></audio>

<div
	class={[
		'flex flex-col gap-3 rounded-2xl border border-border bg-surface-elevated px-4 py-3',
		isRecording && 'border-red-500/35 ring-1 ring-red-500/10',
		hasRecording && 'border-brand-500/25',
		className
	]}
>
	<div class="flex items-center gap-3">
		<span
			class={[
				'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors',
				isRecording
					? 'animate-pulse bg-red-500/15 text-red-600 dark:text-red-400'
					: hasRecording
						? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
						: 'bg-surface-overlay text-secondary'
			]}
		>
			<Mic class="h-5 w-5" strokeWidth={2} aria-hidden="true" />
		</span>

		<div class="min-w-0 flex-1">
			{#if status === 'idle'}
				<div class="flex flex-col justify-center gap-0 leading-none">
					<p class="text-sm font-semibold leading-tight text-primary">Voice note</p>
					<p class="text-[11px] leading-tight text-muted">
						Tap record — wave follows your voice
					</p>
				</div>
			{:else}
				<div class="flex items-center gap-3">
					<WaveBars
						bars={displayBars}
						active={isRecording}
						progress={hasRecording ? playProgress : undefined}
						tone={isRecording ? 'danger' : 'brand'}
						height={36}
						class="min-w-0 flex-1"
					/>
					<span class="shrink-0 font-mono text-xs tabular-nums text-muted">{displayTime}</span>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex flex-wrap items-center gap-2">
		{#if status === 'idle'}
			<Button size="sm" disabled={disabled} onclick={startRecording}>
				<Mic class="h-4 w-4" strokeWidth={2} aria-hidden="true" />
				Record
			</Button>
		{:else if isRecording}
			<Button size="sm" variant="destructive" onclick={stopRecording}>
				<Square class="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden="true" />
				Stop
			</Button>
			<Button size="sm" variant="ghost" onclick={cancelRecording}>
				<X class="h-4 w-4" strokeWidth={2} aria-hidden="true" />
				Cancel
			</Button>
		{:else}
			<Button size="sm" onclick={togglePlayback}>
				{#if status === 'playing'}
					<Pause class="h-4 w-4" strokeWidth={2} aria-hidden="true" />
					Pause
				{:else}
					<Play class="h-4 w-4" strokeWidth={2} aria-hidden="true" />
					Play
				{/if}
			</Button>
			<Button size="sm" variant="secondary" onclick={downloadRecording}>
				<Download class="h-4 w-4" strokeWidth={2} aria-hidden="true" />
				Download
			</Button>
			<IconButton label="Record again" size="sm" variant="ghost" onclick={startRecording}>
				<RotateCcw class="h-4 w-4" aria-hidden="true" />
			</IconButton>
			<IconButton label="Delete recording" size="sm" variant="ghost" onclick={deleteRecording}>
				<Trash2 class="h-4 w-4" aria-hidden="true" />
			</IconButton>
		{/if}
	</div>

	{#if errorMsg}
		<p class="text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
	{/if}
</div>
