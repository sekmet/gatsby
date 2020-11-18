import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { TestWrapper } from "../../components/test-wrapper"
import Layout from "../../components/layout"

const Page = () => {
  return (
    <Layout>
      <h1>Fluid, maxWidth</h1>
      <TestWrapper style={{ display: `block` }}>
        <StaticImage
          src="../../images/cornwall.jpg"
          loading="eager"
          layout="fluid"
          maxWidth={1024}
          alt="cornwall"
        />
      </TestWrapper>
    </Layout>
  )
}

export default Page
