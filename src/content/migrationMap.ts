import type { AnswerKind } from './types'

export type RendererEngine = 'new' | 'legacy'

export type MigrationTarget =
  | 'callout'
  | 'paragraph'
  | 'sequence'
  | 'blockquote'
  | 'glossary'
  | 'checklist'
  | 'pitfalls'
  | 'comparison'
  | 'mnemonic'
  | 'references'

type DeprecationStatus = 'active' | 'overlap-legacy'

interface DeprecationNote {
  status: DeprecationStatus
  legacyPattern: string
  wave: 'wave-3'
  note: string
}

interface MigrationDefinition {
  target: MigrationTarget
  rendererOrder: readonly RendererEngine[]
  deprecation: DeprecationNote
}

export interface MigrationStrategy extends MigrationDefinition {
  kind: string
  isKnownKind: boolean
}

export const COMPAT_FALLBACK_POLICY: readonly RendererEngine[] = ['new', 'legacy']
export const UNKNOWN_KIND_FALLBACK_POLICY: readonly RendererEngine[] = ['legacy']

export const MIGRATION_MAP = {
  summary: {
    target: 'callout',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderText',
      wave: 'wave-3',
      note: 'Keep plain text callout fallback until all summary sections use component callouts.',
    },
  },
  details: {
    target: 'paragraph',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderText',
      wave: 'wave-3',
      note: 'Legacy text block remains until detail sections fully migrate to rich text primitive.',
    },
  },
  steps: {
    target: 'sequence',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderSteps',
      wave: 'wave-3',
      note: 'Ordered-list fallback must stay while sequence component rollout is partial.',
    },
  },
  example: {
    target: 'callout',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderText',
      wave: 'wave-3',
      note: 'Example blocks share text fallback until example component path is fully adopted.',
    },
  },
  note: {
    target: 'callout',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderText',
      wave: 'wave-3',
      note: 'Note sections can use new callout shell with legacy text renderer as safety net.',
    },
  },
  warning: {
    target: 'callout',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderText',
      wave: 'wave-3',
      note: 'Warning styling can migrate independently while retaining existing warning-safe text fallback.',
    },
  },
  quote: {
    target: 'blockquote',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'inline blockquote branch',
      wave: 'wave-3',
      note: 'Current quote branch remains until dedicated quote component is stable in lesson content.',
    },
  },
  definition: {
    target: 'glossary',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderDefinition',
      wave: 'wave-3',
      note: 'Definition list fallback protects pairs/body hybrid payloads during adapter hardening.',
    },
  },
  checklist: {
    target: 'checklist',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderChecklist',
      wave: 'wave-3',
      note: 'Checklist icon-list fallback remains for sparse item arrays.',
    },
  },
  pitfalls: {
    target: 'pitfalls',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderPitfalls',
      wave: 'wave-3',
      note: 'Pitfall warning list fallback stays until negative-callout variant is fully validated.',
    },
  },
  dosdonts: {
    target: 'comparison',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderDosDonts',
      wave: 'wave-3',
      note: 'Two-column legacy grid remains while comparison component handles authoring edge cases.',
    },
  },
  compare: {
    target: 'comparison',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderCompare',
      wave: 'wave-3',
      note: 'Table/column fallback remains to avoid breaking mixed compare payloads.',
    },
  },
  mnemonic: {
    target: 'mnemonic',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderMnemonic',
      wave: 'wave-3',
      note: 'Display-text mnemonic fallback is retained while mnemonic component semantics are finalized.',
    },
  },
  references: {
    target: 'references',
    rendererOrder: COMPAT_FALLBACK_POLICY,
    deprecation: {
      status: 'overlap-legacy',
      legacyPattern: 'renderReferences',
      wave: 'wave-3',
      note: 'Compact reference-list fallback remains for plain-string citation sources.',
    },
  },
} satisfies Record<AnswerKind, MigrationDefinition>

export const FALLBACK_STRATEGY: MigrationStrategy = {
  kind: '__unknown__',
  isKnownKind: false,
  target: 'paragraph',
  rendererOrder: UNKNOWN_KIND_FALLBACK_POLICY,
  deprecation: {
    status: 'active',
    legacyPattern: 'renderText',
    wave: 'wave-3',
    note: 'Unknown or unready kinds always use legacy text rendering for non-breaking compatibility.',
  },
}

function isAnswerKind(kind: string): kind is AnswerKind {
  return kind in MIGRATION_MAP
}

export function resolveMigrationStrategy(kind: string): MigrationStrategy {
  if (!isAnswerKind(kind)) {
    return {
      ...FALLBACK_STRATEGY,
      kind,
    }
  }

  return {
    ...MIGRATION_MAP[kind],
    kind,
    isKnownKind: true,
  }
}
