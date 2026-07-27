<script lang="ts">
	import VoiceNoteRecorder from './VoiceNoteRecorder.svelte';

	let lastEvent = $state('');
	let blobSize = $state(0);
</script>

<div class="mx-auto max-w-lg space-y-4 p-4">
	<p class="text-sm text-secondary">
		Allow microphone access. The waveform reacts to your voice while recording; after Stop you can
		play or download the audio.
	</p>

	<VoiceNoteRecorder
		downloadName="demo-voice-note.webm"
		maxDuration={60}
		onstart={() => (lastEvent = 'recording…')}
		onstop={(blob) => {
			blobSize = blob?.size ?? 0;
			lastEvent = blob ? `stopped · ${(blob.size / 1024).toFixed(1)} KB` : 'stopped';
		}}
		oncancel={() => {
			lastEvent = 'cancelled';
			blobSize = 0;
		}}
		onrecorded={(blob) => {
			blobSize = blob.size;
			lastEvent = `saved · ${blob.type || 'audio'}`;
		}}
		onerror={(err) => (lastEvent = err.message)}
	/>

	{#if lastEvent}
		<p class="text-xs text-muted">{lastEvent}{#if blobSize} · {blobSize} bytes{/if}</p>
	{/if}
</div>
