import type { Meta, StoryObj } from '@storybook/svelte';
import SectionTitleStory from './SectionTitleStory.svelte';

const meta = {
	title: 'Atoms/SectionTitle',
	component: SectionTitleStory,
	tags: ['autodocs']
} satisfies Meta<typeof SectionTitleStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
