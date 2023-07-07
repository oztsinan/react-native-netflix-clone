import { BlurView } from "expo-blur";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text, View } from "react-native-ui-lib";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Image, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getColors } from "react-native-image-colors";
import { MotiView } from "moti";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import BigCard from "../../src/components/cards/big-card";
import DefaultRowList from "../../src/components/lists/default-row-list";
import Top10List from "../../src/components/lists/top-10-list";
import { getSpainTVSeries, getTurkishTVSeries } from "../../src/redux/series";
import { useAppDispatch, useAppSelector } from "../../src/hooks/redux";
import CONFIG from "../../src/config/tmbd";
import {
  getActionMovies,
  getNowPlaying,
  getPopular10,
  getRandomPopularMovie,
  getUpcoming,
} from "../../src/redux/movies";

const { height } = Dimensions.get("window");

const Header = ({ verticalOffset }) => {
  const { top } = useSafeAreaInsets();

  return (
    <View width={"100%"} height={top + 40} absT>
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: verticalOffset <= 0 ? 0 : 1 }}
        style={[styles.headerContainer, { height: top + 50 }]}
      >
        <BlurView tint="dark" intensity={100} style={styles.headerBlurView} />
      </MotiView>
      <View
        width={"100%"}
        height={"100%"}
        paddingH-20
        style={[{ paddingTop: top }]}
        spread
        row
        centerV
      >
        <Text bold size={24}>
          SİNAN için
        </Text>
        <View row spread centerV width={"30%"}>
          <TouchableOpacity>
            <Feather name="cast" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="md-search-outline" size={25} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../../src/assets/images/avatar.png")} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const BackgroundLinearGradient = ({ dominantColor }) => {
  return (
    <View absT width={"100%"} height={height}>
      <LinearGradient
        style={styles.backgroundLinearGradient}
        colors={[dominantColor, "black"]}
      />
    </View>
  );
};

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const { top } = useSafeAreaInsets();
  const router = useRouter();

  const [scrollViewVerticalOffset, setScrollViewVerticalOffset] = useState(0);

  const getRandomPopularMovieResult = useAppSelector(
    (state) => state.movies.getRandomPopularMovieResult
  );

  const getNowPlayingResult = useAppSelector(
    (state) => state.movies.getNowPlayingResult
  );

  const getPopular10Result = useAppSelector(
    (state) => state.movies.getPopular10Result
  );

  const getUpcomingResult = useAppSelector(
    (state) => state.movies.getUpcomingResult
  );

  const getActionMoviesResult = useAppSelector(
    (state) => state.movies.getActionMoviesResult
  );

  const getTurkishTVSeriesResult = useAppSelector(
    (state) => state.series.getTurkishTVSeriesResult
  );

  const getSpainTVSeriesResult = useAppSelector(
    (state) => state.series.getSpainTVSeriesResult
  );

  const [dominantColor, setDominantColor] = useState("black");

  const getMainContentImageDominantColor = async (path: string) => {
    const getColorsRequest = await getColors(
      CONFIG.TMBDImageServicesBaseUrl + path
    );

    if (getColorsRequest.platform == "ios") {
      if (getColorsRequest.secondary == "#FFFFFF") {
        setDominantColor(getColorsRequest.background);
      } else {
        setDominantColor(getColorsRequest.secondary);
      }
    } else if (getColorsRequest.platform == "android") {
      setDominantColor(getColorsRequest.dominant);
    }
  };

  const requests = async () => {
    const getRandomPopularMovieResponse = await dispatch(
      getRandomPopularMovie()
    );
    await getMainContentImageDominantColor(
      getRandomPopularMovieResponse.payload.poster_path
    );

    dispatch(getNowPlaying());
    dispatch(getTurkishTVSeries());
    dispatch(getPopular10());
    dispatch(getUpcoming());
    dispatch(getSpainTVSeries());
    dispatch(getActionMovies());
  };

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    setScrollViewVerticalOffset(contentOffset.y);
  };

  const pressContent = (item, rowIndex) => {
    router.push({
      pathname: "/browse/content",
      params: {
        id: `${item?.id}-${item?.title ? 1 : 2}`,
        rowIndex,
      },
    });
  };

  useEffect(() => {
    requests();
  }, []);

  return (
    <View flex backgroundColor={"black"}>
      <View
        absT
        width={"100%"}
        height={400}
        backgroundColor={dominantColor}
      ></View>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        contentContainerStyle={[
          { paddingTop: top + 60 },
          styles.mainContentContainerStyle,
        ]}
      >
        <BackgroundLinearGradient dominantColor={dominantColor} />
        <BigCard
          item={getRandomPopularMovieResult}
          dominantColor={dominantColor}
        />

        <DefaultRowList
          title={"Yeni Çıkan Filmler"}
          data={getNowPlayingResult}
          rowIndex={1}
          onPress={(item) => pressContent(item, 1)}
        />
        <DefaultRowList
          title={"Türk Dizileri"}
          data={getTurkishTVSeriesResult}
          rowIndex={2}
          onPress={(item) => pressContent(item, 2)}
        />
        <Top10List
          title={"Top 10 Film Listesi"}
          data={getPopular10Result}
          onPress={(item) => pressContent(item, 3)}
        />
        <DefaultRowList
          title={"Yaklaşan Filmler"}
          data={getUpcomingResult}
          rowIndex={4}
          onPress={(item) => pressContent(item, 4)}
        />
        <DefaultRowList
          title={"İspanyol Dizileri"}
          data={getSpainTVSeriesResult}
          rowIndex={5}
          onPress={(item) => pressContent(item, 5)}
        />
        <DefaultRowList
          title={"Aksiyon Filmleri"}
          data={getActionMoviesResult}
          rowIndex={6}
          onPress={(item) => pressContent(item, 6)}
        />
      </KeyboardAwareScrollView>
      <Header verticalOffset={scrollViewVerticalOffset} />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    width: "100%",
  },
  headerBlurView: {
    width: "100%",
    height: "100%",
  },
  backgroundLinearGradient: { width: "100%", height: "100%" },
  mainContentContainerStyle: {
    alignItems: "center",
    paddingBottom: 140,
    backgroundColor: "black",
  },
});

export default HomeScreen;
