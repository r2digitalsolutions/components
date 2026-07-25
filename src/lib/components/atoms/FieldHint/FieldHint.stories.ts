import type { Meta, StoryObj } from '@storybook/svelte';
import FieldHintStory from './FieldHintStory.svelte';

const meta = {
	title: 'Atoms/FieldHint',
	component: FieldHintStory,
	tags: ['autodocs'],
	argTypes: {
		tone: { control: 'select', options: ['muted', 'info', 'success', 'warning', 'error'] }
	},
	args: { text: 'We will never share your email.', tone: 'muted' }
} satisfies Meta<typeof FieldHintStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
	args: { text: 'Enter a valid email address.', tone: 'error' }
};
