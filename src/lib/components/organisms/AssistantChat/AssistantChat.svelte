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
		'rounded-2xl border-border bg-surface-elevated shadow-xl flex flex-col overflow-hidden border',
		'h-[min(560px,70vh)] w-full max-w-[420px] min-w-[320px]',
		className
	]}
	role="complementary"
	aria-label={title}
>
	<!-- Header -->
	<header class="gap-2 border-border px-3 py-2.5 flex shrink-0 items-center border-b">
		<span
			class="h-7 w-7 rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 flex shrink-0 items-center justify-center"
			aria-hidden="true"
		>
			<Sparkles size={15} strokeWidth={2} />
		</span>
		<div class="min-w-0 flex-1">
			<p class="text-sm font-semibold text-primary truncate">{title}</p>
			{#if statusLabel}
				<p class="text-xs text-muted truncate">{statusLabel}</p>
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
	<div bind:this={scrollEl} class="min-h-0 px-3 py-3 flex-1 overflow-y-auto">
		{#if isEmpty}
			<div class="gap-4 py-8 flex flex-col items-center justify-center text-center">
				<span
					class="h-12 w-12 rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-950/30 dark:text-brand-400 flex items-center justify-center"
					aria-hidden="true"
				>
					<Sparkles size={24} strokeWidth={1.5} />
				</span>
				<p class="text-sm text-muted">{emptyHint}</p>
				{#if suggestions.length}
					<div class="gap-2 flex flex-wrap justify-center">
						{#each suggestions as suggestion (suggestion)}
							<button
								type="button"
								class="border-border bg-surface px-3 py-1.5 text-xs text-secondary hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-full border transition-colors"
								onclick={() => handleSuggestion(suggestion)}
							>
								{suggestion}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		{:else}
			<div class="gap-3 flex flex-col">
				{#each messages as message (message.id)}
					{#if message.role === 'user'}
						<div class="flex justify-end">
							<div
								class="rounded-2xl rounded-br-sm bg-brand-600 px-3.5 py-2.5 text-sm leading-relaxed text-white max-w-[80%]"
							>
								{message.content}
							</div>
						</div>
					{:else}
						<div class="gap-1.5 flex flex-col">
							<div class="gap-2 flex items-start">
								<span
									class="mt-0.5 h-6 w-6 bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 flex shrink-0 items-center justify-center rounded-full"
									aria-hidden="true"
								>
									<Sparkles size={12} strokeWidth={2} />
								</span>
								<div
									class="rounded-2xl rounded-bl-sm bg-surface-overlay px-3.5 py-2.5 text-sm leading-relaxed text-primary max-w-[calc(100%-2rem)]"
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
					<div class="gap-2 flex items-center">
						<span
							class="h-6 w-6 bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400 flex shrink-0 items-center justify-center rounded-full"
							aria-hidden="true"
						>
							<Sparkles size={12} strokeWidth={2} />
						</span>
						<div
							class="gap-2 rounded-2xl rounded-bl-sm bg-surface-overlay px-3.5 py-2.5 flex items-center"
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
	<footer class="border-border px-3 py-2.5 shrink-0 border-t">
		<div class="gap-1.5 flex items-center">
			<input
				type="text"
				bind:value={draft}
				placeholder={listening ? statusLabel || placeholder : placeholder}
				class={[
					'h-9 min-w-0 rounded-xl bg-surface px-3 text-sm text-primary placeholder:text-muted focus:border-brand-400 focus:ring-brand-500/20 flex-1 border transition-shadow outline-none focus:ring-2',
					listening ? 'border-red-400 ring-red-500/20 ring-2' : 'border-border'
				]}
				disabled={loading}
				onkeydown={handleKeydown}
				aria-label={placeholder}
			/>

			<div class="gap-0.5 flex shrink-0 items-center">
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
