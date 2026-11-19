import type { Meta, StoryObj } from '@storybook/svelte';
import SectionNavStory from './SectionNavStory.svelte';

const meta = {
	title: 'Molecules/SectionNav',
	component: SectionNavStory,
	tags: ['autodocs'],
	parameters: { layout: 'padded' }
} satisfies Meta<typeof SectionNavStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
