import type { Meta, StoryObj } from '@storybook/svelte';
import WidgetCanvasStory from './WidgetCanvasStory.svelte';

const meta = {
	title: 'Molecules/WidgetCanvas',
	component: WidgetCanvasStory,
	tags: ['autodocs']
} satisfies Meta<typeof WidgetCanvasStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scroll: Story = { args: { example: 'scroll' } };

export const FitAutoCells8: Story = { args: { example: 'fitAuto8' } };

export const FullscreenAutoCells8: Story = { args: { example: 'fullscreenAuto8' } };
