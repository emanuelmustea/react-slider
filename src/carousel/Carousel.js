import React, { Component } from 'react';
import './Carousel.css';

export default class Carousel extends Component {
  constructor(props) {
    super(props);
    this.state = { isSliding: false, isAnimating: false, leftPosition: 0, currentImageIndex: 1 };
    this.prevPhoto = this.prevPhoto.bind(this);
    this.nextPhoto = this.nextPhoto.bind(this);
    this.imgs = this.cloneImages(this.props.imgs);
  }
  componentDidMount() {
    const carouselContainerWidth = this.carouselElement.offsetWidth;
    const initialLeftPosition = -1 * carouselContainerWidth;
    this.setState({ leftPosition: initialLeftPosition });
  }
  cloneImages(imgs) {
    const firstImage = imgs[0];
    const lastImage = imgs[imgs.length - 1];
    return [lastImage, ...imgs, firstImage];
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
    const carouselContainerWidth = this.carouselElement.offsetWidth;
    return -1 * state.currentImageIndex * carouselContainerWidth;
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
  isTheLastImage(direction) {
    const imagesCount = this.props.imgs.length;
    if (direction === 'next' && this.state.currentImageIndex >= imagesCount) {
      return true;
    } else if (direction === 'prev' && this.state.currentImageIndex <= 1) {
      return true;
    }
    return false;
  }

  changeImageIndex(direction = 'next') {
    if (this.state.isSliding) {
      return;
    }
    const imagesCount = this.props.imgs.length;
    const currentImageIndex = direction === 'next' ? this.state.currentImageIndex + 1 : this.state.currentImageIndex - 1;
    const { transitionDuration } = this.props;

    this.setState({ currentImageIndex });

    if (this.isTheLastImage(direction)) {
      setTimeout(() => {
        this.setState({ currentImageIndex: direction === 'prev' ? 1 : imagesCount });
        this.moveSliderContainer(false);
      }, transitionDuration);
    }

    this.disableButtons();
    this.moveSliderContainer();
  }
  nextPhoto() {
    this.changeImageIndex('next');
  }
  prevPhoto() {
    this.changeImageIndex('prev');
  }
  render() {
    const { transitionDuration } = this.props;
    const sliderTransition = this.state.isAnimating ? `${transitionDuration}ms` : '0ms';
    const imgsElements = this.imgs.map((src, i) => <img src={src} key={i} />);
    const disabledClass = this.state.isSliding ? 'disabled' : '';
    return (
      <div className="carousel" ref={ref => (this.carouselElement = ref)}>
        <div className="slider" style={{ left: this.state.leftPosition, transitionDuration: sliderTransition }}>
          {imgsElements}
        </div>
        <button className={[`prev ${disabledClass}`]} onClick={this.prevPhoto} />
        <button className={[`next ${disabledClass}`]} onClick={this.nextPhoto} />
      </div>
    );
  }
}
