type ComponentType = import('react').ComponentType
type ExampleItem = {
  title: string
  component: ComponentType
}


declare module "*?raw" {
  const content: string;
  export default content;
}