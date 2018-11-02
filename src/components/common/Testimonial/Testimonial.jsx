import React from 'react';
import './Testimonial.scss';

const Testimonial = ( data ) => {
  return (
    <div className="testimonial__container col-4">
      <div className="testimonial__card row">
        <div className="testimonial__image col-2">
          <img src={data.image} alt="image"/>
        </div>
        <div className="testimonial__text col-10">
          <p className="testimonial__title no-margin color--black-text"> {data.description} </p>
          <p className="testimonial__name no-margin color--blue"> {data.name} </p>
        </div>
      </div>
    </div>
  );
}

export default Testimonial;