import type {
  QueryResolvers,
  MutationResolvers,
  AnimationRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'

export const animations: QueryResolvers['animations'] = () => {
  return db.animation.findMany()
}

export const animation: QueryResolvers['animation'] = ({ id }) => {
  return db.animation.findUnique({
    where: { id },
  })
}

export const createAnimation: MutationResolvers['createAnimation'] = async ({
  input,
}) => {
  const { tracks, entities, ...animationInput } = input

  const latestAnimation = await db.animation.findFirst({
    where: {
      animationHistoryId: input.animationHistoryId,
    },
    orderBy: {
      version: 'desc',
    },
  })

  const version = latestAnimation ? latestAnimation.version + 1 : 1

  const createdAnimation = await db.animation.create({
    data: {
      ...animationInput,
      version,
    },
  })

  const createdEntities = await Promise.all(
    entities.map((entity) => {
      const { uuid: _uuid, ...entityInput } = entity

      return db.animationEntity.create({
        data: {
          ...entityInput,
          revisionId: createdAnimation.id,
        },
      })
    })
  )

  const createdTracks = await Promise.all(
    tracks.map(async (track) => {
      const { clips: _clips, ...trackInput } = track

      const createdTrack = await db.animationTrack.create({
        data: {
          ...trackInput,
          revisionId: createdAnimation.id,
        },
      })

      const createdClips = await Promise.all(
        track.clips.map((clip) => {
          const {
            animationEntityUuid,
            keyframes: _keyframes,
            ...clipInput
          } = clip

          const createdEntityIndex = entities.findIndex(
            (entity) => entity.uuid === animationEntityUuid
          )

          const animationEntityId = createdEntities[createdEntityIndex].id

          return db.animationTrackClip
            .create({
              data: {
                ...clipInput,
                animationTrackId: createdTrack.id,
                animationEntityId,
              },
            })
            .then(async (createdClip) => {
              const keyframes = await Promise.all(
                clip.keyframes.map((keyframe) => {
                  return db.animationTrackKeyframe.create({
                    data: {
                      ...keyframe,
                      animationTrackClipId: createdClip.id,
                    },
                  })
                })
              )

              return {
                ...createdClip,
                keyframes,
              }
            })
        })
      )

      return {
        ...createdTrack,
        clips: createdClips,
      }
    })
  )

  return {
    ...createdAnimation,
    entities: createdEntities,
    tracks: createdTracks,
  }
}

export const updateAnimation: MutationResolvers['updateAnimation'] = ({
  id,
  input,
}) => {
  return db.animation.update({
    data: input,
    where: { id },
  })
}

export const deleteAnimation: MutationResolvers['deleteAnimation'] = ({
  id,
}) => {
  return db.animation.delete({
    where: { id },
  })
}

export const Animation: AnimationRelationResolvers = {
  AnimationHistory: (_obj, { root }) => {
    return db.animation
      .findUnique({ where: { id: root?.id } })
      .AnimationHistory()
  },
  tracks: (_obj, { root }) => {
    return db.animation.findUnique({ where: { id: root?.id } }).tracks()
  },
  entities: (_obj, { root }) => {
    return db.animation.findUnique({ where: { id: root?.id } }).entities()
  },
}
