import type { Meta, StoryObj } from '@storybook/svelte';
import InsetStory from './InsetStory.svelte';

const meta = {
	title: 'Atoms/Inset',
	component: InsetStory,
	tags: ['autodocs']
} satisfies Meta<typeof InsetStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
