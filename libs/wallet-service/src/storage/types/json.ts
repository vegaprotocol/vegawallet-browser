/**
 * Formalised JSON types (as far as the type system allows)
 * to aid in spcifying JSON based storage backends. We include the
 * Javascript `toJSON` interface, as the below types cover the
 * behaviour of `JSON.stringify`
 */
export type Literal = string | number | boolean | null

export type Array = Value[]

export type Mapping = { [Key in string]: Value }

export type Value = Literal | Array | Mapping

export interface toJSON {
  toJSON(): Value
}

export type Serializable = Value | toJSON
