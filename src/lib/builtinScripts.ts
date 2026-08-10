import type { BuiltinScriptIdT, IBuiltinScript } from '../types/script'
import badMoonRising from '../scripts/Bad_Moon_Rising_RU.json'
import chefsDeluxe from '../scripts/Chef_s_Deluxe_RU.json'
import sectsViolets from '../scripts/Sects_Violets_RU.json'
import troubleBrewing from '../scripts/Trouble_Brewing_RU.json'

export const BUILTIN_SCRIPTS: readonly IBuiltinScript[] = [
  {
    id: 'trouble-brewing',
    name: 'Trouble Brewing',
    author: 'The Pandemonium Institute',
    raw: troubleBrewing as unknown[],
  },
  {
    id: 'bad-moon-rising',
    name: 'Bad Moon Rising',
    author: 'The Pandemonium Institute',
    raw: badMoonRising as unknown[],
  },
  {
    id: 'sects-and-violets',
    name: 'Sects & Violets',
    author: 'The Pandemonium Institute',
    raw: sectsViolets as unknown[],
  },
  {
    id: 'chefs-deluxe',
    name: "Chef's Deluxe",
    author: 'Harald',
    raw: chefsDeluxe as unknown[],
  },
] as const

export const isBuiltinScriptId = (value: string): value is BuiltinScriptIdT =>
  BUILTIN_SCRIPTS.some((script) => script.id === value)
