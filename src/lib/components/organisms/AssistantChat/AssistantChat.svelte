<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from '$lib/components/atoms/IconButton/IconButton.svelte';
	import {
		Sparkles,
		X,
		Send,
		Mic,
		MicOff,
		Volume2,
		VolumeX,
		LoaderCircle,
		RotateCcw
	} from '@lucide/svelte';

	export interface AssistantMessage {
		id: string;
		role: 'user' | 'assistant';
		content: string;
	}

	interface AssistantChatProps {
		open?: boolean;
		title?: string;
		statusLabel?: string;
		placeholder?: string;
		emptyHint?: string;
		suggestions?: string[];
		messages?: AssistantMessage[];
		draft?: string;
		loading?: boolean;
		loadingLabel?: string;
		/** When false, input stays disabled via `loading` but the spinner bubble is hidden (parent paints status in a message). */
		showLoadingBubble?: boolean;
		error?: string | null;
		voiceEnabled?: boolean;
		voiceOutput?: boolean;
		listening?: boolean;
		newChatLabel?: string;
		closeLabel?: string;
		sendLabel?: string;
		micLabel?: string;
		stopMicLabel?: string;
		voiceOnLabel?: string;
		voiceOffLabel?: string;
		class?: string;
		result?: Snippet<[AssistantMessage]>;
		footerExtra?: Snippet;
		onsend?: () => void;
		onclose?: () => void;
		onnewchat?: () => void;
		onmicclick?: () => void;
		onvoiceoutputchange?: (on: boolean) => void;
		onsuggestion?: (text: string) => void;
	}

	let {
		open = $bindable(false),
		title = 'Asistente',
		statusLabel,
		placeholder = 'Escribe un mensaje…',
		emptyHint = '¿En qué puedo ayudarte?',
		suggestions = [],
		messages = [],
		draft = $bindable(''),
		loading = false,
		loadingLabel = 'Procesando…',
		showLoadingBubble = true,
		error = null,
		voiceEnabled = true,
		voiceOutput = $bindable(true),
		listening = false,
		newChatLabel = 'Nueva conversación',
		closeLabel = 'Cerrar',
		sendLabel = 'Enviar',
		micLabel = 'Activar micrófono',
		stopMicLabel = 'Detener micrófono',
		voiceOnLabel = 'Voz activada',
		voiceOffLabel = 'Voz desactivada',
		class: className = '',
		result,
		footerExtra,
		onsend,
		onclose,
		onnewchat,
		onmicclick,
		onvoiceoutputchange,
		onsuggestion
	}: AssistantChatProps = $props();

	let scrollEl = $state<HTMLDivElement | null>(null);

	const isEmpty = $derived(messages.length === 0 && !loading);
	const canSend = $derived(draft.trim().length > 0 && !loading);

	$effect(() => {
		void messages.length;
		void loading;
		const el = scrollEl;
		if (!el) return;
		const raf = requestAnimationFrame(() => {
			if (el) el.scrollTop = el.scrollHeight;
		});
		return () => cancelAnimationFrame(raf);
	});

	function handleClose() {
		open = false;
		onclose?.();
	}

	function handleSend() {
		if (!canSend) return;
		onsend?.();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	}

	function handleSuggestion(text: string) {
		draft = text;
		onsuggestion?.(text);
	}

	function toggleVoice() {
		voiceOutput = !voiceOutput;
		onvoiceoutputchange?.(voiceOutput);
	}
</script>

<div
	class={[
		'flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-xl',
		'h-[min(560px,70vh)] w-full min-w-[320px] max-w-[420px]',
		className
	]}
	role="complementary"
	aria-label={title}
