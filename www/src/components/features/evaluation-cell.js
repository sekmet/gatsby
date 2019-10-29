/** @jsx jsx */
import { jsx } from "theme-ui"
import { colors } from "gatsby-design-tokens"
import MdInfoOutline from "react-icons/lib/md/info-outline"

const bgDefault = colors.orange[20]
const bgFeatureAvailability = colors.orange[50]

const renderText = txt => {
  const words = txt.split(` `)
  return [
    words.slice(0, words.length - 1).join(` `),
    <span key={`info-icon-${words[words.length - 1]}`}>
      {` `}
      {`${words[words.length - 1]} `}
      <MdInfoOutline
        sx={{
          height: t => t.space[3],
          mb: 1,
          verticalAlign: `baseline`,
        }}
        alt={`Info Icon`}
      />
    </span>,
  ]
}

const renderCell = (text, column) => {
  if (column === 0) {
    return (
      <div
        sx={{
          display: `inline-block`,
          mx: `auto`,
          textAlign: `left`,
          verticalAlign: `middle`,
        }}
      >
        <button
          sx={{
            background: `none`,
            border: 0,
            color: `text`,
            cursor: `inherit`,
            p: 0,
            textAlign: `left`,
          }}
          onClick={e => {
            e.preventDefault()
          }}
        >
          {renderText(text)}
        </button>
      </div>
    )
  } else if (column >= 1 || column <= 5) {
    return <EvaluationCell num={text} />
  }
  return null
}

const getBackground = num => {
  switch (num) {
    case `2`: {
      return `linear-gradient(90deg, transparent 50%, ${bgDefault} 50%)`
    }
    case `1`: {
      return `linear-gradient(180deg, transparent 50%, ${bgDefault} 50%), linear-gradient(90deg, transparent 50%, ${bgDefault} 50%)`
    }
    case `3`:
    case `0`:
    case ``:
    case `N/A`:
    default: {
      return `none`
    }
  }
}

const basicStyling = {
  height: t => t.space[5],
  width: t => t.space[5],
  borderRadius: `50%`,
  margin: `0 auto`,
}

const EvaluationCell = ({ num, style }) => (
  <div
    sx={{
      ...basicStyling,
      backgroundColor:
        [`N/A`, `0`, ``].indexOf(num) !== -1
          ? bgDefault
          : bgFeatureAvailability,
      backgroundImage: getBackground(num),
      ...(style || {}),
    }}
  />
)

export default EvaluationCell

export { renderCell, renderText }
