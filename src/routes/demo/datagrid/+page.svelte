<script lang="ts">
	import { resolve } from '$app/paths';
	import DataGrid from '$lib/components/organisms/DataGrid/DataGrid.svelte';
	import type { DataGridColumn } from '$lib/components/organisms/DataGrid/types.js';
	import Badge from '$lib/components/atoms/Badge/Badge.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';
	import Grid from '$lib/components/atoms/Grid/Grid.svelte';
	import Dialog from '$lib/components/organisms/Dialog/Dialog.svelte';
	import { themeStore } from '$lib/utils/theme.svelte.js';
	import Users from '@lucide/svelte/icons/users';
	import Coins from '@lucide/svelte/icons/coins';
	import Sliders from '@lucide/svelte/icons/sliders';

	/** Mirrors admin/usuarios shape */
	type UserRow = {
		email: string;
		planSlug: string;
		tokenBalance: number;
		profile: {
			id: string;
			userId: string;
			displayName: string;
			username: string;
			isSuspended: boolean;
			isPaused: boolean;
			accountVerifiedAt: string | null;
			suspendedReason: string | null;
			stripeCustomerId: string | null;
			stripeSubscriptionId: string | null;
		};
	};

	const rows: UserRow[] = [
		{
			email: 'ana@example.com',
			planSlug: 'premium',
			tokenBalance: 120,
			profile: {
				id: 'p1',
				userId: 'u1',
				displayName: 'Ana López',
				username: 'ana',
				isSuspended: false,
				isPaused: false,
				accountVerifiedAt: '2026-01-01',
				suspendedReason: null,
				stripeCustomerId: 'cus_ABCDEFGHIJKLMN',
				stripeSubscriptionId: 'sub_1234567890'
			}
		},
		{
			email: 'bruno@example.com',
			planSlug: 'free',
			tokenBalance: 10,
			profile: {
				id: 'p2',
				userId: 'u2',
				displayName: 'Bruno Ruiz',
				username: 'bruno',
				isSuspended: true,
				isPaused: false,
				accountVerifiedAt: null,
				suspendedReason: 'Violación de normas',
				stripeCustomerId: null,
				stripeSubscriptionId: null
			}
		},
		{
			email: 'carla@example.com',
			planSlug: 'free',
			tokenBalance: 5,
			profile: {
				id: 'p3',
				userId: 'u3',
				displayName: 'Carla Díaz',
				username: 'carla',
				isSuspended: false,
				isPaused: true,
				accountVerifiedAt: '2026-03-12',
				suspendedReason: null,
				stripeCustomerId: 'cus_SHORT',
				stripeSubscriptionId: null
			}
		}
	];

	const userColumns: DataGridColumn<UserRow>[] = [
		{ id: 'user', header: 'Usuario', accessor: (p) => p.profile.displayName },
		{ id: 'status', header: 'Estado', accessor: (p) => p.profile.isSuspended },
		{ id: 'plan', header: 'Plan & Tokens', accessor: (p) => p.planSlug },
		{ id: 'stripe', header: 'Stripe ID', accessor: (p) => p.profile.stripeCustomerId },
		{ id: 'actions', header: 'Acciones', align: 'right' }
	];

	let activeUser = $state<UserRow | null>(null);
	let actionType = $state<'manage' | 'suspend' | null>(null);
	let loading = $state(false);

	function truncateId(id: string | null | undefined) {
		if (!id) return '—';
		return id.length > 14 ? `${id.slice(0, 10)}…` : id;
	}

	function getInitials(name: string) {
		return name
			? name
					.split(' ')
					.map((n) => n[0])
					.slice(0, 2)
					.join('')
					.toUpperCase()
			: '?';
	}

	function openManageModal(row: UserRow) {
		activeUser = row;
		actionType = 'manage';
	}

	function openSuspendModal(row: UserRow) {
		activeUser = row;
		actionType = 'suspend';
	}
</script>

<svelte:head>
	<title>DataGrid — usuarios (SSR)</title>
</svelte:head>

