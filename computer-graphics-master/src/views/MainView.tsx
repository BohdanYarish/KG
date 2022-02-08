import React from "react";

import fractalsCardImage from '../assets/images/fractals-card-image.jpg';
import colorsCardImage from '../assets/images/colors-card-image.jpg';
import affineCardImage from '../assets/images/affine-card-image.jpg';
import referenceCardImage from '../assets/images/reference-card-image.jpg';


import {MDBBtn, MDBCard, MDBCardBody, MDBCardGroup, MDBCardImage, MDBCardText, MDBCardTitle, MDBLink} from "mdbreact";

const MainView: React.FC = () => {
  return (
    <section className="m-5">
      <h1 className="text-center">Computer Graphics</h1>

      <MDBCardGroup className="mt-5 col-8 offset-2">
        <MDBCard className="mx-4" style={{width: "25rem"}}>
          <MDBCardImage className="img-fluid" src={fractalsCardImage} waves/>
          <MDBCardBody>
            <MDBCardTitle>Newton Fractals</MDBCardTitle>
            <MDBCardText>
                The Newton fractal is a boundary set in the complex plane which is characterized by Newton's method
                applied to a fixed polynomial or transcendental function.
            </MDBCardText>
            <MDBLink to="/fractals">
              <MDBBtn color="elegant" block>Go</MDBBtn>
            </MDBLink>
          </MDBCardBody>
        </MDBCard>

        <MDBCard className="mx-4" style={{width: "25rem"}}>
          <MDBCardImage className="img-fluid" src={colorsCardImage} waves/>
          <MDBCardBody>
            <MDBCardTitle>Colors Schemes</MDBCardTitle>
            <MDBCardText>
                The RGB color model is an additive color model in which red, green, and blue light are added together
                in various ways to reproduce a broad array of colors. 
            </MDBCardText>
            <MDBLink to="/colors">
              <MDBBtn color="elegant" block>Go</MDBBtn>
            </MDBLink>
          </MDBCardBody>
        </MDBCard>
      </MDBCardGroup>

      <MDBCardGroup className="mt-5 col-8 offset-2">
        <MDBCard className="mx-4" style={{width: "25rem"}}>
          <MDBCardImage className="img-fluid" src={affineCardImage} waves/>
          <MDBCardBody>
            <MDBCardTitle>Affine transformation</MDBCardTitle>
            <MDBCardText>
                In Euclidean geometry, an affine transformation, or an affinity (from the Latin, affinis, "connected
                with"), is a geometric transformation that preserves lines and parallelism (but not necessarily
                distances and angles).
            </MDBCardText>
            <MDBLink to="/affine-transformations">
              <MDBBtn color="elegant" block>Go</MDBBtn>
            </MDBLink>
          </MDBCardBody>
        </MDBCard>

        <MDBCard className="mx-4" style={{width: "25rem"}}>
          <MDBCardImage className="img-fluid" src={referenceCardImage} waves/>
          <MDBCardBody>
            <MDBCardTitle>Reference</MDBCardTitle>
            <MDBCardText>
              Here you can find some general descriptions of this difficalt to understanding features, given by this syte.
              So if you find something hard to understand, don`t worry and go here to improve your knowledge :)
            </MDBCardText>
            <MDBLink to="/reference">
              <MDBBtn color="elegant" block>Go</MDBBtn>
            </MDBLink>
          </MDBCardBody>
        </MDBCard>
      </MDBCardGroup>
    </section>
  );
}

export default MainView;