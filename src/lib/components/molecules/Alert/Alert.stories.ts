import type { Meta, StoryObj } from '@storybook/svelte';
import AlertStory from './AlertStory.svelte';

const meta = {
	title: 'Molecules/Alert',
	component: AlertStory,
	tags: ['autodocs'],
	argTypes: {
		variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] },
		title: { control: 'text' },
		message: { control: 'text' },
		dismissible: { control: 'boolean' }
	},
	args: {
		variant: 'info',
		title: 'System Notification',
		message: 'Scheduled maintenance tonight at 02:00 UTC.',
		dismissible: true
	}
} satisfies Meta<typeof AlertStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
	args: { variant: 'info', title: 'Tip', message: 'You can customize dark mode in settings.' }
};
export const Success: Story = {
	args: { variant: 'success', title: 'Payment Successful', message: 'Your invoice #1042 has been paid.' }
};
export const Warning: Story = {
	args: { variant: 'warning', title: 'Low Storage', message: 'You have used 92% of your allocated disk space.' }
};
export const Error: Story = {
	args: { variant: 'error', title: 'Connection Lost', message: 'Unable to reach authentication server.' }
};
export const WithItems: Story = {
	args: {
		variant: 'error',
		title: 'No se pudo guardar el formulario',
		message: 'Corrige los siguientes errores e inténtalo de nuevo.',
		items: [
			{ id: 'email', text: 'El email no es válido' },
			{ id: 'password', text: 'La contraseña debe tener al menos 8 caracteres' },
			{ id: 'terms', text: 'Debes aceptar los términos y condiciones' }
		],
		dismissible: true
	}
};
