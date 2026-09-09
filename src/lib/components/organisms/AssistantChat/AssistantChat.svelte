<script lang="ts">
	import { tick, type Snippet } from 'svelte';
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
		RotateCcw,
		Copy,
		Check
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
		/** Chips shown under the conversation (after the user has messages). */
		followUpSuggestions?: string[];
		/** Active CRM query, shown under the header (e.g. «Presupuestos · María · el mes pasado»). */
		contextLabel?: string;
		contextAriaLabel?: string;
		messages?: AssistantMessage[];
		draft?: string;
		loading?: boolean;
		loadingLabel?: string;
		/** When false, the spinner bubble is hidden (parent paints status in a message). */
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
		copyChatLabel?: string;
		copiedChatLabel?: string;
		class?: string;
		result?: Snippet<[AssistantMessage]>;
		footerExtra?: Snippet;
		onsend?: () => void;
		onclose?: () => void;
		onnewchat?: () => void;
		oncopychat?: () => void | Promise<void>;
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
		followUpSuggestions = [],
		contextLabel = '',
		contextAriaLabel = '',
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
		copyChatLabel = 'Copiar chat',
		copiedChatLabel = 'Copiado',
		class: className = '',
		result,
		footerExtra,
		onsend,
		onclose,
		onnewchat,
		oncopychat,
		onmicclick,
		onvoiceoutputchange,
		onsuggestion
	}: AssistantChatProps = $props();

	let scrollEl = $state<HTMLDivElement | null>(null);
	let inputEl: HTMLInputElement | null = null;
	/** Restore the composer after send / SvelteKit form focus reset. */
	let retainComposerFocus = false;
	let copiedFlash = $state(false);

	const isEmpty = $derived(messages.length === 0 && !loading);
	const canSend = $derived(draft.trim().length > 0 && !loading);
	const pendingAssistantId = $derived.by(() => {
		if (!loading || messages.length === 0) return null;
		const last = messages[messages.length - 1];
		if (last?.role === 'assistant' && !last.content.trim()) return last.id;
		return null;
	});
	const showTrailingLoader = $derived(loading && showLoadingBubble && !pendingAssistantId);

	function focusComposer() {
		inputEl?.focus({ preventScroll: true });
	}

	/** Parent can call this after client-side navigation (goto). */
	export function focus() {
		retainComposerFocus = true;
		focusComposer();
		void tick().then(focusComposer);
	}

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

	$effect(() => {
		if (!open || loading || !retainComposerFocus) return;
		const id = requestAnimationFrame(() => {
			if (open && retainComposerFocus) focusComposer();
			if (!loading) retainComposerFocus = false;
		});
		return () => cancelAnimationFrame(id);
	});

	function handleClose() {
		retainComposerFocus = false;
		open = false;
		onclose?.();
	}

	function handleSend() {
		if (!canSend) return;
		retainComposerFocus = true;
		onsend?.();
		void tick().then(focusComposer);
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

	async function handleCopyChat() {
		if (!oncopychat || messages.length === 0) return;
		await oncopychat();
		copiedFlash = true;
		window.setTimeout(() => {
			copiedFlash = false;
		}, 1600);
	}
</script>

<div
	class={[
		'rounded-2xl border-border bg-surface-elevated shadow-xl flex h-[min(560px,calc(100dvh-5.5rem))] max-h-[calc(100dvh-5.5rem)] w-[min(420px,calc(100vw-2rem))] shrink-0 flex-col overflow-hidden border',
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
		<IconButton
			variant="ghost"
			size="xs"
			label={copiedFlash ? copiedChatLabel : copyChatLabel}
			disabled={messages.length === 0 || !oncopychat}
			onclick={() => void handleCopyChat()}
		>
			{#if copiedFlash}
				<Check size={14} strokeWidth={2} />
			{:else}
				<Copy size={14} strokeWidth={2} />
			{/if}
		</IconButton>
		<IconButton variant="ghost" size="xs" label={newChatLabel} onclick={() => onnewchat?.()}>
			<RotateCcw size={14} strokeWidth={2} />
		</IconButton>
		<IconButton variant="ghost" size="xs" label={closeLabel} onclick={handleClose}>
			<X size={14} strokeWidth={2} />
		</IconButton>
	</header>

	{#if contextLabel}
		<div
			class="border-border bg-surface-overlay px-3 py-1.5 leading-snug text-muted truncate border-b text-[11px]"
			title={contextLabel}
			aria-label={contextAriaLabel || contextLabel}
		>
			{contextLabel}
		</div>
	{/if}

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
								class="rounded-2xl rounded-br-sm bg-brand-600 px-3.5 py-2.5 text-sm leading-relaxed text-white max-w-[80%] whitespace-pre-wrap"
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
									class="rounded-2xl rounded-bl-sm bg-surface-overlay px-3.5 py-2.5 text-sm leading-relaxed text-primary max-w-[calc(100%-2rem)] whitespace-pre-wrap"
								>
									{#if message.id === pendingAssistantId}
										<span class="gap-2 text-muted flex items-center">
											<LoaderCircle size={14} strokeWidth={2} class="animate-spin shrink-0" />
											<span class="text-xs">{loadingLabel}</span>
										</span>
									{:else}
										{message.content}
									{/if}
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

				{#if showTrailingLoader}
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

				{#if !loading && followUpSuggestions.length}
					<div class="ml-8 gap-2 flex flex-wrap">
						{#each followUpSuggestions as suggestion (suggestion)}
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
		{/if}
	</div>

	<!-- Footer -->
	<footer class="border-border px-3 py-2.5 shrink-0 border-t">
		<div class="gap-1.5 flex items-center">
			<input
				{@attach (node) => {
					inputEl = node;
					$effect(() => {
						if (!open || loading || !retainComposerFocus) return;
						node.focus();
						retainComposerFocus = false;
					});
					return () => {
						if (inputEl === node) inputEl = null;
					};
				}}
				type="text"
				bind:value={draft}
				placeholder={listening ? statusLabel || placeholder : placeholder}
				class={[
					'h-9 min-w-0 rounded-xl bg-surface px-3 text-sm text-primary placeholder:text-muted focus:border-brand-400 focus:ring-brand-500/20 flex-1 border transition-shadow outline-none focus:ring-2',
					listening ? 'border-red-400 ring-red-500/20 ring-2' : 'border-border'
				]}
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
