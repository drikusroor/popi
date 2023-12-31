import { FaTrash } from 'react-icons/fa'

import { useBoundStore } from 'src/store'
import { ITrack } from 'src/types/track.interface'

interface DeleteTrackButtonProps {
  track: ITrack
}

const DeleteTrackButton = ({ track }: DeleteTrackButtonProps) => {
  const openDialog = useBoundStore((state) => state.addDialog)
  const removeTrack = useBoundStore((state) => state.removeTrack)

  const onClick = () => {
    openDialog({
      body: `Are you sure you want to delete this track ${track.name}?`,
      onConfirm: () => removeTrack(track),
      confirmButtonText: 'Delete',
    })
  }

  return (
    <button
      onClick={onClick}
      className="rounded bg-none p-1 text-slate-300 transition-colors hover:bg-red-600 hover:text-slate-100"
    >
      <FaTrash />
    </button>
  )
}

export default DeleteTrackButton
