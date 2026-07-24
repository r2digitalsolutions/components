import type { Meta, StoryObj } from '@storybook/svelte';
import AspectRatioStory from './AspectRatioStory.svelte';

const meta = {
	title: 'Atoms/AspectRatio',
	component: AspectRatioStory,
	tags: ['autodocs'],
	argTypes: { ratio: { control: 'number' } },
	args: { ratio: 1.777777778 }
} satisfies Meta<typeof AspectRatioStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Widescreen: Story = {};
export const Square: Story = { args: { ratio: 1 } };
export const Portrait: Story = { args: { ratio: 0.75 } };
