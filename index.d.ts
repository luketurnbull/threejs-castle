declare global {
  namespace JSX {
    interface IntrinsicElements {
      grassMaterial: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        map?: any;
        alphaMap?: any;
        toneMapped?: boolean;
        transparent?: boolean;
        side?: any;
        bladeHeight?: number;
        brightness?: number;
      };
    }
  }
}
