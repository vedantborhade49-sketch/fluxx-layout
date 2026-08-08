import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        center?: string;
        heading?: number | string;
        tilt?: number | string;
        range?: number | string;
        mode?: string;
        ref?: any;
      };
      'gmp-marker-3d': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        position?: string;
        altitude?: number | string;
        'altitude-mode'?: string;
        label?: string;
        ref?: any;
      };
      'gmp-polyline-3d': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        coordinates?: string;
        'stroke-color'?: string;
        'stroke-width'?: number | string;
        'altitude-mode'?: string;
      };
      'gmp-polygon-3d': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        coordinates?: string;
        'fill-color'?: string;
        'stroke-color'?: string;
        'altitude-mode'?: string;
      };
      'gmp-model-3d': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        position?: string;
        'altitude-mode'?: string;
        src?: string;
        scale?: number | string;
        orientation?: string;
        ref?: any;
      };
    }
  }
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-map-3d': any;
      'gmp-marker-3d': any;
      'gmp-polyline-3d': any;
      'gmp-polygon-3d': any;
      'gmp-model-3d': any;
    }
  }
}
