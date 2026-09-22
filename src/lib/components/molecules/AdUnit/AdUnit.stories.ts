import type { Meta, StoryObj } from '@storybook/svelte'
import AdUnitStory from './AdUnitStory.svelte'

const meta = {
	title: 'Molecules/AdUnit',
	component: AdUnitStory,
	tags: ['autodocs'],
	argTypes: {
		format: {
			control: 'select',
			options: ['native', 'search', 'horizontal', 'banner', 'vertical']
		}
	}
} satisfies Meta<typeof AdUnitStory>

export default meta
type Story = StoryObj<typeof meta>

export const Native: Story = {
	args: { format: 'native' }
}

export const Search: Story = {
	args: { format: 'search' }
}

export const Horizontal: Story = {
	args: { format: 'horizontal' }
}

export const Banner: Story = {
	args: { format: 'banner' }
}

export const Vertical: Story = {
	args: { format: 'vertical' }
}
