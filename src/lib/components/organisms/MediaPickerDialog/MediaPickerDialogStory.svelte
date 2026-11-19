<script lang="ts">
	import MediaPickerDialog from './MediaPickerDialog.svelte';
	import Button from '$lib/components/atoms/Button/Button.svelte';

	const svg = (hue: number) =>
		`data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><rect width="160" height="120" fill="hsl(${hue} 35% 70%)"/></svg>`)}`;
	let items = $state(
		Array.from({ length: 10 }, (_, i) => ({
			id: `p${i}`,
			src: svg(i * 33),
			title: ['Terraza', 'Barra', 'Croquetas', 'Equipo', 'Local'][i % 5],
			albumId: i < 4 ? 'local' : i < 7 ? 'platos' : null
		}))
	);
	const albums = [
		{ id: 'local', name: 'Local' },
		{ id: 'platos', name: 'Platos' }
	];
	let open = $state(true);
	let value = $state<string[]>([]);
</script>

<div class="p-6">
	<Button onclick={() => (open = true)}>Cambiar portada</Button>
	<p class="mt-2 text-sm">Elegida: {value.join(', ') || '—'}</p>
	<MediaPickerDialog
		bind:open
		bind:value
		{items}
		{albums}
		title="Cambiar portada"
		description="Elige una foto de tu galería o sube una nueva."
		uploadable
		onupload={(files) =>
			(items = [...files.map((f, i) => ({ id: `new${Date.now()}${i}`, src: URL.createObjectURL(f), title: f.name, albumId: null })), ...items])}
	/>
</div>
