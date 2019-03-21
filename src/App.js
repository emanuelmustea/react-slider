import React, { Component } from 'react';
import Carousel from './carousel/Carousel';
import './App.css';
import img1 from '../public/imgs/1.jpeg';
import img2 from '../public/imgs/2.jpeg';
import img3 from '../public/imgs/3.jpeg';
import img4 from '../public/imgs/4.jpeg';
import img5 from '../public/imgs/5.jpeg';
import img6 from '../public/imgs/6.jpeg';
import img7 from '../public/imgs/7.jpeg';

export default class App extends Component {
  render() {
    return <Carousel imgs={[img1, img2, img3, img4, img5, img6, img7]} transitionDuration={1000} />;
  }
}