{#snippet usersIcon()}
	<Users class="size-5 text-brand-600" />
{/snippet}

<div class="max-w-6xl space-y-6 px-4 py-6 sm:px-6 mx-auto">
	<header class="gap-3 flex flex-wrap items-start justify-between">
		<div>
			<h1 class="text-2xl font-bold text-primary">Usuarios</h1>
			<p class="mt-1 text-sm text-secondary">
				Réplica del admin real: accessors + cell con Buttons. Sin
				<code class="rounded bg-surface-overlay px-1 text-xs">mounted</code>.
			</p>
			<p class="mt-1 text-xs text-muted">
				Ojo: DataGrid tiene <code class="text-xs">selectable=true</code> por defecto → menú de fila automático
				(DropdownMenu).
			</p>
		</div>
		<div class="gap-2 flex">
			<a
				href={resolve('/demo')}
				class="rounded-lg border-border px-3 py-1.5 text-sm text-secondary hover:bg-surface-overlay border"
				>Demos</a
			>
			<button
				type="button"
				onclick={() => themeStore.toggle()}
				class="rounded-lg border-border px-3 py-1.5 text-sm text-secondary hover:bg-surface-overlay border"
			>
				Theme
			</button>
		</div>
	</header>

	<Grid cols={{ base: 1, sm: 2, md: 4 }} gap="md">
		{#each [{ label: 'Total', value: rows.length }, { label: 'Verificados', value: 2 }, { label: 'Suspendidos', value: 1 }, { label: 'Premium', value: 1 }] as stat}
			<div class="rounded-xl border-border bg-surface-elevated p-4 border">
				<p class="text-xs text-muted">{stat.label}</p>
				<p class="mt-1 text-2xl font-semibold text-primary">{stat.value}</p>
				<div class="mt-2">{@render usersIcon()}</div>
			</div>
		{/each}
	</Grid>

	<!-- Same defaults as consumer: selectable/row actions ON unless disabled -->
	<section class="rounded-2xl border-border bg-surface-elevated p-3 sm:p-4 min-h-[22rem] border">
		<DataGrid columns={userColumns} {rows} rowKey={(r) => r.profile.id} cell={userCell} />
	</section>

	<!-- Safer variant for pages that already have an Acciones column -->
	<section class="space-y-2">
		<h2 class="text-sm font-semibold text-primary">Variante recomendada (sin menú interno)</h2>
		<p class="text-xs text-muted">
			<code class="text-xs">selectable={'{false}'} showRowActions={'{false}'}</code> — solo tus botones
			de celda.
		</p>
		<div class="rounded-2xl border-border bg-surface-elevated p-3 sm:p-4 min-h-[16rem] border">
			<DataGrid
				columns={userColumns}
				{rows}
				rowKey={(r) => r.profile.id}
				cell={userCell}
				selectable={false}
				showRowActions={false}
				selectColumns={false}
				selectCells={false}
				marqueeSelect={false}
				contextMenu={false}
			/>
		</div>
	</section>
</div>

{#snippet userCell(row: UserRow, column: DataGridColumn<UserRow>)}
	{#if column.id === 'user'}
		<div class="gap-3 flex items-center">
			<div
				class="h-9 w-9 bg-surface-overlay text-xs font-semibold text-secondary flex shrink-0 items-center justify-center rounded-full"
			>
				{getInitials(row.profile.displayName)}
			</div>
			<div class="min-w-0">
				<p class="leading-snug font-medium text-primary">{row.profile.displayName}</p>
				<p class="text-xs text-muted">@{row.profile.username} · {row.email}</p>
			</div>
		</div>
	{:else if column.id === 'status'}
		<div class="gap-1.5 text-xs flex flex-wrap">
			{#if row.profile.isSuspended}
				<Badge variant="error">Suspendido</Badge>
			{:else}
				<Badge variant="success">Activo</Badge>
			{/if}
			{#if row.profile.accountVerifiedAt}
				<Badge variant="info">Verificado</Badge>
			{/if}
			{#if row.profile.isPaused}
				<Badge variant="default">Pausado</Badge>
			{/if}
			{#if row.profile.isSuspended && row.profile.suspendedReason}
				<p class="mt-0.5 text-xs text-red-600 w-full">{row.profile.suspendedReason}</p>
			{/if}
		</div>
	{:else if column.id === 'plan'}
		<div class="gap-1.5 text-xs flex flex-wrap items-center">
			<Badge variant={row.planSlug === 'premium' ? 'info' : 'default'}>
				{row.planSlug.toUpperCase()}
			</Badge>
			<span class="gap-1 font-medium text-secondary inline-flex items-center">
				<Coins class="size-3.5 text-amber-500" />
				{row.tokenBalance}
			</span>
		</div>
	{:else if column.id === 'stripe'}
		<div class="font-mono text-xs text-muted">
			<p>Cust: {truncateId(row.profile.stripeCustomerId)}</p>
			{#if row.profile.stripeSubscriptionId}
				<p>Sub: {truncateId(row.profile.stripeSubscriptionId)}</p>
			{/if}
		</div>
	{:else if column.id === 'actions'}
		<div class="gap-1.5 flex items-center justify-end">
			<Button variant="secondary" size="sm" onclick={() => openManageModal(row)}>
				<Sliders class="mr-1 size-3.5" />
				Gestionar
			</Button>
			{#if row.profile.isSuspended}
				<Button variant="secondary" size="sm" disabled={loading}>Reactivar</Button>
			{:else}
				<Button
					variant="destructive"
					size="sm"
					disabled={loading}
					onclick={() => openSuspendModal(row)}
				>
					Suspender
				</Button>
			{/if}
		</div>
	{/if}
{/snippet}

<Dialog
	open={actionType === 'manage'}
	title={`Gestionar: ${activeUser?.profile.displayName ?? ''}`}
	description="Demo dialog"
	size="sm"
	confirmLabel="Guardar"
	cancelLabel="Cancelar"
	onclose={() => (actionType = null)}
	oncancel={() => (actionType = null)}
	onconfirm={() => (actionType = null)}
>
	<p class="text-sm text-secondary">Usuario: {activeUser?.email}</p>
</Dialog>

<Dialog
	open={actionType === 'suspend'}
	title={`Suspender a ${activeUser?.profile.displayName ?? ''}`}
	description="Demo dialog"
	size="sm"
	confirmVariant="destructive"
	confirmLabel="Confirmar"
	cancelLabel="Cancelar"
	onclose={() => (actionType = null)}
	oncancel={() => (actionType = null)}
	onconfirm={() => (actionType = null)}
>
	<p class="text-sm text-secondary">Confirmar suspensión de prueba.</p>
</Dialog>
