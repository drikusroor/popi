import { useBoundStore } from 'src/store'

import EntityEditor from '../EntityEditor/EntityEditor'

const EntityEditorContainer = () => {
  const currentSelection = useBoundStore((state) => state.selection)

  const select = useBoundStore((state) => state.select)
  const deselectEntity = () => select(null)

  const entities = useBoundStore((state) => state.entities)
  const updateEntity = useBoundStore((state) => state.updateEntity)

  if (currentSelection?.type !== 'entity') return null

  const selectedEntity = entities.find(
    (entity, index) => currentSelection?.path[0] === index
  )

  if (!selectedEntity) return null

  return (
    <EntityEditor
      entity={selectedEntity}
      deselectEntity={deselectEntity}
      updateEntity={(entity) => updateEntity(entity, currentSelection.path[0])}
    />
  )
}

export default EntityEditorContainer
