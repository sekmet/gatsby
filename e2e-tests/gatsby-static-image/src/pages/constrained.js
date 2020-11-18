import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"

const FluidPage = () => (
  <Layout>
    <div data-testid="image-fluid">
      <StaticImage
        src="../images/citrus-fruits.jpg"
        layout="constrained"
        alt="Citrus fruits"
      />
    </div>
    <div data-testid="image-fluid-png">
      <StaticImage
        src="../images/gatsby-icon.png"
        layout="constrained"
        alt="Gatsby icon"
      />
    </div>
    <div data-testid="image-fluid-relative">
      <StaticImage
        src="../../content/relative.jpg"
        layout="constrained"
        alt="Citrus fruits"
      />
    </div>
    <div data-testid="invalid-image">
      <StaticImage src="./does-not-exist.jpg" layout="constrained" />
    </div>
  </Layout>
)

export default FluidPage
