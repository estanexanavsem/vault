import { ExternalLink } from 'lucide-react'
import type { LegalSectionPart as LegalSectionPartData } from '../../data/legalSections'

const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
}

interface LegalSectionPartProps {
  part: LegalSectionPartData
}

export function LegalSectionPart({ part }: LegalSectionPartProps) {
  if (typeof part === 'string') {
    return part
  }

  if (part.kind === 'strong') {
    return <strong>{part.text}</strong>
  }

  if (part.kind === 'break') {
    return <br />
  }

  return (
    <a href={part.href} aria-label={`${part.text} (Opens in a new tab)`} {...externalLinkProps}>
      {part.text}
      <ExternalLink size={13} aria-hidden="true" />
    </a>
  )
}
