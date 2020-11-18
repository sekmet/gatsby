import React, { ElementType, FunctionComponent, CSSProperties } from "react"
import { GatsbyImageProps, ISharpGatsbyImageData } from "./gatsby-image.browser"
import { getWrapperProps, getMainProps, getPlaceholderProps } from "./hooks"
import { Placeholder } from "./placeholder"
import { MainImage, MainImageProps } from "./main-image"
import { LayoutWrapper } from "./layout-wrapper"

const removeNewLines = (str: string): string => str.replace(/\n/g, ``)

export const GatsbyImageHydrator: FunctionComponent<{
  as?: ElementType
  style?: CSSProperties
  className?: string
}> = function GatsbyImageHydrator({ as: Type = `div`, children, ...props }) {
  return <Type {...props}>{children}</Type>
}

export const GatsbyImage: FunctionComponent<GatsbyImageProps> = function GatsbyImage({
  as,
  className,
  style,
  image,
  loading = `lazy`,
  ...props
}) {
  if (!image) {
    console.warn(`[gatsby-plugin-image] Missing image prop`)
    return null
  }

  const {
    width,
    height,
    layout,
    images,
    placeholder,
    sizes,
    backgroundColor,
  } = image

  const { style: wStyle, className: wClass, ...wrapperProps } = getWrapperProps(
    width,
    height,
    layout
  )

  const cleanedImages: ISharpGatsbyImageData["images"] = {
    fallback: undefined,
    sources: [],
  }
  if (images.fallback) {
    cleanedImages.fallback = {
      src: images.fallback.src,
      srcSet: images.fallback.srcSet
        ? removeNewLines(images.fallback.srcSet)
        : undefined,
    }
  }

  if (images.sources) {
    cleanedImages.sources = images.sources.map(source => {
      return {
        ...source,
        srcSet: removeNewLines(source.srcSet),
      }
    })
  }

  return (
    <GatsbyImageHydrator
      {...wrapperProps}
      as={as}
      style={{
        ...wStyle,
        ...style,
      }}
      className={`${wClass}${className ? ` ${className}` : ``}`}
    >
      <LayoutWrapper layout={layout} width={width} height={height}>
        <Placeholder
          {...getPlaceholderProps(
            placeholder,
            false,
            layout,
            width,
            height,
            backgroundColor
          )}
        />

        <MainImage
          data-gatsby-image-ssr=""
          sizes={sizes}
          {...(props as Omit<MainImageProps, "images" | "fallback">)}
          // When eager is set we want to start the isLoading state on true (we want to load the img without react)
          {...getMainProps(loading === `eager`, false, cleanedImages, loading)}
        />
      </LayoutWrapper>
    </GatsbyImageHydrator>
  )
}
