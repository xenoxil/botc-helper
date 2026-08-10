export type BuiltinScriptIdT =
  | 'trouble-brewing'
  | 'bad-moon-rising'
  | 'sects-and-violets'
  | 'chefs-deluxe'

export type ScriptIdT = BuiltinScriptIdT | (string & {})

export interface IBuiltinScript {
  id: BuiltinScriptIdT
  name: string
  author: string
  raw: unknown[]
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

export const DEFAULT_SCRIPT_ID: BuiltinScriptIdT = 'trouble-brewing'
