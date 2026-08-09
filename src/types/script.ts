export type BuiltinScriptIdT =
  | 'trouble-brewing'
  | 'bad-moon-rising'
  | 'sects-and-violets'

export type ScriptIdT = BuiltinScriptIdT | (string & {})

export interface IBuiltinScript {
  id: BuiltinScriptIdT
  name: string
  author: string
}

export interface ICustomScript {
  id: string
  name: string
  author: string
  sourceFileName: string
  raw: unknown[]
}

export interface IScriptMeta {
  name: string
  author: string
}

export const BUILTIN_SCRIPTS: readonly IBuiltinScript[] = [
  {
    id: 'trouble-brewing',
    name: 'Trouble Brewing',
    author: 'The Pandemonium Institute',
  },
  {
    id: 'bad-moon-rising',
    name: 'Bad Moon Rising',
    author: 'The Pandemonium Institute',
  },
  {
    id: 'sects-and-violets',
    name: 'Sects & Violets',
    author: 'The Pandemonium Institute',
  },
] as const

export const DEFAULT_SCRIPT_ID: BuiltinScriptIdT = 'trouble-brewing'

export const isBuiltinScriptId = (value: string): value is BuiltinScriptIdT =>
  BUILTIN_SCRIPTS.some((script) => script.id === value)
