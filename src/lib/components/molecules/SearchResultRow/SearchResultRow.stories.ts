import type { Meta, StoryObj } from '@storybook/svelte'
import SearchResultRowStory from './SearchResultRowStory.svelte'

const meta = {
	title: 'Molecules/SearchResultRow',
	component: SearchResultRowStory,
	tags: ['autodocs'],
	argTypes: {
		example: {
			control: 'select',
			options: ['basic', 'with-favicon', 'no-href', 'leading-slot']
		}
	}
} satisfies Meta<typeof SearchResultRowStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: { example: 'basic' }
}

export const WithFavicons: Story = {
	args: { example: 'with-favicon' }
}

export const NoHref: Story = {
	args: { example: 'no-href' }
}

export const LeadingSlot: Story = {
	args: { example: 'leading-slot' }
}
