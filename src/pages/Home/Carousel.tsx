import {RootState} from '@/models/index';
import {ICarousel} from '@/models/home';
import {hp, viewportWidth, wp} from '@/utils/index';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import SnapCarousel, {
  AdditionalParallaxProps,
  Pagination,
  ParallaxImage,
} from 'react-native-snap-carousel';
import {connect, ConnectedProps} from 'react-redux';

// const data = [
//   'https://img03.sogoucdn.com/app/a/07/f13b5c3830f02b6db698a2ae43ff6a67',
//   'https://img01.sogoucdn.com/app/a/07/57d9e1c69332c8da692c3ec5c0e1466b',
// ];
const sliderWidth = viewportWidth;
const imageWidth = wp(90);
export const sideHeight = hp(26);
const itemWidth = imageWidth + wp(2) * 2;

// parallaxProps?: AdditionalParallaxProps,

const mapStateToProps = ({home}: RootState) => ({
  data: home.carousels,
  activeCarouselIndex: home.activeCarouselIndex,
});

const connector = connect(mapStateToProps);

type ModelState = ConnectedProps<typeof connector>;

interface IProps extends ModelState {}

class Carousel extends React.Component<IProps> {
  onSnapToItem = (index: number) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'home/setState',
      payload: {
        activeCarouselIndex: index,
      },
    });
  };

  renderItem = (
    {item}: {item: ICarousel},
    parallaxProps?: AdditionalParallaxProps,
  ) => {
    // return <Image source={{uri: item}} style={styles.image} />;
    return (
      <ParallaxImage
        source={{uri: item.image}}
        style={styles.image}
        containerStyle={styles.imageContainer}
        parallaxFactor={0.8}
        showSpinner
        spinnerColor="rgba(0,0,0,0.25)"
        {...parallaxProps}
      />
    );
  };

  get pagination() {
    const {data, activeCarouselIndex} = this.props;
    return (
      <View style={styles.paginationWrapper}>
        <Pagination
          containerStyle={styles.paginationContainer}
          dotContainerStyle={styles.dotContainer}
          dotStyle={styles.dot}
          activeDotIndex={activeCarouselIndex}
          dotsLength={data.length}
          inactiveDotScale={0.8}
          inactiveDotOpacity={0.4}
        />
      </View>
    );
  }

  render() {
    console.log(12);
    const {data} = this.props;
    return (
      <View>
        <SnapCarousel
          data={data}
          renderItem={this.renderItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages
          onSnapToItem={this.onSnapToItem}
          loop
          autoplay
        />
        {this.pagination}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    width: itemWidth,
    height: sideHeight,
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  paginationWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationContainer: {
    position: 'absolute',
    top: -20,
    paddingHorizontal: 3,
    paddingVertical: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
  },
  dotContainer: {
    marginHorizontal: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
});

export default connector(Carousel);
