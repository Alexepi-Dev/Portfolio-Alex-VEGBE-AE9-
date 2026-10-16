export const asset = (path) => `${import.meta.env.BASE_URL}${path}`.replace(/\/\.\//, '/')

export function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
