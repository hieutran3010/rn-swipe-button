import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  TouchableNativeFeedback,
  View,
} from 'react-native';

// Styles
import styles, { borderWidth, margin } from './styles/SwipeThumb';

// Constants
import { TRANSPARENT_COLOR } from '../constants';
import { SwipeThumbProps } from './types';

const SwipeThumb = (props: SwipeThumbProps) => {
  const paddingAndMarginsOffset = borderWidth + 2 * margin;
  const defaultContainerWidth = props.iconSize;
  const maxWidth = props.layoutWidth - paddingAndMarginsOffset;

  const animatedWidth = useRef(new Animated.Value(defaultContainerWidth))
    .current;
  const [defaultWidth, setDefaultWidth] = useState(defaultContainerWidth);

  const [backgroundColor, setBackgroundColor] = useState(TRANSPARENT_COLOR);
  const [borderColor, setBorderColor] = useState(TRANSPARENT_COLOR);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onShouldBlockNativeResponder: () => true,
      onPanResponderStart,
      onPanResponderMove,
      onPanResponderRelease,
    })
  ).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: defaultWidth,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [animatedWidth, defaultWidth]);

  function onSwipeNotMetSuccessThreshold() {
    // Animate to initial position
    setDefaultWidth(defaultContainerWidth);
    props.onSwipeFail && props.onSwipeFail();
  }

  function onSwipeMetSuccessThreshold(newWidth: number) {
    if (newWidth !== maxWidth) {
      finishRemainingSwipe();
      return;
    }
    props.onSwipeSuccess && props.onSwipeSuccess();
    reset();
  }

  function onPanResponderStart() {
    if (props.disabled) {
      return;
    }
    props.onSwipeStart && props.onSwipeStart();
  }

  async function onPanResponderMove(_event: any, gestureState: any) {
    if (props.disabled) {
      return;
    }
    const rtlMultiplier = props.enableRightToLeftSwipe ? -1 : 1;
    const newWidth = defaultContainerWidth + rtlMultiplier * gestureState.dx;
    if (newWidth < defaultContainerWidth) {
      // Reached starting position
      reset();
    } else if (newWidth > maxWidth) {
      // Reached end position
      setBackgroundColors();
      setDefaultWidth(maxWidth);
    } else {
      setBackgroundColors();
      await Animated.timing(animatedWidth, {
        toValue: newWidth,
        duration: 0,
        useNativeDriver: false,
      }).start();
      setDefaultWidth(newWidth);
    }
  }

  function onPanResponderRelease(_event: any, gestureState: any) {
    if (props.disabled) {
      return;
    }
    const rtlMultiplier = props.enableRightToLeftSwipe ? -1 : 1;
    const newWidth = defaultContainerWidth + rtlMultiplier * gestureState.dx;
    const successThresholdWidth =
      maxWidth * (props.swipeSuccessThreshold / 100);
    newWidth < successThresholdWidth
      ? onSwipeNotMetSuccessThreshold()
      : onSwipeMetSuccessThreshold(newWidth);
  }

  function setBackgroundColors() {
    const { railFillBackgroundColor, railFillBorderColor } = props;
    // Set backgroundColor only if not already set
    if (backgroundColor === TRANSPARENT_COLOR) {
      setBackgroundColor(railFillBackgroundColor);
      setBorderColor(railFillBorderColor);
    }
  }

  function finishRemainingSwipe() {
    // Animate to final position
    setDefaultWidth(maxWidth);
    props.onSwipeSuccess && props.onSwipeSuccess();

    //Animate back to initial position
    props.shouldResetAfterSuccess && reset();
  }

  function reset() {
    setDefaultWidth(defaultContainerWidth);

    if (backgroundColor !== TRANSPARENT_COLOR) {
      setBackgroundColor(TRANSPARENT_COLOR);
      setBorderColor(TRANSPARENT_COLOR);
    }
  }

  function renderThumbIcon() {
    const {
      disabled,
      disabledThumbIconBackgroundColor,
      disabledThumbIconBorderColor,
      iconSize,
      thumbIconBackgroundColor,
      thumbIconBorderColor,
      thumbIconComponent: ThumbIconComponent,
      thumbIconImageSource,
      thumbIconStyles,
    } = props;
    const dynamicStyles: any = {
      ...thumbIconStyles,
      height: iconSize,
      width: iconSize,
      backgroundColor: disabled
        ? disabledThumbIconBackgroundColor
        : thumbIconBackgroundColor,
      borderColor: disabled
        ? disabledThumbIconBorderColor
        : thumbIconBorderColor,
      overflow: 'hidden',
    };

    return (
      <View style={[styles.icon, { ...dynamicStyles }]}>
        {!ThumbIconComponent && thumbIconImageSource && (
          <Image resizeMethod="resize" source={thumbIconImageSource} />
        )}
        {ThumbIconComponent && (
          <View>
            <ThumbIconComponent />
          </View>
        )}
        {!ThumbIconComponent && !thumbIconImageSource && (
          <View style={styles.defaultThumbIcon} />
        )}
      </View>
    );
  }

  const {
    disabled,
    enableRightToLeftSwipe,
    onSwipeSuccess,
    railStyles,
    screenReaderEnabled,
    title,
  } = props;

  const panStyle: any = {
    backgroundColor,
    borderColor,
    width: animatedWidth,
    ...railStyles,
    ...(enableRightToLeftSwipe ? styles.containerRTL : styles.container),
  };

  return (
    <>
      {screenReaderEnabled ? (
        <TouchableNativeFeedback
          accessibilityLabel={`${title}. ${
            disabled ? 'Disabled' : 'Double-tap to activate'
          }`}
          disabled={disabled}
          onPress={onSwipeSuccess}
          accessible
        >
          <View style={[panStyle, { width: defaultContainerWidth }]}>
            {renderThumbIcon()}
          </View>
        </TouchableNativeFeedback>
      ) : (
        <Animated.View style={[panStyle]} {...panResponder.panHandlers}>
          {renderThumbIcon()}
        </Animated.View>
      )}
    </>
  );
};

SwipeThumb.defaultProps = {
  disabled: false,
  layoutWidth: 0,
  resetAfterSuccessAnimDuration: 200,
  screenReaderEnabled: false,
  thumbIconStyles: {},
};

export default SwipeThumb;
