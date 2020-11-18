import React from "react"
import { render, screen } from "@testing-library/react"
import { GatsbyImage } from "../gatsby-image.server"
import { ISharpGatsbyImageData } from "../gatsby-image.browser"
import { SourceProps } from "../picture"

type GlobalOverride = NodeJS.Global &
  typeof global.globalThis & {
    SERVER: boolean
    GATSBY___IMAGE: boolean
  }

// Prevents terser for bailing because we're not in a babel plugin
jest.mock(`../../../macros/terser.macro`, () => (strs): string => strs.join(``))

describe(`GatsbyImage server`, () => {
  beforeEach(() => {
    console.warn = jest.fn()
    ;(global as GlobalOverride).SERVER = true
    ;(global as GlobalOverride).GATSBY___IMAGE = true
  })

  afterEach(() => {
    jest.clearAllMocks()
    ;(global as GlobalOverride).SERVER = undefined
    ;(global as GlobalOverride).GATSBY___IMAGE = undefined
  })

  it(`shows nothing when the image props is not passed`, () => {
    // Allows to get rid of typescript error when not passing image
    // This is helpful for user using JavaScript and not getting advent of
    // TS types
    const GatsbyImageAny = GatsbyImage as React.FC
    const { container } = render(<GatsbyImageAny />)

    // Verifying implementation details but it's for the UX, acceptable tradeoffs
    expect(console.warn).toBeCalledWith(
      `[gatsby-plugin-image] Missing image prop`
    )
    expect(container.firstChild).toBeNull()
  })

  describe(`style verifications`, () => {
    it(`has a valid style attributes for fluid layout`, () => {
      const layout = `fluid`

      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout,
        images: { sources: [] },
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )

      const wrapper = document.querySelector(`[data-gatsby-image-wrapper=""]`)
      expect((wrapper as HTMLElement).style).toMatchInlineSnapshot(`
        CSSStyleDeclaration {
          "0": "position",
          "_importants": Object {
            "position": undefined,
          },
          "_length": 1,
          "_onChange": [Function],
          "_values": Object {
            "position": "relative",
          },
        }
      `)
    })

    it(`has a valid style attributes for fixed layout`, () => {
      const layout = `fixed`

      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout,
        images: { sources: [] },
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )

      const wrapper = document.querySelector(`[data-gatsby-image-wrapper=""]`)
      expect((wrapper as HTMLElement).style).toMatchInlineSnapshot(`
        CSSStyleDeclaration {
          "0": "position",
          "1": "width",
          "2": "height",
          "_importants": Object {
            "height": undefined,
            "position": undefined,
            "width": undefined,
          },
          "_length": 3,
          "_onChange": [Function],
          "_values": Object {
            "height": "100px",
            "position": "relative",
            "width": "100px",
          },
        }
      `)
    })

    it(`has a valid style attributes for constrained layout`, () => {
      const layout = `constrained`

      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout,
        images: { sources: [] },
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )

      const wrapper = document.querySelector(`[data-gatsby-image-wrapper=""]`)
      expect((wrapper as HTMLElement).style).toMatchInlineSnapshot(`
        CSSStyleDeclaration {
          "0": "position",
          "1": "display",
          "_importants": Object {
            "display": undefined,
            "position": undefined,
          },
          "_length": 2,
          "_onChange": [Function],
          "_values": Object {
            "display": "inline-block",
            "position": "relative",
          },
        }
      `)
    })
  })

  describe(`fallback verifications`, () => {
    it(`doesn't have an src or srcSet when fallback is not provided in images`, () => {
      // no fallback provided
      const images = {}

      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout: `constrained`,
        images,
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )

      const img = screen.getByRole(`img`)
      expect(img).toMatchInlineSnapshot(`
        <img
          alt="A fake image for testing purpose"
          data-gatsby-image-ssr=""
          data-main-image=""
          decoding="async"
          loading="lazy"
          sizes="192x192"
          style="opacity: 0;"
        />
      `)
    })

    it(`has a valid src value when fallback is provided in images`, () => {
      const images = { fallback: { src: `some-src-fallback.jpg` } }

      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout: `constrained`,
        images,
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )

      const img = screen.getByRole(`img`)
      expect(img).toMatchInlineSnapshot(`
        <img
          alt="A fake image for testing purpose"
          data-gatsby-image-ssr=""
          data-main-image=""
          data-src="some-src-fallback.jpg"
          decoding="async"
          loading="lazy"
          sizes="192x192"
          style="opacity: 0;"
        />
      `)
    })

    it(`has a valid srcSet value when provided in the fallback prop of images`, () => {
      const images = {
        fallback: {
          src: `some-src-fallback.jpg`,
          srcSet: `icon32px.png 32w,
icon64px.png 64w,
icon-retina.png 2x,
icon-ultra.png 3x,
icon.svg`,
        },
      }

      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout: `constrained`,
        images,
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )

      const img = screen.getByRole(`img`)
      expect(img).toMatchInlineSnapshot(`
        <img
          alt="A fake image for testing purpose"
          data-gatsby-image-ssr=""
          data-main-image=""
          data-src="some-src-fallback.jpg"
          data-srcset="icon32px.png 32w,icon64px.png 64w,icon-retina.png 2x,icon-ultra.png 3x,icon.svg"
          decoding="async"
          loading="lazy"
          sizes="192x192"
          style="opacity: 0;"
        />
      `)
    })
  })

  describe(`sources verifications`, () => {
    it(`doesn't have an src or srcSet when sources is not provided in images`, () => {
      // no fallback provided
      const images = {}

      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout: `constrained`,
        images,
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )

      const img = screen.getByRole(`img`)
      expect(img).toMatchInlineSnapshot(`
        <img
          alt="A fake image for testing purpose"
          data-gatsby-image-ssr=""
          data-main-image=""
          decoding="async"
          loading="lazy"
          sizes="192x192"
          style="opacity: 0;"
        />
      `)
    })

    it(`has valid sizes and srcSet when provided in the images`, () => {
      const sources: Array<SourceProps> = [
        {
          media: `some-media`,
          sizes: `192x192,56x56`,
          srcSet: `icon32px.png 32w,
icon64px.png 64w,
icon-retina.png 2x,
icon-ultra.png 3x,
icon.svg`,
        },
      ]

      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout: `constrained`,
        images: { sources },
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      const { container } = render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )

      const picture = container.querySelector(`picture`)

      expect(picture).toMatchInlineSnapshot(`
        <picture>
          <source
            media="some-media"
            srcset="icon32px.png 32w,icon64px.png 64w,icon-retina.png 2x,icon-ultra.png 3x,icon.svg"
          />
          <img
            alt="A fake image for testing purpose"
            data-gatsby-image-ssr=""
            data-main-image=""
            decoding="async"
            loading="lazy"
            sizes="192x192"
            style="opacity: 0;"
          />
        </picture>
      `)
    })
  })

  describe(`placeholder verifications`, () => {
    it(`has a placeholder in a div with valid styles for fluid layout`, () => {
      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout: `fluid`,
        images: {},
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      const { container } = render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )
      const placeholder = container.querySelector(`[data-placeholder-image=""]`)

      expect(placeholder).toMatchInlineSnapshot(`
        <div
          aria-hidden="true"
          data-placeholder-image=""
          sources=""
          style="opacity: 1; transition: opacity 500ms linear; background-color: red; position: relative;"
        />
      `)
    })

    it(`has a placeholder in a div with valid styles for fixed layout`, () => {
      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout: `fixed`,
        images: {},
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      const { container } = render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )
      const placeholder = container.querySelector(`[data-placeholder-image=""]`)

      expect(placeholder).toMatchInlineSnapshot(`
        <div
          aria-hidden="true"
          data-placeholder-image=""
          sources=""
          style="opacity: 1; transition: opacity 500ms linear; width: 100px; height: 100px; background-color: red; position: relative;"
        />
      `)
    })

    it(`has a placeholder in a div with valid styles for constrained layout`, () => {
      const image: ISharpGatsbyImageData = {
        width: 100,
        height: 100,
        layout: `constrained`,
        images: {},
        placeholder: { sources: [] },
        sizes: `192x192`,
        backgroundColor: `red`,
      }

      const { container } = render(
        <GatsbyImage image={image} alt="A fake image for testing purpose" />
      )
      const placeholder = container.querySelector(`[data-placeholder-image=""]`)

      expect(placeholder).toMatchInlineSnapshot(`
        <div
          aria-hidden="true"
          data-placeholder-image=""
          sources=""
          style="opacity: 1; transition: opacity 500ms linear; display: inline-block; background-color: red; position: relative;"
        />
      `)
    })
  })
})
