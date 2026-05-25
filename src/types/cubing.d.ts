import "react/jsx-runtime";

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      "twisty-player": any;
    }
  }
}
