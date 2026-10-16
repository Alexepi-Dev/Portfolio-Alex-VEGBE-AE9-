import fr from './fr'
import en from './en'

export const dictionaries = { fr, en }
export const fill = (str, vars = {}) =>
  str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`))
