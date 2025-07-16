// Global type definitions for packages without TypeScript support

declare module "diff-match-patch" {
  export default class DiffMatchPatch {
    constructor()
    diff_main(text1: string, text2: string): Array<[number, string]>
    diff_cleanupSemantic(diffs: Array<[number, string]>): void
    patch_make(text1: string, diffs: Array<[number, string]>): any[]
    patch_apply(patches: any[], text: string): [string, boolean[]]
  }
}

// Add other type declarations as needed
declare module "*.svg" {
  const content: any
  export default content
}

declare module "*.png" {
  const content: any
  export default content
}

declare module "*.jpg" {
  const content: any
  export default content
}
