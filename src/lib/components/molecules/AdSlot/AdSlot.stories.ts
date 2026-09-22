import type { Meta, StoryObj } from '@storybook/svelte'
import AdSlotStory from './AdSlotStory.svelte'

const meta = {
	title: 'Molecules/AdSlot',
	component: AdSlotStory,
	tags: ['autodocs']
} satisfies Meta<typeof AdSlotStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {}
}
