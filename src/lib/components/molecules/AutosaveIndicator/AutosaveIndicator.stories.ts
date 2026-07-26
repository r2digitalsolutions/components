import type { Meta, StoryObj } from '@storybook/svelte';
import AutosaveIndicatorStory from './AutosaveIndicatorStory.svelte';

const meta = {
	title: 'Molecules/AutosaveIndicator',
	component: AutosaveIndicatorStory,
	tags: ['autodocs']
} satisfies Meta<typeof AutosaveIndicatorStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
