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
		accept?: string;
		maxCoverMb?: number;
		maxAvatarMb?: number;
		disabled?: boolean;
		class?: string;
		onchange?: (value: ProfileHeaderValue) => void;
	}

	let {
		id = `profile-header-${Math.random().toString(36).slice(2, 9)}`,
		label = 'Profile media',
		coverHelperText = 'Cover · PNG or JPG · max 10MB',
		avatarHelperText = 'Avatar · square image recommended',
		accept = 'image/*',
		maxCoverMb = 10,
		maxAvatarMb = 5,
		disabled = false,
		class: className = '',
		onchange
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

<div class={['flex w-full flex-col gap-3', className]}>
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

	<div
		class="relative overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-sm"
		aria-labelledby={label ? labelId : undefined}
		aria-describedby={[coverHelperText || avatarHelperText ? helperId : '', errorMessage ? errorId : '']
			.filter(Boolean)
			.join(' ') || undefined}
	>
		<!-- Cover -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			role="button"
			tabindex={disabled ? -1 : 0}
			aria-label={cover ? `Change cover photo, ${cover.name}` : 'Upload cover photo'}
			aria-disabled={disabled || undefined}
			ondragenter={(e) => {
				e.preventDefault();
				if (!disabled) coverDragging = true;
			}}
			ondragover={(e) => e.preventDefault()}
			ondragleave={() => (coverDragging = false)}
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
				'group relative aspect-3/1 min-h-36 w-full overflow-hidden outline-none transition-colors',
				'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500/40',
				coverDragging ? 'bg-brand-500/10' : 'bg-surface-overlay',
				disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
			]}
		>
			{#if cover}
				<img src={cover.previewUrl} alt="" class="h-full w-full object-cover" />
				{#if !disabled}
					<div
						class="absolute inset-0 flex items-start justify-end bg-linear-to-b from-black/35 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
					>
						<span
							class="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur dark:bg-slate-900/95"
						>
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
								/>
							</svg>
							Edit cover
						</span>
					</div>
				{/if}
			{:else}
				<div class="flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
					<div
						class={[
							'flex h-10 w-10 items-center justify-center rounded-lg',
							coverDragging
								? 'bg-brand-600 text-white'
								: 'bg-brand-100 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
						]}
						aria-hidden="true"
					>
						<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
							/>
						</svg>
					</div>
					<p class="text-sm font-medium text-primary">
						{coverDragging ? 'Drop cover photo' : 'Add cover photo'}
					</p>
					<p class="text-xs text-secondary">{coverHelperText}</p>
				</div>
			{/if}

			{#if coverDragging}
				<div
					class="pointer-events-none absolute inset-0 ring-2 ring-inset ring-brand-500/50"
					aria-hidden="true"
				></div>
			{/if}
		</div>

		<!-- Avatar overlapping cover -->
		<div class="relative px-4 pb-4 pt-0">
			<div class="-mt-10 flex items-end gap-4 sm:-mt-12">
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					role="button"
					tabindex={disabled ? -1 : 0}
					aria-label={avatar ? `Change profile photo, ${avatar.name}` : 'Upload profile photo'}
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
						'group relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-surface-elevated bg-surface-overlay shadow-md outline-none transition sm:h-24 sm:w-24',
						'focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated',
						avatarDragging ? 'ring-2 ring-brand-500' : '',
						disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
					]}
				>
					{#if avatar}
						<img src={avatar.previewUrl} alt="" class="h-full w-full object-cover" />
						{#if !disabled}
							<div
								class="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
							>
								<span
									class="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary shadow-sm"
									aria-hidden="true"
								>
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
						<div class="flex h-full w-full flex-col items-center justify-center gap-0.5 text-secondary">
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0"
								/>
							</svg>
							<span class="text-[10px] font-medium">Photo</span>
						</div>
					{/if}
				</div>

				<div class="min-w-0 flex-1 pb-1">
					{#if avatar || cover}
						<div class="flex flex-wrap items-center gap-2">
							{#if cover && !disabled}
								<button
									type="button"
									onclick={() => setCover(null)}
									class="rounded-lg px-2 py-1 text-xs font-medium text-secondary transition hover:bg-surface-overlay hover:text-primary"
								>
									Remove cover
								</button>
							{/if}
							{#if avatar && !disabled}
								<button
									type="button"
									onclick={() => setAvatar(null)}
									class="rounded-lg px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
								>
									Remove photo
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
	</div>

	{#if errorMessage}
		<p id={errorId} class="text-xs text-red-600 dark:text-red-400" role="alert">{errorMessage}</p>
	{/if}
</div>
