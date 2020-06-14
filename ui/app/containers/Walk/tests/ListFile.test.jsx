/* global describe, expect, test */
import React from 'react';
import { render } from 'react-testing-library';

import ListFile from '../ListFile';

describe('<ListFile />', () => {
  test('should render a folder', () => {
    const path = 'testPath';
    const { container } = render(<ListFile item={{ mediumType: 'folder', path }} />);
    expect(container.querySelector('a').href).toEqual(`http://localhost/?path=${path}`);
  });

  test('should avoid an image', () => {
    const { container } = render(<ListFile item={{ mediumType: 'image', ext: 'JPEG' }} />);
    expect(container.querySelector('li')).toEqual(null);
  });
});
