import type { Meta, StoryObj } from '@storybook/svelte';
import SectionHeaderStory from './SectionHeaderStory.svelte';

const meta = {
	title: 'Molecules/SectionHeader',
	component: SectionHeaderStory,
	tags: ['autodocs']
} satisfies Meta<typeof SectionHeaderStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
