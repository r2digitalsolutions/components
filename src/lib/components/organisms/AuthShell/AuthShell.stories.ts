import type { Meta, StoryObj } from '@storybook/svelte';
import AuthShellStory from './AuthShellStory.svelte';

const meta = {
	title: 'Organisms/AuthShell',
	component: AuthShellStory,
	tags: ['autodocs'],
	parameters: { layout: 'fullscreen' },
	args: {
		brand: 'R2DigiSolutions',
		tagline: 'Build faster with a cohesive design system.'
	}
} satisfies Meta<typeof AuthShellStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLogin: Story = {};
