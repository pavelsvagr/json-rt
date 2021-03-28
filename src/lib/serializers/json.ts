import { SerializerConstructor } from '../interfaces'
import { RichTextJson } from '../../main'

/**
 * Basic json serializer of given format. (JSON.parse / JSON.stringify can be used instead)
 */
export const jsonSerializer: SerializerConstructor<undefined, string> = () => ({
  convert: richJson => JSON.stringify(richJson),
  parse: (json: string): RichTextJson => JSON.parse(json),
})
