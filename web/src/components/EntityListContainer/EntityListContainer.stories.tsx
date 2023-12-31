// Pass props to your component by passing an `args` object to your story
//
// ```jsx
// export const Primary: Story = {
//  args: {
//    propName: propValue
//  }
// }
// ```
//
// See https://storybook.js.org/docs/react/writing-stories/args.

import type { Meta, StoryObj } from '@storybook/react'

import EntityListContainer from './EntityListContainer'

const meta: Meta<typeof EntityListContainer> = {
  component: EntityListContainer,
}

export default meta

type Story = StoryObj<typeof EntityListContainer>

export const Primary: Story = {}
