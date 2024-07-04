import { createContext, useContext, useEffect, useState } from "react"

/**
 * @typedef {Object} ColorProviderProps
 * @property {React.ReactNode} children
 * @property {Color} [defaultColor]
 * @property {string} [storageKey]
 */
/**
 * @typedef {Object} ColorProviderState
 * @property {Color} color
 * @property {(color: Color) => void} setColor
 */
/**
 * @typedef {"blue"|"red"|"purple"|"default"|"orange"} Color
 */


/**
 * @type {ColorProviderState}
 */
const initialState = {
  color: "default",
  setColor: () => null,
}

const ColorProviderContext = createContext(initialState)

/**
 * 
 * @param {ColorProviderProps}
 * @returns 
 */
export function ColorProvider({
  children,
  defaultColor = "purple",
  storageKey = "vite-ui-color",
  ...props
}) {
    /**
     * @type {[Color, (color: Color) => Color]}
     */
  const [color, setColor] = useState(
    () => (localStorage.getItem(storageKey)) || defaultColor
  )

  useEffect(() => {
    const root = window.document.body;

    if (color === "default") {
      root.classList.add("purple");
      return;
    }

    root.classList.remove("blue", "red", "purple", "orange")
    root.classList.add(color)
  }, [color])

  /**
   * @type {ColorProviderState}
   */
  const value = {
    color,
    setColor: (color) => {
      localStorage.setItem(storageKey, color)
      setColor(color)
    },
  }

  return (
    <ColorProviderContext.Provider {...props} value={value}>
      {children}
    </ColorProviderContext.Provider>
  )
}

export const useColor = () => {
  const context = useContext(ColorProviderContext)

  if (context === undefined)
    throw new Error("useColor must be used within a ColorProvider")

  return context
}
