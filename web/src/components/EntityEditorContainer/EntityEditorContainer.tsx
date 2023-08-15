import useEntitiesStore from 'src/store/entities'
import useSelectionStore from 'src/store/selection'

import EntityEditor from '../EntityEditor/EntityEditor'

const EntityEditorContainer = () => {
  const currentSelection = useSelectionStore((state) => state.selection)

  const entities = useEntitiesStore((state) => state.entities)

  if (currentSelection?.type !== 'entity') return null

  const selectedEntity = entities.find(
    (entity, index) => currentSelection.index === index
  )

  if (!selectedEntity) return null

  return <EntityEditor entity={selectedEntity} />
}

export default EntityEditorContainer
