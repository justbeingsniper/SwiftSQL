"use client";
import * as React from "react";
import "./full.css";
import { Link } from "react-router-dom";

function FigmaDesignLandingPng() {
  return (
    <>
      <div className="figmadesign-landingpng">
        <div className="root">
          <div className="groups">
            <div className="background">
              <div className="div">
                <div className="swift-sql">Swift SQL</div>
                <div className="button">
                  <div className="background-2">Go Pro</div>
                </div>
              </div>
              <div className="div-2" space={83}>
                <div className="div-3">
                  <div className="column">
                    <div className="groups-2">
                      <div className="background-3">
                        <div className="visualizeyourd">
                          Visualize your
                          <br />
                          database with
                        </div>
                        <div className="effortlesslycon">
                          Effortlessly convert natural language into SQL
                        </div>
                        <div className="button-2">
                          <div className="background-4"><Link to='/Login'>Get started </Link></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="column-2">
                    <img src="src\assets\Landing-Page1.png" className="img" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="groups-3">
            <div className="div-4">
              <img src="src\assets\Orange-Band.png" className="img-2" />
              <div className="div-5">
                <div className="empoweryourdat">
                  Empower your data analysis with Swift SQL's powerful features.
                </div>
              </div>
            </div>
          </div>
          <div className="groups">
            <div className="groups">
              <div className="div-7">
                <img src="src\assets\White-Band.png" className="img-4" />
                <div className="div-8">
                  <div className="swift-sql-2">Swift SQL</div>
                  <div className="simplify-sq-lque">
                    Simplify SQL queries and database management.
                  </div>
                  <div className="connectwithus">Connect with us:</div>
                  <div className="div-9">
                    <div className="div-10">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/351b4f2e27a8a83b4b5c95b600ca85dc96c284f5?placeholderIfAbsent=true&apiKey=d668726103e646e089e083dcb172c268"
                        className="img-7"
                      />
                    </div>
                    <div className="button-3">
                      <div className="background-5">in</div>
                    </div>
                  </div>
                </div>
                <div className="div-11">
                  <div className="div-12">
                    <div className="er-diagrams">ER Diagrams</div>
                    <div className="my-sql-clone">MySQL Clone</div>
                    <div className="database">Database</div>
                    <div className="enterprise">Enterprise</div>
                  </div>
                  <div className="div-13">
                    <div className="google-login">Google Login</div>
                    <div className="blueandwhite-f">
                      Blue and white
                      <br />
                      Feature
                    </div>
                  </div>
                  <div className="div-14">
                    <div className="minimalisti">Minimalisti</div>
                    <div className="orange">Orange</div>
                    <div className="career">Career</div>
                    <div className="latestnews">Latest news</div>
                  </div>
                  <div className="div-15">
                    <div className="explorefeatures">Explore features</div>
                    <div className="upgradeto">Upgrade to</div>
                    <div className="knowledge">Knowledge</div>
                    <div className="salesassistance">Sales assistance</div>
                  </div>
                  <div className="div-16">
                    <div className="compare">Compare</div>
                    <div className="joinour">Join our</div>
                    <div className="share">Share</div>
                    <div className="contactus">Contact us</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FigmaDesignLandingPng;