>
	<!-- Header -->
	<header class="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2.5">
		<span
			class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400"
			aria-hidden="true"
		>
			<Sparkles size={15} strokeWidth={2} />
		</span>
		<div class="min-w-0 flex-1">
			<p class="truncate text-sm font-semibold text-primary">{title}</p>
			{#if statusLabel}
				<p class="truncate text-xs text-muted">{statusLabel}</p>
			{/if}
		</div>
		<IconButton variant="ghost" size="xs" label={newChatLabel} onclick={() => onnewchat?.()}>
			<RotateCcw size={14} strokeWidth={2} />
		</IconButton>
		<IconButton variant="ghost" size="xs" label={closeLabel} onclick={handleClose}>
			<X size={14} strokeWidth={2} />
		</IconButton>
	</header>

	<!-- Body -->
	<div bind:this={scrollEl} class="min-h-0 flex-1 overflow-y-auto px-3 py-3">
		{#if isEmpty}
			<div class="flex flex-col items-center justify-center gap-4 py-8 text-center">
				<span
					class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-950/30 dark:text-brand-400"
					aria-hidden="true"
				>
					<Sparkles size={24} strokeWidth={1.5} />
				</span>
				<p class="text-sm text-muted">{emptyHint}</p>
				{#if suggestions.length}
					<div class="flex flex-wrap justify-center gap-2">
						{#each suggestions as suggestion (suggestion)}
							<button
								type="button"
								class="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-secondary transition-colors hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400"
								onclick={() => handleSuggestion(suggestion)}
							>
								{suggestion}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<div class="flex flex-col gap-3">
				{#each messages as message (message.id)}
					{#if message.role === 'user'}
						<div class="flex justify-end">
							<div
								class="max-w-[80%] rounded-2xl rounded-br-sm bg-brand-600 px-3.5 py-2.5 text-sm leading-relaxed text-white"
							>
								{message.content}
							</div>
						</div>
					{:else}
						<div class="flex flex-col gap-1.5">
							<div class="flex items-start gap-2">
								<span
									class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400"
									aria-hidden="true"
								>
									<Sparkles size={12} strokeWidth={2} />
								</span>
								<div
									class="max-w-[calc(100%-2rem)] rounded-2xl rounded-bl-sm bg-surface-overlay px-3.5 py-2.5 text-sm leading-relaxed text-primary"
								>
									{message.content}
								</div>
							</div>
							{#if result}
								<div class="ml-8">
									{@render result(message)}
								</div>
							{/if}
						</div>
					{/if}
				{/each}

				{#if loading && showLoadingBubble}
					<div class="flex items-center gap-2">
						<span
							class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400"
							aria-hidden="true"
						>
							<Sparkles size={12} strokeWidth={2} />
						</span>
						<div
							class="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-surface-overlay px-3.5 py-2.5"
						>
							<LoaderCircle size={14} strokeWidth={2} class="animate-spin text-muted" />
							<span class="text-xs text-muted">{loadingLabel}</span>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Footer -->
	<footer class="shrink-0 border-t border-border px-3 py-2.5">
		<div class="flex items-center gap-1.5">
			<input
				type="text"
				bind:value={draft}
				placeholder={listening ? statusLabel || placeholder : placeholder}
				class={[
					'h-9 min-w-0 flex-1 rounded-xl border bg-surface px-3 text-sm text-primary outline-none transition-shadow placeholder:text-muted focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20',
					listening ? 'border-red-400 ring-2 ring-red-500/20' : 'border-border'
				]}
				disabled={loading}
				onkeydown={handleKeydown}
				aria-label={placeholder}
			/>

			<div class="flex shrink-0 items-center gap-0.5">
				{#if voiceEnabled}
					<IconButton
						variant="ghost"
						size="sm"
						label={listening ? stopMicLabel : micLabel}
						onclick={() => onmicclick?.()}
						class={listening ? 'text-red-500 hover:text-red-600' : ''}
					>
						{#if listening}
							<MicOff size={16} strokeWidth={2} />
						{:else}
							<Mic size={16} strokeWidth={2} />
						{/if}
					</IconButton>
					<IconButton
						variant="ghost"
						size="sm"
						label={voiceOutput ? voiceOnLabel : voiceOffLabel}
						onclick={toggleVoice}
					>
						{#if voiceOutput}
							<Volume2 size={16} strokeWidth={2} />
						{:else}
							<VolumeX size={16} strokeWidth={2} />
						{/if}
					</IconButton>
				{/if}

				<IconButton
					variant={canSend ? 'primary' : 'ghost'}
					size="sm"
					label={sendLabel}
					disabled={!canSend}
					onclick={handleSend}
				>
					<Send size={16} strokeWidth={2} />
				</IconButton>
			</div>
		</div>

		{#if error}
			<p class="mt-1.5 px-1 text-xs text-red-600 dark:text-red-400">{error}</p>
		{/if}

		{#if footerExtra}
			{@render footerExtra()}
		{/if}
	</footer>
</div>
