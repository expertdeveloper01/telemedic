/**
 * This is HomePage
 */

import React from "react";

const Home = () => {
  return (
    <div>
      <div className="page-section pb-0">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 py-3 wow fadeInUp">
              <h1>
                Welcome to &nbsp;
                <span style={{ color: "#007bff" }}>
                  Consult <br /> Medic <br />
                </span>
              </h1>
              <p className="text-grey mb-4">
                The pain itself is a lot of pain, it has been sadipscing over
                the years, but it is time to envy the pain and the pain is
                exciting, it was exciting, but it was complicated. But they also
                subsidized both the terminal and the just two pains. The system
                itself is accusing them of it, and no one who discovers it
                further rejects it from the hard work and the consequences. I'll
                explain, to catch the accusers! Pleasures are like an easy
                choice!
              </p>
            </div>
            <div className="col-lg-6 wow fadeInRight" data-wow-delay="400ms">
              <div className="img-place custom-img-1">
                <img src="static/img/bg-doctor.png" alt="" width="600%" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
