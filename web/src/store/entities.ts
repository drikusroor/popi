import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import { IEntity } from 'src/types/entity.interface'

interface IEntitiesState {
  entities: IEntity[]
  addEntity: (entity: IEntity) => void
  removeEntity: (entity: IEntity) => void
  updateEntity: (entity: IEntity) => void
  setEntities: (entities: IEntity[]) => void
}

const useEntitiesStore = create<IEntitiesState>()(
  devtools(
    (set) => ({
      entities: [],
      addEntity: (entity: IEntity) =>
        set((state) => ({
          entities: [...state.entities, entity],
        })),
      removeEntity: (entity: IEntity) =>
        set((state) => {
          const indexOf = state.entities.indexOf(entity)

          if (indexOf === -1) return state

          state.entities.splice(indexOf, 1)
          return state
        }),
      updateEntity: (entity: IEntity) =>
        set((state) => {
          const indexOf = state.entities.indexOf(entity)

          if (indexOf === -1) return state

          state.entities[indexOf] = entity
          return state
        }),
      setEntities: (entities: IEntity[]) =>
        set(() => ({
          entities,
        })),
    }),

    {
      name: 'entities-storage',
    }
  )
)

export default useEntitiesStore
