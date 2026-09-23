<script lang="ts">
	import { onDestroy } from 'svelte';

	interface ProfileMedia {
		file: File;
		previewUrl: string;
		name: string;
	}

	interface ProfileHeaderValue {
		cover: File | null;
		avatar: File | null;
	}

	interface ProfileHeaderUploaderProps {
		id?: string;
		label?: string;
		coverHelperText?: string;
		avatarHelperText?: string;
		/** Existing remote cover URL (shown when no local File is selected). */
		coverSrc?: string;
		/** Existing remote avatar URL (shown when no local File is selected). */
		avatarSrc?: string;
		/** Events and banners only need the cover strip. */
		showAvatar?: boolean;
		/** `contain` shows the whole image inside the cover frame. */
		coverFit?: 'cover' | 'contain';
		emptyTitle?: string;
		dropTitle?: string;
		editLabel?: string;
		changeLabel?: string;
		frameLabel?: string;
		removeLabel?: string;
		/** Text links under the avatar once a local cover / avatar is selected. */
		removeCoverLabel?: string;
		removeAvatarLabel?: string;
		avatarEmptyLabel?: string;
		accept?: string;
		maxCoverMb?: number;
		maxAvatarMb?: number;
		disabled?: boolean;
		class?: string;
		onchange?: (value: ProfileHeaderValue) => void;
		/** Top-right actions once a cover exists. The cover itself still replaces the file. */
		onframe?: () => void;
		onedit?: () => void;
	}

	let {
		id = `profile-header-${Math.random().toString(36).slice(2, 9)}`,
		label = 'Profile media',
		coverHelperText = 'Cover · PNG or JPG · max 10MB',
		avatarHelperText = 'Avatar · square image recommended',
		coverSrc = '',
		avatarSrc = '',
		showAvatar = true,
		coverFit = 'cover',
		emptyTitle = 'Add cover photo',
		dropTitle = 'Drop cover photo',
		editLabel = 'Edit cover',
		changeLabel = 'Change',
		frameLabel = 'Adjust',
		removeLabel = 'Remove',
		removeCoverLabel = 'Remove cover',
		removeAvatarLabel = 'Remove photo',
		avatarEmptyLabel = 'Photo',
		accept = 'image/*',
		maxCoverMb = 10,
		maxAvatarMb = 5,
		disabled = false,
		class: className = '',
		onchange,
		onframe,
		onedit
	}: ProfileHeaderUploaderProps = $props();

	let cover = $state<ProfileMedia | null>(null);
	let avatar = $state<ProfileMedia | null>(null);
	let errorMessage = $state('');
	let coverDragging = $state(false);
	let avatarDragging = $state(false);
	let coverInput = $state<HTMLInputElement | null>(null);
	let avatarInput = $state<HTMLInputElement | null>(null);

	const labelId = $derived(`${id}-label`);
	const helperId = $derived(`${id}-helper`);
	const errorId = $derived(`${id}-error`);
	const coverInputId = $derived(`${id}-cover`);
	const avatarInputId = $derived(`${id}-avatar`);

	const coverDisplayUrl = $derived(cover?.previewUrl || coverSrc || '');
	const avatarDisplayUrl = $derived(avatar?.previewUrl || avatarSrc || '');
	const hasCoverMedia = $derived(Boolean(coverDisplayUrl));
	const hasAvatarMedia = $derived(Boolean(avatarDisplayUrl));
	const hasLocalMedia = $derived(Boolean(cover || avatar));

	function revoke(media: ProfileMedia | null) {
		if (media?.previewUrl) URL.revokeObjectURL(media.previewUrl);
	}

	function emitChange() {
		onchange?.({
			cover: cover?.file ?? null,
			avatar: avatar?.file ?? null
		});
	}

	function validateImage(file: File, maxMb: number): string | null {
		if (!file.type.startsWith('image/')) return `${file.name}: se requiere una imagen`;
		if (accept && accept !== '*') {
			const ok = accept.split(',').some((raw) => {
				const rule = raw.trim().toLowerCase();
				if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule);
				if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
				return file.type.toLowerCase() === rule;
			});
			if (!ok) return `${file.name}: tipo no permitido`;
		}
		if (file.size > maxMb * 1024 * 1024) return `${file.name}: supera ${maxMb}MB`;
		return null;
	}

	export function replaceCover(file: File) {
		setCover(file);
	}

	function setCover(file: File | null) {
		if (file) {
			const err = validateImage(file, maxCoverMb);
			if (err) {
				errorMessage = err;
				return;
			}
			revoke(cover);
			cover = { file, name: file.name, previewUrl: URL.createObjectURL(file) };
			errorMessage = '';
		} else {
			revoke(cover);
			cover = null;
		}
		emitChange();
		if (coverInput) coverInput.value = '';
	}

	function setAvatar(file: File | null) {
		if (file) {
			const err = validateImage(file, maxAvatarMb);
			if (err) {
				errorMessage = err;
				return;
			}
			revoke(avatar);
			avatar = { file, name: file.name, previewUrl: URL.createObjectURL(file) };
			errorMessage = '';
		} else {
			revoke(avatar);
			avatar = null;
		}
		emitChange();
		if (avatarInput) avatarInput.value = '';
	}

	function dragStillInside(event: DragEvent) {
		const next = event.relatedTarget;
		return (
			next instanceof Node &&
			event.currentTarget instanceof Node &&
			event.currentTarget.contains(next)
		);
	}

	function handleCoverDrop(e: DragEvent) {
		e.preventDefault();
		coverDragging = false;
		if (disabled) return;
		const file = e.dataTransfer?.files?.[0];
		if (file) setCover(file);
	}

	function handleAvatarDrop(e: DragEvent) {
		e.preventDefault();
		avatarDragging = false;
		if (disabled) return;
		const file = e.dataTransfer?.files?.[0];
		if (file) setAvatar(file);
	}

	onDestroy(() => {
		revoke(cover);
		revoke(avatar);
	});
