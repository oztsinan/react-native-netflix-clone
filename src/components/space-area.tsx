import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SpaceAreaProps = {
  bottom?: number;
  top?: number;
};

const SpaceArea = ({ bottom, top }: SpaceAreaProps) => {
  const { top: topValue, bottom: bottomValue } = useSafeAreaInsets();

  if (bottom && !top) {
    return <View style={{ paddingBottom: bottomValue }} />;
  } else if (top && !bottom) {
    return <View style={{ paddingTop: topValue }} />;
  } else {
    return <View style={{ paddingTop: topValue }} />;
  }
};

export default SpaceArea;
