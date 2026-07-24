<script lang="ts">
	import Dialog from './Dialog.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	let props = $props<{
		title?: string;
		description?: string;
		size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
		tone?: 'default' | 'info' | 'success' | 'warning' | 'danger';
		position?: 'center' | 'top';
		closeOnBackdrop?: boolean;
		closeOnEscape?: boolean;
		closeOnConfirm?: boolean;
		showClose?: boolean;
		showCancel?: boolean;
		showConfirm?: boolean;
		cancelLabel?: string;
		confirmLabel?: string;
		confirmVariant?: 'primary' | 'secondary' | 'destructive';
		confirmLoading?: boolean;
		confirmDisabled?: boolean;
		hideFooter?: boolean;
		footerAlign?: 'start' | 'center' | 'end' | 'between';
		scrollable?: boolean;
		blurBackdrop?: boolean;
		body?: string;
	}>();

	let open = $state(false);
</script>

<div class="flex flex-col items-center gap-3">
	<Button variant="primary" size="sm" onclick={() => (open = true)}>Open dialog</Button>

	<Dialog
		bind:open
		title={props.title ?? 'Confirm action'}
		description={props.description ?? 'This action cannot be undone. Do you want to continue?'}
		size={props.size ?? 'md'}
		tone={props.tone ?? 'default'}
		position={props.position ?? 'center'}
		closeOnBackdrop={props.closeOnBackdrop ?? true}
		closeOnEscape={props.closeOnEscape ?? true}
		closeOnConfirm={props.closeOnConfirm ?? true}
		showClose={props.showClose ?? true}
		showCancel={props.showCancel ?? true}
		showConfirm={props.showConfirm ?? true}
		cancelLabel={props.cancelLabel ?? 'Cancel'}
		confirmLabel={props.confirmLabel ?? 'Confirm'}
		confirmVariant={props.confirmVariant ?? 'primary'}
		confirmLoading={props.confirmLoading ?? false}
		confirmDisabled={props.confirmDisabled ?? false}
		hideFooter={props.hideFooter ?? false}
		footerAlign={props.footerAlign ?? 'end'}
		scrollable={props.scrollable ?? true}
		blurBackdrop={props.blurBackdrop ?? true}
	>
		{#if props.body}
			<p class="text-sm text-secondary leading-relaxed">{props.body}</p>
		{/if}
	</Dialog>
</div>
