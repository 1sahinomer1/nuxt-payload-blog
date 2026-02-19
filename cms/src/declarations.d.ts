declare module '*.css'
declare module '*.scss'
declare module '*.js' {
  const value: Record<string, unknown>
  export const importMap: Record<string, unknown>
  export default value
}
