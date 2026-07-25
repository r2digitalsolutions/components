import type { Meta, StoryObj } from '@storybook/svelte';
import PollStory from './PollStory.svelte';

const meta = {
	title: 'Molecules/Poll',
	component: PollStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['release', 'results', 'binary', 'multiple', 'cards', 'changeable', 'closed']
		},
		size: { control: 'select', options: ['sm', 'md', 'lg'] },
		layout: { control: 'select', options: ['list', 'cards'] },
		showResults: { control: 'boolean' },
		allowChange: { control: 'boolean' },
		multiple: { control: 'boolean' },
		showPercent: { control: 'boolean' },
		showCounts: { control: 'boolean' },
		sortByVotes: { control: 'boolean' },
		disabled: { control: 'boolean' }
	},
	args: {
		example: 'release',
		size: 'md',
		layout: 'list',
		showResults: false,
		allowChange: false,
		multiple: false,
		showPercent: true,
		showCounts: false,
		sortByVotes: false,
		disabled: false
	}
} satisfies Meta<typeof PollStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Results: Story = {
	args: { example: 'results', showCounts: true, sortByVotes: true }
};

export const Binary: Story = {
	args: { example: 'binary' }
};

export const Multiple: Story = {
	name: 'Multi-select',
	args: { example: 'multiple' }
};

export const Cards: Story = {
	args: { example: 'cards', layout: 'cards' }
};

export const Changeable: Story = {
	name: 'Changeable vote',
	args: { example: 'changeable', allowChange: true }
};

export const Closed: Story = {
	args: { example: 'closed' }
};

export const Compact: Story = {
	args: { example: 'release', size: 'sm' }
};
