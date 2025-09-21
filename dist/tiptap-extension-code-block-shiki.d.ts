import { BundledLanguage } from 'shiki';
import { BundledTheme } from 'shiki';
import { CodeBlockOptions } from '@tiptap/extension-code-block';
import { Node as Node_2 } from '@tiptap/core';

declare const CodeBlockShiki: Node_2<CodeBlockShikiOptions, any>;
export { CodeBlockShiki }
export default CodeBlockShiki;

export declare interface CodeBlockShikiOptions extends CodeBlockOptions {
    defaultLanguage: BundledLanguage | null | undefined;
    defaultTheme: BundledTheme;
}

export { }
