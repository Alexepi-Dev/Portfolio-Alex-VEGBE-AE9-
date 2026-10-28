const SITE_URL = 'https://alexvegbeae9.netlify.app'

function setMeta(selector, attribute, value) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    const [key, keyValue] = selector.match(/^meta\[(.+?)="(.+)"\]$/)?.slice(1) || []
    if (key && keyValue) element.setAttribute(key, keyValue)
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

export function setPageSeo({ title, description, url = SITE_URL, type = 'website', image = `${SITE_URL}/images/hero.webp` }) {
  document.title = title
  setMeta('meta[name="description"]', 'content', description)

  let canonical = document.head.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  canonical.href = url

  setMeta('meta[property="og:title"]', 'content', title)
  setMeta('meta[property="og:description"]', 'content', description)
  setMeta('meta[property="og:type"]', 'content', type)
  setMeta('meta[property="og:url"]', 'content', url)
  setMeta('meta[property="og:image"]', 'content', image)
  setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image')
  setMeta('meta[name="twitter:title"]', 'content', title)
  setMeta('meta[name="twitter:description"]', 'content', description)
  setMeta('meta[name="twitter:image"]', 'content', image)
}

export function setPersonStructuredData() {
  let script = document.getElementById('person-schema')
  if (!script) {
    script = document.createElement('script')
    script.id = 'person-schema'
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'VEGBE Koffi Alex',
    alternateName: 'A.K. VEGBE',
    url: SITE_URL,
    image: `${SITE_URL}/images/alex.png`,
    jobTitle: ['Concepteur technique', 'Développeur front-end', 'Juriste'],
    sameAs: [
      'https://github.com/Alexepi-Dev',
      'https://www.linkedin.com/in/alex-koffi-vegbe-a69589306',
      'https://web.facebook.com/alex.epiphane.vegbe/',
    ],
    knowsAbout: ['Modélisation 3D', 'CNC', 'Arduino', 'React', 'Design graphique', 'Propriété intellectuelle'],
  })
}

export function addGoogleVerification(token) {
  if (!token?.trim()) return
  setMeta('meta[name="google-site-verification"]', 'content', token.trim())
}
