import React, { Component } from 'react';
import './Carousel.css';

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.currentImageIndex = 1;
    this.transitionDuration = this.props.transitionDuration;
    this.imagesCount = this.props.imgs.length;
    this.state = { isSliding: false, isAnimating: false, leftPosition: 0 };
    this.changePhoto = this.changePhoto.bind(this);
  }
  /* */
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
        {this.renderButtons('prev', () => this.changePhoto(false))}
        {this.renderButtons('next', () => this.changePhoto(true))}
      </div>
    );
  }
  renderSliderElement(imgs) {
    const sliderProps = {
      style: {
        left: this.state.leftPosition,
        transitionProperty: 'left',
        transitionDuration: this.state.isAnimating ? `${this.transitionDuration}ms` : '0ms'
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
  renderButtons(className, clickFunctionReference) {
    const props = {
      className: `${className} ${this.state.isSliding ? ' disabled' : ''}`,
      onClick: clickFunctionReference
    };
    return <div {...props} />;
  }
  cloneImages(imgs) {
    return [imgs[imgs.length - 1], ...imgs, imgs[0]];
  }
  disableSliding() {
    setTimeout(() => {
      this.setState({
        isSliding: false
      });
    }, this.transitionDuration);
  }
  enableSliding() {
    this.setState({
      isSliding: true
    });
    this.disableSliding();
  }
  moveSliderContainer(animate = true) {
    if (animate) {
      this.setState({ isAnimating: animate });
      setTimeout(() => {
        this.setState({ isAnimating: false });
      }, this.transitionDuration);
    }
    this.setState({ leftPosition: -1 * this.currentImageIndex * this.carouselContainerWidth });
  }
  isTheLastImage(leftDirection) {
    const rightDirection = !leftDirection;
    return (this.currentImageIndex > this.imagesCount && leftDirection) || (this.currentImageIndex < 1 && rightDirection);
  }
  changePhoto(changeToNext = true) {
    if (this.state.isSliding) {
      return;
    }
    this.currentImageIndex += changeToNext ? 1 : -1;
    if (this.isTheLastImage(changeToNext)) {
      setTimeout(() => {
        this.currentImageIndex = changeToNext ? 1 : this.imagesCount;
        this.moveSliderContainer(false);
      }, this.transitionDuration);
    }
    this.moveSliderContainer();
    this.enableSliding();
  }
}
