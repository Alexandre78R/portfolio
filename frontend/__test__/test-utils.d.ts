declare module 'test-utils' {
  export * from '@testing-library/react';
  import { ReactElement } from 'react';
  import { RenderOptions } from '@testing-library/react';
  import { MockedResponse } from '@apollo/client/testing';
  
  interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
    mocks?: MockedResponse[];
  }
  
  export function render(
    ui: ReactElement,
    options?: CustomRenderOptions
  ): ReturnType<typeof import('@testing-library/react').render>;
}
