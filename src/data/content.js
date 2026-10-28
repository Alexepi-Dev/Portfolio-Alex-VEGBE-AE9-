// Données non traduites : images, icônes, niveaux, dates, liens.

// Passez à false pour afficher « Actuellement indisponible » à la place du badge de disponibilité.
export const AVAILABLE = true

export const physicalProjects = [
  { id: 'pendentif', image: 'images/pendentif.webp', tech: ['cad', 'cadDrafting'] },
  { id: 'organiseur', image: 'images/organiseur.webp', tech: ['cad', 'product'] },
  { id: 'veilleuse', image: 'images/veilleuse.webp', tech: ['cnc', 'lamp', 'design'] },
  { id: 'enseigneFortnite', image: 'images/enseigne-fortnite.png', tech: ['cad', 'electronics', 'design'] },
  { id: 'enseigneFreeWifi', image: 'images/enseigne-free-wifi.jpg', tech: ['cad', 'electronics', 'design'] },
]

export const webProjects = [
  { id: 'lettres', route: '/lettres-mysteres', image: 'images/lettres-mysteres-logo-v2.png' },
  { id: 'pret', route: '/calculateur-pret', image: 'images/calculateur-pret-logo.png' },
]

export const services = ['businessLaw', 'digitalLaw', 'legalDesign', 'cad', 'cnc', 'arduino', 'web']

export const skillGroups = [
  { key: 'engineering', items: [['cad', 90], ['cnc', 85], ['arduino', 80], ['electronics', 70]] },
  { key: 'digital', items: [['graphics', 85], ['html', 90], ['js', 80], ['uiux', 80]] },
  { key: 'legal', items: [['businessLaw', 80], ['digitalLaw', 95], ['legalDesign', 75]] },
]

// Parcours (du plus récent au plus ancien). precision: 'day' | 'month'
// Ajoutez ici votre formation et vos expériences : { id, date, precision, type: 'badge'|'project', image? }
// puis les textes correspondants dans i18n/fr.js et en.js (journey.items.<id>).
export const journey = [
  { id: 'portfolio', date: '2026-10-01', precision: 'month', type: 'project' },
  { id: 'attestationFormation', date: '2026-07-15', precision: 'day', type: 'certificate', image: 'images/badge-developpement-web.png', document: 'documents/attestation-formation.pdf' },
  { id: 'appliquerIa', date: '2026-06-29', precision: 'day', type: 'badge', image: 'images/badge-appliquer-ia.webp' },
  { id: 'outils', date: '2026-06-29', precision: 'day', type: 'badge', image: 'images/badge-outils.webp' },
  { id: 'iaModerne', date: '2026-05-28', precision: 'day', type: 'badge', image: 'images/badge-ia-moderne.webp' },
  { id: 'itEssentials', date: '2026-05-16', precision: 'day', type: 'badge', image: 'images/badge-it-essentials.webp' },
  { id: 'certificatMarketingDigital', date: '2026-05-01', precision: 'month', type: 'certificate', document: 'documents/certificat-marketing-digital.pdf' },
]

export const FORMSPREE_URL = 'https://formspree.io/f/mjggldav'

export const socials = [
  { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/alex-koffi-vegbe-a69589306' },
  { id: 'github', label: 'GitHub — Alexepi-Dev (A.K. VEGBE)', href: 'https://github.com/Alexepi-Dev' },
  { id: 'facebook', label: 'Facebook', href: 'https://web.facebook.com/alex.epiphane.vegbe/' },
]
