<script lang="ts">
	import ActionSheet from '$lib/components/molecules/ActionSheet/ActionSheet.svelte';
	import type { ActionSheetItem } from '$lib/components/molecules/ActionSheet/ActionSheet.svelte';

	export type ShareChannel = 'native' | 'copy' | 'x' | 'whatsapp' | 'telegram' | 'email' | 'sms';

	interface ShareSheetProps {
		open?: boolean;
		url?: string;
		title?: string;
		text?: string;
		channels?: ShareChannel[];
		class?: string;
		onshare?: (channel: ShareChannel) => void;
		onclose?: () => void;
	}

	let {
		open = $bindable(false),
		url,
		title = 'Share',
		text = '',
		channels = ['native', 'copy', 'whatsapp', 'x', 'email'],
		class: className = '',
		onshare,
		onclose
	}: ShareSheetProps = $props();

	const shareUrl = $derived(url ?? (typeof window !== 'undefined' ? window.location.href : ''));

	const labels: Record<ShareChannel, string> = {
		native: 'Share via…',
		copy: 'Copy link',
		x: 'Share on X',
		whatsapp: 'WhatsApp',
		telegram: 'Telegram',
		email: 'Email',
		sms: 'SMS'
	};

	const actions = $derived(
		channels.map(
			(id): ActionSheetItem => ({
				id,
				label: labels[id]
			})
		)
	);

	async function onselect(id: string) {
		const channel = id as ShareChannel;
		onshare?.(channel);

		if (channel === 'native' && typeof navigator !== 'undefined' && navigator.share) {
			try {
				await navigator.share({ title, text, url: shareUrl });
			} catch {
				/* user cancelled */
			}
			return;
		}
		if (channel === 'copy' && typeof navigator !== 'undefined') {
			await navigator.clipboard.writeText(shareUrl);
			return;
		}
		if (typeof window === 'undefined') return;
		const encoded = encodeURIComponent(shareUrl);
		const encodedText = encodeURIComponent(text || title);
		const map: Partial<Record<ShareChannel, string>> = {
			x: `https://twitter.com/intent/tweet?url=${encoded}&text=${encodedText}`,
			whatsapp: `https://wa.me/?text=${encodedText}%20${encoded}`,
			telegram: `https://t.me/share/url?url=${encoded}&text=${encodedText}`,
			email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}%20${encoded}`,
			sms: `sms:?&body=${encodedText}%20${encoded}`
		};
		const href = map[channel];
		if (href) window.open(href, '_blank', 'noopener,noreferrer');
	}
</script>

<ActionSheet
	bind:open
	{title}
	message={shareUrl}
	{actions}
	class={className}
	{onselect}
	{onclose}
/>
