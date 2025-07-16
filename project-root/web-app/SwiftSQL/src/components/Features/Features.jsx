import * as React from "react";
import "./Features.css";
import { Link } from "react-router-dom";

function Features() {
  return (
    <>
      <header className="header">
        <div className="header__content">
          <div className="header__brand">
            <span className="header__title">SwiftSQL</span>
          </div>
          <nav className="header__nav">
              <Link to="/" className="nav-link">Home</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          
          <div className="hero__content">
            <h1 className="hero__title">Explore Our Features</h1>
            <p className="hero__description">
              Choose from the powerful tools we offer to simplify your database
              management needs.
            </p>

            <div className="features">
              <div className="features__grid">
                <div className="feature-wrapper">
                  <article className="feature-card">
                    <div className="feature-card__content">
                      <h2 className="feature-card__title">NLP to SQL</h2>
                      <p className="feature-card__description">
                        Transform natural language into SQL queries with ease.
                      </p>
                      <button className="feature-card__button">
                        <Link to="/NTS">Explore</Link>
                      </button>
                    </div>
                  </article>
                </div>

                <div className="feature-wrapper">
                 
                  <article className="feature-card">
                    <div className="feature-card__content">
                      <h2 className="feature-card__title">ER to Dataset</h2>
                      <p className="feature-card__description">
                        Visualize and convert ER diagrams into datasets
                        effortlessly.
                      </p>
                      <button className="feature-card__button">
                        <Link to="/ETD">Coming Soon...</Link>
                      </button>
                    </div>
                  </article>
                </div>

                <div className="feature-wrapper">
                  <article className="feature-card">
                    <div className="feature-card__content">
                      <h2 className="feature-card__title">
                        Database Management
                      </h2>
                      <p className="feature-card__description">
                        Comprehensive tools for managing and optimizing your
                        databases.
                      </p>
                      <button className="feature-card__button">
                        <Link to="/sql">Explore</Link>
                      </button>
                    </div>
                  </article>
                </div>
              </div>
            </div>  
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="footer__copyright">© 2023 Swift SQL. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Features;
