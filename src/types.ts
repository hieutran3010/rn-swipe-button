import { ReactElement, ReactNode } from 'react';
import { ImageSourcePropType } from 'react-native';

export type SwipeButtonProps = {
  containerStyles: object;
  disable: boolean;
  disabledRailBackgroundColor: string;
  disabledThumbIconBackgroundColor: string;
  disabledThumbIconBorderColor: string;
  enableRightToLeftSwipe: boolean;
  height: number;
  onSwipeFail: () => void;
  onSwipeStart: () => void;
  onSwipeSuccess: () => void;
  railBackgroundColor: string;
  railBorderColor: string;
  railFillBackgroundColor: string;
  railFillBorderColor: string;
  railStyles: object;
  resetAfterSuccessAnimDuration: number;
  shouldResetAfterSuccess: boolean;
  swipeSuccessThreshold: number; // Ex: 70. Swipping 70% will be considered as successful swipe
  thumbIconBackgroundColor: string;
  thumbIconBorderColor: string;
  thumbIconComponent: ReactElement | ReactNode | (() => void);
  thumbIconImageSource: ImageSourcePropType;
  thumbIconStyles: object;
  title: string;
  titleColor: string;
  titleFontSize: number;
  titleStyles: object;
  width: number | string;
  disabled: boolean;
};
