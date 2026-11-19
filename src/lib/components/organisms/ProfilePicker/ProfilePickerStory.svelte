<script lang="ts">
	import ProfilePicker from './ProfilePicker.svelte';
	let value = $state('bl');
</script>

<ProfilePicker
	title="¿Qué empresa quieres gestionar?"
	bind:value
	profiles={[
		{ id: 'bl', name: 'Bar La Plaza', subtitle: 'Propietario' },
		{ id: 'rp', name: 'Reformas Plaza', subtitle: 'Propietario', color: '#8a5a2b', badge: 2 },
		{ id: 'fc', name: 'Fontanería Centro', subtitle: 'Gestor', color: '#2b5f8a' }
	]}
	createLabel="Añadir empresa"
	createSubtitle="Crear o vincular"
	note="Conectado con tu cuenta"
	oncreate={() => {}}
/>
