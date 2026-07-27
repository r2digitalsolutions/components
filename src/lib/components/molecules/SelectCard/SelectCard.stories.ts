import type { Meta, StoryObj } from '@storybook/svelte';
import SelectCardStory from './SelectCardStory.svelte';

const meta = {
	title: 'Molecules/SelectCard',
	component: SelectCardStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['media', 'row', 'badge', 'plans']
		}
	}
} satisfies Meta<typeof SelectCardStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MediaGrid: Story = {
	args: { example: 'media' }
};

export const ListRows: Story = {
	args: { example: 'row' }
};

export const CheckBadge: Story = {
	args: { example: 'badge' }
};

export const PlanPicker: Story = {
	args: { example: 'plans' }
};
