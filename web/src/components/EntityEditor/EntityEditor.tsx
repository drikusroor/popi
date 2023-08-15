import { IEntity } from 'src/types/entity.interface'

interface IEntityEditorProps {
  entity: IEntity
}

const EntityEditor = ({ entity }: IEntityEditorProps) => {
  function parseStyle(cssString: string) {
    // Remove the curly braces and trim the string
    const cleanedString = cssString.replace(/[\{\}]/g, '').trim()

    // Split the cleaned string by semicolons
    const properties = cleanedString.split(';').filter(Boolean)

    // Initialize an empty object to hold our styles
    const styleObject = {}

    properties.forEach((property) => {
      // Split each property by the colon to get name and value
      const [name, value] = property.split(':').map((str) => str.trim())

      // Convert CSS property names to camelCase for React
      const camelCaseName = name.replace(/-([a-z])/g, (g) => g[1].toUpperCase())

      // Add the property to our style object
      styleObject[camelCaseName] = value
    })

    return styleObject
  }

  return (
    <div className="h-full p-4">
      <h1 className="text-2xl font-bold">Entity Editor</h1>
      <p className="mt-4 text-xl font-bold">{entity.name}</p>

      <form className="mt-4 flex flex-row gap-4">
        <div className="flex flex-col">
          <label htmlFor="html">HTML</label>
          <textarea
            className="mt-1 bg-slate-700"
            id="html"
            name="html"
            rows={10}
            cols={50}
            value={entity.html}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="css">CSS</label>
          <textarea
            className="mt-1 bg-slate-700"
            id="css"
            name="css"
            rows={10}
            cols={50}
            value={entity.css}
          />
        </div>
      </form>

      <div className="mt-4">
        {/* display element with style */}
        <div
          dangerouslySetInnerHTML={{ __html: entity.html }}
          style={{ ...parseStyle(entity.css) }}
        ></div>
      </div>
    </div>
  )
}

export default EntityEditor
