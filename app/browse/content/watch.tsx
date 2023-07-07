import { Video } from "expo-av";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native-ui-lib";
import ytdl from "react-native-ytdl";
import Slider from "@react-native-community/slider";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Ionicons, Feather, Foundation } from "@expo/vector-icons";
import Forward10SecondIcon from "../../../src/components/icons/Forward10SecondIcon";
import Rewind10SecondIcon from "../../../src/components/icons/Rewind10SecondIcon";
import SpeedIcon from "../../../src/components/icons/SpeedIcon";

type WatchScreenProps = {
  key: string;
  name: string;
};

const ControlsContainer = ({
  videoRef,
  onPlaybackStatusUpdate,
  visible,
  name,
}) => {
  const router = useRouter();

  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remainingTime, setRemainingTime] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      transform: [
        {
          translateY: withTiming(-translateY.value, {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });

  const middleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    };
  });

  const footerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      transform: [
        {
          translateY: withTiming(translateY.value, {
            duration: 500,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          }),
        },
      ],
    };
  });

  const closePress = () => {
    router.back();
  };

  const handleSlidingStart = () => {
    videoRef.current.pauseAsync();
  };

  const handleSlidingComplete = (value) => {
    videoRef.current.playFromPositionAsync(value * 1000);
  };

  const playPauseButtonPress = () => {
    if (isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
    }
  };

  const handleRewind = () => {
    const targetTime = currentSeconds - 10; // 10 saniye geriye git
    videoRef.current.setPositionAsync(targetTime * 1000);
  };

  const handleForward = () => {
    const targetTime = currentSeconds + 10; // 10 saniye ileri git
    videoRef.current.setPositionAsync(targetTime * 1000);
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);

    let formattedTime = "";

    if (hours > 0) {
      formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    } else {
      formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    }

    return formattedTime;
  };

  useEffect(() => {
    if (
      onPlaybackStatusUpdate?.positionMillis &&
      onPlaybackStatusUpdate?.durationMillis
    ) {
      setCurrentSeconds(onPlaybackStatusUpdate?.positionMillis / 1000);
      setTotalSeconds(onPlaybackStatusUpdate?.durationMillis / 1000);
    }
    setIsPlaying(onPlaybackStatusUpdate?.isPlaying);
  }, [onPlaybackStatusUpdate]);

  useEffect(() => {
    const remainingSeconds = totalSeconds - currentSeconds;
    const formattedTime = formatTime(remainingSeconds);

    setRemainingTime(formattedTime);
  }, [currentSeconds, totalSeconds]);

  useEffect(() => {
    if (visible) {
      opacity.value = 1;
      translateY.value = 0;
    } else {
      opacity.value = 0;
      translateY.value = 20;
    }
  }, [visible]);

  return (
    <View style={styles.controlsContainer}>
      <Animated.View style={[styles.controlsTopContainer, headerAnimatedStyle]}>
        <View width={"5%"} height={"100%"} center>
          <TouchableOpacity>
            <Feather name="cast" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <View width={"90%"} height={"100%"} center>
          <Text>{name}</Text>
        </View>
        <View width={"5%"} height={"100%"} center>
          <TouchableOpacity onPress={closePress}>
            <Ionicons name="close-outline" size={32} color={"white"} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.View
        style={[styles.controlsMiddleContainer, middleAnimatedStyle]}
      >
        <TouchableOpacity onPress={handleRewind}>
          <Rewind10SecondIcon />
        </TouchableOpacity>
        <TouchableOpacity onPress={playPauseButtonPress}>
          <Foundation
            name={isPlaying ? "pause" : "play"}
            size={60}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForward}>
          <Forward10SecondIcon />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[styles.controlsBottomContainer, footerAnimatedStyle]}
      >
        <View row spread centerV>
          <Slider
            style={{ width: "90%" }}
            value={currentSeconds}
            maximumValue={totalSeconds}
            thumbTintColor="#E50817"
            minimumTrackTintColor="#E50817"
            maximumTrackTintColor="#4E5150"
            onSlidingStart={handleSlidingStart}
            onSlidingComplete={handleSlidingComplete}
          />
          <Text regular>{remainingTime}</Text>
        </View>
        <View row center width={"100%"} marginT-15>
          <View row marginR-15>
            <SpeedIcon />
            <Text size={13} marginL-5>
              Hız(1x)
            </Text>
          </View>
          <View row marginR-15>
            <SpeedIcon />
            <Text size={13} marginL-5>
              Kilitle
            </Text>
          </View>
          <View row marginR-15>
            <SpeedIcon />
            <Text size={13} marginL-5>
              Seslendirme ve Alt Yazı
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

const WatchScreen = () => {
  const { key, name } = useLocalSearchParams<WatchScreenProps>();

  const videoRef = useRef<Video>();

  const [streamLink, setStreamLink] = useState(null);
  const [onPlaybackStatusUpdate, setOnPlaybackStatusUpdate] = useState({});
  const [isControllerVisible, setControllerVisible] = useState(true);
  const [isVideoLoad, setIsVideoLoad] = useState(false);

  const getStreamLink = async (youtubeLink) => {
    try {
      const formats = await ytdl(youtubeLink, { quality: "lowest" });
      const streamUrl = formats[0].url; // En yüksek kalitedeki formatın yayın bağlantısını alıyoruz
      return streamUrl;
    } catch (error) {
      console.error("Yayın bağlantısını alırken bir hata oluştu:", error);
      return null;
    }
  };

  const getStream = async () => {
    const youtubeLink = "https://www.youtube.com/watch?v=" + key;
    const streamLink_ = await getStreamLink(youtubeLink);
    setStreamLink(streamLink_);
  };

  useEffect(() => {
    if (key) {
      getStream();
    }
  }, [key]);

  const handleVideoProgress = (progress) => {
    setOnPlaybackStatusUpdate(progress);
  };

  const handleVideoPress = () => {
    setControllerVisible(!isControllerVisible);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current?.playAsync();
    }
  }, [isVideoLoad]);

  return (
    <View flex center>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={handleVideoPress}
      >
        {streamLink && (
          <Video
            ref={videoRef}
            shouldPlay
            onPlaybackStatusUpdate={handleVideoProgress}
            isLooping
            onReadyForDisplay={() => setIsVideoLoad(true)}
            useNativeControls={false}
            style={styles.video}
            source={{
              uri: streamLink,
            }}
          />
        )}

        {streamLink && (
          <ControlsContainer
            videoRef={videoRef}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            visible={isControllerVisible}
            name={name}
          />
        )}

        {!isVideoLoad && (
          <View width={"100%"} absV flex center backgroundColor="black">
            <ActivityIndicator size="large" color={"white"} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    paddingHorizontal: 25,
    alignItems: "center",
  },
  controlsTopContainer: { width: "100%", height: "20%", flexDirection: "row" },
  controlsMiddleContainer: {
    width: "55%",
    height: "50%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  controlsBottomContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
  },
  controlBottomSlider: { width: "90%" },
  container: { width: "100%", height: "100%" },
  video: { width: "100%", height: "100%", backgroundColor: "black" },
});

export default WatchScreen;
