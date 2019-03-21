import React, { Component } from 'react';
import './Carousel.css';
import Button from './Button';

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = { isSliding: false, isAnimating: false, leftPosition: 0, currentImageIndex: 1 };
    this.changePhoto = this.changePhoto.bind(this);
  }
  componentDidMount() {
    this.carouselContainerWidth = this.carouselElement.offsetWidth;
    this.setState({ leftPosition: -1 * this.carouselContainerWidth });
  }
  render() {
    let { imgs } = this.props;
    imgs = this.cloneImages(imgs);
    return (
      <div className="carousel" ref={ref => (this.carouselElement = ref)}>
        {this.renderSliderElement(imgs)}
        <Button isSliding={this.state.isSliding} className="prev" onClick={() => this.changePhoto(false)} />
        <Button isSliding={this.state.isSliding} className="next" onClick={() => this.changePhoto(true)} />
      </div>
    );
  }
  renderSliderElement(imgs) {
    const { transitionDuration } = this.props;
    const sliderProps = {
      style: {
        left: this.state.leftPosition,
        transitionProperty: 'left',
        transitionDuration: this.state.isAnimating ? `${transitionDuration}ms` : '0ms'
      },
      className: 'slider'
    };
    return (
      <div {...sliderProps}>
        {imgs.map((src, i) => (
          <img src={src} key={i} />
        ))}
      </div>
    );
  }
  cloneImages(imgs) {
    return [imgs[imgs.length - 1], ...imgs, imgs[0]];
  }
  disableSliding() {
    const { transitionDuration } = this.props;
    setTimeout(() => {
      this.setState({
        isSliding: false
      });
    }, transitionDuration);
  }
  enableSliding() {
    this.setState({
      isSliding: true
    });
    this.disableSliding();
  }
  moveSliderContainer(animate = true) {
    const { transitionDuration } = this.props;
    if (animate) {
      this.setState({ isAnimating: animate });
      setTimeout(() => {
        this.setState({ isAnimating: false });
      }, transitionDuration);
    }
    this.setState(oldState => ({ leftPosition: -1 * oldState.currentImageIndex * this.carouselContainerWidth }));
  }
  isTheLastImage(leftDirection) {
    const imagesCount = this.props.imgs.length;
    const rightDirection = !leftDirection;
    return (this.state.currentImageIndex >= imagesCount && leftDirection) || (this.state.currentImageIndex <= 1 && rightDirection);
  }

  changePhoto(changeToNext = true) {
    const imagesCount = this.props.imgs.length;
    const { transitionDuration } = this.props;
    if (this.state.isSliding) {
      return;
    }
    this.setState(prevState => ({ currentImageIndex: changeToNext ? prevState.currentImageIndex + 1 : prevState.currentImageIndex - 1 }));
    if (this.isTheLastImage(changeToNext)) {
      setTimeout(() => {
        this.setState({ currentImageIndex: changeToNext ? 1 : imagesCount });
        this.moveSliderContainer(false);
      }, transitionDuration);
    }
    this.moveSliderContainer();
    this.enableSliding();
  }
}
