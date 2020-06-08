import { ReactElement, ReactNode } from 'react';
import { ImageSourcePropType } from 'react-native';

export type SwipeThumbProps = {
  disabled: boolean;
  disabledThumbIconBackgroundColor: string;
  disabledThumbIconBorderColor: string;
  enableRightToLeftSwipe: boolean;
  iconSize: number;
  layoutWidth: number;
  onSwipeFail: () => void;
  onSwipeStart: () => void;
  onSwipeSuccess: () => void;
  railFillBackgroundColor: string;
  railFillBorderColor: string;
  railStyles: object;
  resetAfterSuccessAnimDuration: number;
  screenReaderEnabled: boolean;
  shouldResetAfterSuccess: boolean;
  swipeSuccessThreshold: number;
  thumbIconBackgroundColor: string;
  thumbIconBorderColor: string;
  thumbIconComponent: ReactElement | ReactNode | any;
  thumbIconImageSource: ImageSourcePropType;
  thumbIconStyles: object;
  title: string;
};
