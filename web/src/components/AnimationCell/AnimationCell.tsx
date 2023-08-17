import type {
  FindAnimationQuery,
  FindAnimationQueryVariables,
  UpdateAnimationInput,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { useBoundStore } from 'src/store'

import AnimationEditor from '../AnimationEditor/AnimationEditor'

import { mapAnimationQueryData } from './helpers/map'

export const QUERY = gql`
  query FindAnimationQuery($id: Int!) {
    animation: animation(id: $id) {
      id
      name
      description
      animationHistoryId
      version
      createdAt
      updatedAt

      entities {
        id
        name
        description
        createdAt
        updatedAt
        image
        html
        css
      }

      tracks {
        id
        name
        description
        createdAt
        updatedAt
        sortNumber
        color

        clips {
          id
          uuid
          start
          animationTrackId
          animationEntityId

          keyframes {
            id
            uuid
            sort
            duration
            css
          }
        }
      }
    }
  }
`

const UPDATE_ANIMATION_MUTATION = gql`
  mutation UpdateAnimationMutation($id: Int!, $input: UpdateAnimationInput!) {
    updateAnimation(id: $id, input: $input) {
      id
      name
      description
      animationHistoryId
      version

      entities {
        id
        name
        description
        createdAt
        updatedAt
        image
        html
        css
      }

      tracks {
        id
        name
        description
        createdAt
        updatedAt
        sortNumber
        color

        clips {
          id
          uuid
          start
          animationTrackId
          animationEntityId

          keyframes {
            id
            uuid
            sort
            duration
            css
          }
        }
      }
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({
  error,
}: CellFailureProps<FindAnimationQueryVariables>) => (
  <div style={{ color: 'red' }}>Error: {error?.message}</div>
)

export const Success = (
  queryData: CellSuccessProps<FindAnimationQuery, FindAnimationQueryVariables>
) => {
  const [updateAnimation, { loading, error }] = useMutation(
    UPDATE_ANIMATION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Animation updated')
        navigate(routes.animation())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateAnimationInput,
    id: EditAnimationById['animation']['id']
  ) => {
    updateAnimation({ variables: { id, input } })
  }

  const setAnimation = useBoundStore((state) => state.setAnimation)
  const getAggregatedAnimation = useBoundStore(
    (state) => state.getAggregatedAnimation
  )
  const setEntities = useBoundStore((state) => state.setEntities)
  const setTracks = useBoundStore((state) => state.setTracks)

  const { animation, entities, tracks } = mapAnimationQueryData(queryData)

  setAnimation(animation)
  setEntities(entities)
  setTracks(tracks)

  const aggregatedAnimation = getAggregatedAnimation()

  return (
    <AnimationEditor
      entities={entities}
      tracks={tracks}
      onSave={() => onSave(aggregatedAnimation, animation.id)}
      error={error}
      loading={loading}
    />
  )
}
