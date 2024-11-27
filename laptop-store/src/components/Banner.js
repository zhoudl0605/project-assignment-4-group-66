import React from 'react';
import Slider from 'react-slick';


function Banner() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="banner">
            <Slider {...settings}>
                <div><img src="https://via.placeholder.com/1200x400" alt="Slide 1" /></div>
                <div><img src="https://via.placeholder.com/1200x400" alt="Slide 2" /></div>
                <div><img src="https://via.placeholder.com/1200x400" alt="Slide 3" /></div>
            </Slider>
        </div>
    );
}

export default Banner;
