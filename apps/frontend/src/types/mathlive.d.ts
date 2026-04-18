/* eslint-disable @typescript-eslint/no-empty-object-type */
import 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'smart-mode'?: boolean;
          'default-mode'?: string;
          placeholder?: string;
          'read-only'?: boolean;
        },
        HTMLElement
      >;
    }
  }
}
