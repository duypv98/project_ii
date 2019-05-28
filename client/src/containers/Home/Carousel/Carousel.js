import React, { Component } from 'react';
import { Carousel, CarouselCaption, CarouselInner, CarouselItem } from 'mdbreact';

export default class Event extends Component {
    render() {
        return (
            <div id="home-carousel" className="home-carousel">
                <Carousel
                    activeItem={1}
                    length={3}
                    showControls={true}
                    showIndicators={true}
                    className="z-depth-1">
                    <CarouselInner>
                        <CarouselItem itemId="1">
                            <img className="w-100"
                                src={require('./../../../assets/images/pikachu-banner.jpg')} alt="" />
                            <CarouselCaption>
                                <h1 className="h1-responsive capt">DETECTIVE PIKACHU 2019</h1>
                            </CarouselCaption>
                        </CarouselItem>
                        <CarouselItem itemId="2">
                            <img className="w-100"
                                src={require('./../../../assets/images/john-wick-3-banner.jpg')} alt="" />
                            <CarouselCaption>
                                <h1 className="h1-responsive capt">JOHN WICK 3: PARABELLUM</h1>
                            </CarouselCaption>
                        </CarouselItem>
                        <CarouselItem itemId="3">
                            <img className="w-100"
                                src={require('./../../../assets/images/doraemon-banner.jpg')} alt="" />
                            <CarouselCaption>
                                <h1 className="h1-responsive capt">DORAEMON: NOBITA'S CHRONICLE OF THE MOON EXPLORATION</h1>
                            </CarouselCaption>
                        </CarouselItem>
                    </CarouselInner>
                </Carousel>
            </div>
        );
    }
}