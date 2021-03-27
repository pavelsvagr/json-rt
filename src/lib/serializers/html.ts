import {
  CustomSerializers,
  RichTextJson,
  RichTextBlock,
  SerializerConstructor,
} from '../interfaces'

/**
 * Simple structure for HTML element representation
 */
export interface HtmlElement {
  el: string
  classes: Map<string, true>
  content: string | HtmlElement | Array<string | HtmlElement>
}

export type HtmlContent = HtmlElement | string
type HtmlSerializeFn = string | ((text: HtmlContent) => HtmlContent)
type HtmlLevelSerializeFn = (level: number, text: HtmlContent) => HtmlContent

interface HtmlSerializerConfig {
  spaceBetween?: boolean
  serializers?: CustomSerializers<HtmlContent>
  defaultSerializers?: {
    bold?: HtmlSerializeFn
    italic?: HtmlSerializeFn
    strike?: HtmlSerializeFn
    header?: HtmlLevelSerializeFn
    line?: HtmlSerializeFn
  }
}

/**
 * Helper function to create a new HTML element interface quickly.
 */
export const newElement = (
  name: string,
  content: HtmlContent,
  htmlClasses?: string[]
): HtmlElement => ({
  el: name,
  classes: new Map(htmlClasses ? htmlClasses.map(c => [c, true]) : []),
  content,
})

/**
 * Helper function to append new class to existing HTML element quickly.
 */
export const appendClass = (element: HtmlElement, htmlClass: string) => {
  element.classes.set(htmlClass, true)
  return element
}

/**
 * HTML Serializer of JSON Rich Text object ot HTML.
 * @param config
 * @return {{convert: (richJson: RichTextJson) => string}}
 */
export const htmlSerializer: SerializerConstructor<
  HtmlSerializerConfig,
  string
> = (config: HtmlSerializerConfig = {}) => {
  /**
   * Helper function for simple serialization of html elements
   * @param elementName
   * @param content
   * @param options
   * @return {HtmlElement}
   */
  const elementSerialize = (
    elementName: string,
    content: HtmlContent,
    options: {
      classElement?: string
      serialize?: HtmlSerializeFn
    } = {}
  ): HtmlContent => {
    const { classElement, serialize } = options

    if (serialize) {
      if (typeof serialize === 'string') {
        if (typeof content === 'string') {
          return newElement(classElement ?? elementName, content, [serialize])
        }
        return appendClass(content, serialize)
      } else {
        return serialize(content)
      }
    }

    return newElement(elementName, content)
  }

  /**
   * Converts bold text block to bold text in HTML.
   * @param level
   * @param element
   * @return {HtmlContent}
   */
  const headerSerialize = (
    level: number,
    element: HtmlContent
  ): HtmlContent => {
    const serialize = config.defaultSerializers?.header
    if (serialize) return serialize(level, element)
    return elementSerialize(`h${level}`, element)
  }

  /**
   * Apply all attributes from config format and returns final HTML structure
   * @param textBlock
   * @return {string | HtmlContent}
   */
  const applyAttributes = (textBlock: RichTextBlock): string | HtmlElement => {
    if (typeof textBlock === 'string') {
      return textBlock
    }

    let content: HtmlContent = Array.isArray(textBlock.text)
      ? convertBlocksToHtml(textBlock.text)
      : applyAttributes(textBlock.text)

    if (textBlock.bold) {
      content = elementSerialize('strong', content, {
        serialize: config.defaultSerializers?.bold,
        classElement: 'span',
      })
    }
    if (textBlock.italic) {
      content = elementSerialize('em', content, {
        serialize: config.defaultSerializers?.italic,
        classElement: 'span',
      })
    }
    if (textBlock.strike) {
      content = elementSerialize('del', content, {
        serialize: config.defaultSerializers?.strike,
        classElement: 'span',
      })
    }
    if (textBlock.header) {
      content = headerSerialize(textBlock.header, content)
    }
    if (textBlock.line) {
      content = elementSerialize('div', content, {
        serialize: config.defaultSerializers?.line,
        classElement: 'div',
      })
    }

    if (config.serializers) {
      Object.keys(config.serializers).forEach(key => {
        if (key in textBlock && config.serializers) {
          content = config.serializers[key](content, textBlock[key])
        }
      })
    }

    return content
  }

  /**
   * Converts HTML structure of one element to string
   * @param element
   * @return {string}
   */
  const contentToString = (element: HtmlContent): string => {
    if (typeof element === 'string') {
      return element
    }

    const classes = element.classes.size
      ? ` class="${Array.from(element.classes.keys()).join(',')}"`
      : ''

    const text = Array.isArray(element.content)
      ? element.content
          .map(contentToString)
          .join(config.spaceBetween ? ' ' : '')
      : contentToString(element.content)
    return `<${element.el}${classes}>${text}</${element.el}>`
  }

  /**
   * Converts rich text json object to HTML
   * @param richJson
   * @return {string}
   */
  const convertBlocksToHtml = (richJson: RichTextJson): string =>
    richJson
      .map(block => contentToString(applyAttributes(block)))
      .join(config.spaceBetween ? ' ' : '')

  return {
    convert: convertBlocksToHtml,
  }
}
