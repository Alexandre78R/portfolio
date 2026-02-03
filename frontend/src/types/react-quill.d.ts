declare module 'react-quill' {
  import { Component } from 'react';

  export interface ReactQuillProps {
    value?: string | { ops: any[] };
    defaultValue?: string | { ops: any[] };
    onChange?: (value: string, delta: any, source: string, editor: any) => void;
    onChangeSelection?: (selection: any, source: string, editor: any) => void;
    onFocus?: (selection: any, source: string, editor: any) => void;
    onBlur?: (previousSelection: any, source: string, editor: any) => void;
    placeholder?: string;
    readOnly?: boolean;
    modules?: Record<string, any>;
    formats?: string[];
    theme?: string;
    className?: string;
    style?: React.CSSProperties;
    preserveWhitespace?: boolean;
    tabIndex?: number;
    bounds?: string | Element;
    scrollingContainer?: string | Element | null;
    ref?: React.Ref<any>;
  }

  class ReactQuill extends Component<ReactQuillProps> {}

  export default ReactQuill;
}
