import type { Meta, StoryObj } from '@storybook/svelte';
import WidgetCanvasStory from './WidgetCanvasStory.svelte';

const meta = {
	title: 'Molecules/WidgetCanvas',
	component: WidgetCanvasStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['scroll', 'scrollAuto', 'fitAuto8', 'fullscreenAuto8']
		}
	}
} satisfies Meta<typeof WidgetCanvasStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Scroll: Story = { args: { example: 'scroll' } };

export const ScrollAuto: Story = { args: { example: 'scrollAuto' } };

export const FitAutoCells8: Story = { args: { example: 'fitAuto8' } };

export const FullscreenAutoCells8: Story = { args: { example: 'fullscreenAuto8' } };
