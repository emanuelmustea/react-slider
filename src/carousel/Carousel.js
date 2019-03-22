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
    const { transitionDuration } = this.props;
    const sliderProps = {
      style: {
        left: this.state.leftPosition,
        transitionProperty: 'left',
        transitionDuration: this.state.isAnimating ? `${transitionDuration}ms` : '0ms'
      },
      className: 'slider'
    };
    const imgs = this.cloneImages(this.props.imgs);
    return (
      <div className="carousel" ref={ref => (this.carouselElement = ref)}>
        <div {...sliderProps}>
          {imgs.map((src, i) => (
            <img src={src} key={i} />
          ))}
        </div>
        <Button isSliding={this.state.isSliding} className="prev" onClick={() => this.changePhoto(false)} />
        <Button isSliding={this.state.isSliding} className="next" onClick={() => this.changePhoto(true)} />
      </div>
    );
  }
  cloneImages(imgs) {
    const imagesList = [...imgs];
    imagesList.unshift(imgs[imgs.length - 1]);
    imagesList.push(imgs[0]);
    return imagesList;
  }
  enableButtons() {
    const { transitionDuration } = this.props;
    setTimeout(() => {
      this.setState({
        isSliding: false
      });
    }, transitionDuration);
  }
  disableButtons() {
    this.setState({
      isSliding: true
    });
    this.enableButtons();
  }
  calculateSliderLeftPosition(state) {
    return -1 * state.currentImageIndex * this.carouselContainerWidth;
  }
  moveSliderContainer(animate = true) {
    const { transitionDuration } = this.props;
    if (animate) {
      setTimeout(() => {
        this.setState({ isAnimating: false });
      }, transitionDuration);
    }
    this.setState(oldState => ({ leftPosition: this.calculateSliderLeftPosition(oldState), isAnimating: animate }));
  }
  isTheLastImage(goingToNextPhoto) {
    const imagesCount = this.props.imgs.length;
    if (goingToNextPhoto && this.state.currentImageIndex >= imagesCount) {
      return true;
    } else if (!goingToNextPhoto && this.state.currentImageIndex <= 1) {
      return true;
    }
    return false;
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
    this.disableButtons();
    this.moveSliderContainer();
  }
}