</script>

<div class={['gap-3 flex w-full flex-col', className]}>
	{#if label}
		<div id={labelId} class="text-sm font-medium text-primary">{label}</div>
	{/if}

	<input
		bind:this={coverInput}
		id={coverInputId}
		type="file"
		{accept}
		{disabled}
		class="sr-only"
		tabindex={-1}
		aria-hidden="true"
		onchange={(e) => {
			const file = (e.currentTarget as HTMLInputElement).files?.[0] ?? null;
			if (file) setCover(file);
		}}
	/>
	{#if showAvatar}
		<input
			bind:this={avatarInput}
			id={avatarInputId}
			type="file"
			{accept}
			{disabled}
			class="sr-only"
			tabindex={-1}
			aria-hidden="true"
			onchange={(e) => {
				const file = (e.currentTarget as HTMLInputElement).files?.[0] ?? null;
				if (file) setAvatar(file);
			}}
		/>
	{/if}

	<div
		class="rounded-xl border-border bg-surface-elevated shadow-sm relative border"
		aria-labelledby={label ? labelId : undefined}
		aria-describedby={[
			coverHelperText || avatarHelperText ? helperId : '',
			errorMessage ? errorId : ''
		]
			.filter(Boolean)
			.join(' ') || undefined}
	>
		<!-- Cover -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			role="button"
			tabindex={disabled ? -1 : 0}
			aria-label={hasCoverMedia
				? cover
					? `Change cover photo, ${cover.name}`
					: 'Change cover photo'
				: 'Upload cover photo'}
			aria-disabled={disabled || undefined}
			ondragenter={(e) => {
				e.preventDefault();
				if (!disabled) coverDragging = true;
			}}
			ondragover={(e) => e.preventDefault()}
			ondragleave={(e) => {
				if (dragStillInside(e)) return;
				coverDragging = false;
			}}
			ondrop={handleCoverDrop}
			onkeydown={(e) => {
				if (disabled) return;
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					coverInput?.click();
				}
			}}
			onclick={() => !disabled && coverInput?.click()}
			class={[
				'group min-h-36 relative aspect-3/1 w-full overflow-hidden transition-colors outline-none',
				showAvatar ? 'rounded-t-xl' : 'rounded-xl',
				'focus-visible:ring-brand-500/40 focus-visible:ring-2 focus-visible:ring-inset',
				coverDragging ? 'bg-brand-500/10' : 'bg-surface-overlay',
				disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
			]}
		>
			{#if hasCoverMedia}
				<img
					src={coverDisplayUrl}
					alt=""
					class={['h-full w-full', coverFit === 'contain' ? 'object-contain' : 'object-cover']}
				/>
				{#if !disabled && onedit}
					<div
						class="inset-0 from-black/35 p-3 pointer-events-none absolute flex items-start justify-end bg-linear-to-b via-transparent to-transparent"
					>
						<div class="gap-1.5 pointer-events-auto flex flex-wrap items-center justify-end">
							{#if onframe}
								<button
									type="button"
									class="gap-1.5 rounded-lg bg-white/95 px-2 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur dark:bg-neutral-900/95 inline-flex items-center"
									onclick={(event) => {
										event.stopPropagation();
										onframe?.();
									}}
								>
									<svg
										class="h-3.5 w-3.5"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
										aria-hidden="true"
									>
										<path
											d="M6 3v4M18 3v4M6 17v4M18 17v4M3 6h4M3 18h4M17 6h4M17 18h4"
											stroke-linecap="round"
										/>
									</svg>
									{frameLabel}
								</button>
							{/if}
							<button
								type="button"
								class="gap-1.5 rounded-lg bg-white/95 px-2 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur dark:bg-neutral-900/95 inline-flex items-center"
								onclick={(event) => {
									event.stopPropagation();
									onedit();
								}}
							>
								<svg
									class="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path d="M12 20h9" stroke-linecap="round" />
									<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" stroke-linejoin="round" />
								</svg>
								{editLabel}
							</button>
							<button
								type="button"
								class="gap-1.5 rounded-lg bg-white/95 px-2 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur dark:bg-neutral-900/95 inline-flex items-center"
								onclick={(event) => {
									event.stopPropagation();
									coverInput?.click();
								}}
							>
								<svg
									class="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<rect x="3" y="5" width="18" height="14" rx="2" />
									<circle cx="9" cy="10" r="1.5" />
									<path d="m21 16-5-5-8 8" stroke-linejoin="round" />
								</svg>
								{changeLabel}
							</button>
							<button
								type="button"
								class="gap-1.5 rounded-lg bg-white/95 px-2 py-1.5 text-xs font-medium text-red-600 shadow-sm backdrop-blur dark:bg-neutral-900/95 inline-flex items-center"
								onclick={(event) => {
									event.stopPropagation();
									setCover(null);
								}}
							>
								<svg
									class="h-3.5 w-3.5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									aria-hidden="true"
								>
									<path
										d="M4 7h16M9 7V5h6v2M8 7l1 13h6l1-13"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								{removeLabel}
							</button>
						</div>
					</div>
				{:else if !disabled}
					<div
						class="inset-0 from-black/35 p-3 absolute flex items-start justify-end bg-linear-to-b via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
					>
						<span
							class="gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur dark:bg-neutral-900/95 inline-flex items-center"
						>
							{editLabel}
						</span>
					</div>
				{/if}
			{:else}
				<div
					class="inset-0 gap-2 px-4 absolute flex flex-col items-center justify-center text-center"
				>
					<div
						class={[
							'h-10 w-10 rounded-lg flex items-center justify-center',
							coverDragging
								? 'bg-brand-600 text-white'
								: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
						]}
						aria-hidden="true"
					>
						<svg
							class="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="1.75"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
							/>
						</svg>
					</div>
					<p class="text-sm font-medium text-primary">
						{coverDragging ? dropTitle : emptyTitle}
					</p>
					<p class="text-xs text-secondary">{coverHelperText}</p>
				</div>
			{/if}

			{#if coverDragging}
				<div
					class="inset-0 ring-brand-500/50 pointer-events-none absolute ring-2 ring-inset"
					aria-hidden="true"
				></div>
			{/if}
		</div>

		{#if showAvatar}
			<!-- Avatar overlapping cover -->
			<div class="px-4 pb-4 pt-0 relative">
				<div class="-mt-10 gap-4 sm:-mt-12 flex items-end">
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div
						role="button"
						tabindex={disabled ? -1 : 0}
						aria-label={hasAvatarMedia
							? avatar
								? `Change profile photo, ${avatar.name}`
								: 'Change profile photo'
							: 'Upload profile photo'}
						aria-disabled={disabled || undefined}
						ondragenter={(e) => {
							e.preventDefault();
							e.stopPropagation();
							if (!disabled) avatarDragging = true;
						}}
						ondragover={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						ondragleave={(e) => {
							e.stopPropagation();
							if (dragStillInside(e)) return;
							avatarDragging = false;
						}}
						ondrop={(e) => {
							e.stopPropagation();
							handleAvatarDrop(e);
						}}
						onkeydown={(e) => {
							if (disabled) return;
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								avatarInput?.click();
							}
						}}
						onclick={(e) => {
							e.stopPropagation();
							if (!disabled) avatarInput?.click();
						}}
						class={[
							'group h-20 w-20 border-surface-elevated bg-surface-overlay shadow-md sm:h-24 sm:w-24 relative z-10 shrink-0 overflow-hidden rounded-full border-4 transition outline-none',
							'focus-visible:ring-brand-500/40 focus-visible:ring-offset-surface-elevated focus-visible:ring-2 focus-visible:ring-offset-2',
							avatarDragging ? 'ring-brand-500 ring-2' : '',
							disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
						]}
					>
						{#if hasAvatarMedia}
							<img src={avatarDisplayUrl} alt="" class="h-full w-full object-cover" />
							{#if !disabled}
								<div
									class="inset-0 bg-black/45 absolute flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
								>
									<span
										class="h-8 w-8 bg-white text-primary shadow-sm inline-flex items-center justify-center rounded-full"
										aria-hidden="true"
									>
										<svg
											class="h-4 w-4"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											stroke-width="2"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
											/>
										</svg>
									</span>
								</div>
							{/if}
						{:else}
							<div
								class="gap-0.5 text-secondary flex h-full w-full flex-col items-center justify-center"
							>
								<svg
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									stroke-width="1.75"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
									/>
								</svg>
								<span class="font-medium text-[10px]">{avatarEmptyLabel}</span>
							</div>
						{/if}
					</div>

					<div class="min-w-0 pb-1 flex-1">
						{#if hasLocalMedia}
							<div class="gap-2 flex flex-wrap items-center">
								{#if cover && !disabled}
									<button
										type="button"
										onclick={() => setCover(null)}
										class="rounded-lg px-2 py-1 text-xs font-medium text-secondary hover:bg-surface-overlay hover:text-primary transition"
									>
										{removeCoverLabel}
									</button>
								{/if}
								{#if avatar && !disabled}
									<button
										type="button"
										onclick={() => setAvatar(null)}
										class="rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition"
									>
										{removeAvatarLabel}
									</button>
								{/if}
							</div>
						{:else}
							<p id={helperId} class="text-xs text-secondary leading-relaxed">
								{avatarHelperText}
							</p>
						{/if}
					</div>
				</div>
			</div>
		{/if}
	</div>

	{#if errorMessage}
		<p id={errorId} class="text-xs text-red-600 dark:text-red-400" role="alert">{errorMessage}</p>
	{/if}
</div>
