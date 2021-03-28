/**
 * Block of JSON definition. Have text with another inner content. Other keys define formatting.
 */
export interface TextBlock {
  text: RichTextBlock | RichTextBlock[]
  bold?: boolean
  italic?: boolean
  strike?: boolean
  header?: number
  line?: boolean
  [key: string]: any
}

interface Serializers<T> {
  [key: string]: (content: T, record: any) => T
}

export type CustomSerializers<T> = Omit<
  Serializers<T>,
  'text' | 'bold' | 'italic' | 'strike' | 'header' | 'line'
>

export type RichTextBlock = string | TextBlock
export type RichTextJson = RichTextBlock[]

export interface Serializer<T> {
  convert: (richJson: RichTextJson) => T
  parse?: (content: T) => RichTextJson
}

export type SerializerConstructor<C, T> = (config?: C) => Serializer<T>
