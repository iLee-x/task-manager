declare module 'react-simple-maps' {
  import type { ReactNode, CSSProperties, MouseEventHandler } from 'react'

  interface ProjectionConfig {
    scale?: number
    center?: [number, number]
    rotate?: [number, number, number]
    parallels?: [number, number]
  }

  interface ComposableMapProps {
    projection?: string
    projectionConfig?: ProjectionConfig
    width?: number
    height?: number
    style?: CSSProperties
    className?: string
    children?: ReactNode
  }

  interface GeographyFeature {
    rsmKey: string
    id: string | number
    properties: Record<string, unknown>
    [key: string]: unknown
  }

  interface GeographiesChildrenProps {
    geographies: GeographyFeature[]
  }

  interface GeographiesProps {
    geography: string | object
    children: (props: GeographiesChildrenProps) => ReactNode
  }

  interface GeographyStyle {
    fill?: string
    stroke?: string
    strokeWidth?: number
    outline?: string
    cursor?: string
  }

  interface GeographyProps {
    geography: GeographyFeature
    fill?: string
    stroke?: string
    strokeWidth?: number
    style?: {
      default?: GeographyStyle
      hover?: GeographyStyle
      pressed?: GeographyStyle
    }
    className?: string
    onMouseEnter?: MouseEventHandler<SVGPathElement>
    onMouseLeave?: MouseEventHandler<SVGPathElement>
    onClick?: MouseEventHandler<SVGPathElement>
  }

  interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
    onMouseEnter?: MouseEventHandler<SVGGElement>
    onMouseLeave?: MouseEventHandler<SVGGElement>
    onClick?: MouseEventHandler<SVGGElement>
    style?: CSSProperties
    className?: string
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element
  export function Geographies(props: GeographiesProps): JSX.Element
  export function Geography(props: GeographyProps): JSX.Element
  export function Marker(props: MarkerProps): JSX.Element
  export function ZoomableGroup(props: { center?: [number, number]; zoom?: number; children?: ReactNode }): JSX.Element
  export function Sphere(props: { fill?: string; stroke?: string; strokeWidth?: number }): JSX.Element
  export function Graticule(props: { stroke?: string; strokeWidth?: number }): JSX.Element
}
