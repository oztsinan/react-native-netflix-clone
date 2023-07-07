import { useFonts } from "expo-font";

const FontWrapper = ({ children }) => {
  const [fontsLoaded] = useFonts({
    Light: require("../assets/fonts/NetflixSans/NetflixSans-Light.otf"),
    Regular: require("../assets/fonts/NetflixSans/NetflixSans-Regular.otf"),
    Medium: require("../assets/fonts/NetflixSans/NetflixSans-Medium.otf"),
    Bold: require("../assets/fonts/NetflixSans/NetflixSans-Bold.otf"),
  });

  if (fontsLoaded) {
    return children;
  }
};

export default FontWrapper;
