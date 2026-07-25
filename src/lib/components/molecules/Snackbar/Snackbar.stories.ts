import type { Meta, StoryObj } from '@storybook/svelte';
import SnackbarStory from './SnackbarStory.svelte';

const meta = {
	title: 'Molecules/Snackbar',
	component: SnackbarStory,
	tags: ['autodocs']
} satisfies Meta<typeof SnackbarStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
