import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { View, Text } from "react-native-ui-lib";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import moment from "moment";

import { getTVSeriePopular10 } from "../../src/redux/series";
import movieGenres from "../../src/constants/movie-genres.json";
import seriesGenres from "../../src/constants/series-genres.json";
import CONFIG from "../../src/config/tmbd";
import { useAppDispatch, useAppSelector } from "../../src/hooks/redux";
import {
  getEveryoneIsWatching,
  getPopular10,
  getUpcoming,
} from "../../src/redux/movies";

const getGenreNames = (genreIds) => {
  const genreNames = genreIds?.map((genreId) => {
    if (movieGenres[genreId]) {
      return movieGenres[genreId]?.name;
    }
    return null;
  });

  return genreNames?.filter((name) => name !== null).join(" - ");
};

const getTvSeriesGenreName = (genreIds) => {
  const genreNames = genreIds?.map((genreId) => {
    if (seriesGenres[genreId]) {
      return seriesGenres[genreId]?.name;
    }
    return null;
  });

  return genreNames?.filter((name) => name !== null).join(" - ");
};

const Header = () => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      row
      backgroundColor="black"
      spread
      padding-20
      width={"100%"}
      style={{ paddingTop: top }}
    >
      <Text bold size={24}>
        Yeni ve Popüler
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
  );
};

const RemindMeButton = () => {
  return (
    <TouchableOpacity style={styles.buttonContainer}>
      <Ionicons name="notifications-outline" size={35} color="white" />
      <Text size={13} color="#A9A9A9">
        Bana Hatırlat
      </Text>
    </TouchableOpacity>
  );
};

const InformationButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <Ionicons name="information-circle-outline" size={35} color="white" />
      <Text size={13} color="#A9A9A9">
        Bilgi
      </Text>
    </TouchableOpacity>
  );
};

const TopTabSelector = ({ activeIndex, setActiveIndex, tabs }) => {
  const Item = ({
    title,
    active,
    index,
    onPress,
  }: {
    title: string;
    active: boolean;
    index: number;
    onPress: (index) => void;
  }) => {
    return (
      <TouchableOpacity
        style={[
          { backgroundColor: active ? "white" : "black" },
          styles.topTabItemContainer,
        ]}
        onPress={() => onPress(index)}
      >
        <Text size={15} color={active ? "black" : "white"}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const pressItem = (index) => {
    setActiveIndex(index);
  };

  return (
    <View marginB-20>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topTabScrollViewContentContainer}
        horizontal
      >
        {tabs?.map((item, index) => (
          <Item
            index={index}
            title={item?.title}
            active={activeIndex == index}
            onPress={pressItem}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const ComingSoonItemCard = ({ item, onPress }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardLeftContainer}>
        <Text color="#B4B4B6">{moment(item?.release_date)?.format("MMM")}</Text>
        <Text bold size={30} color="white">
          {moment(item?.release_date)?.format("DD")}
        </Text>
      </View>
      <View style={styles.cardRightContainer}>
        <Image
          style={styles.cardImage}
          source={{
            uri: CONFIG.TMBDImageServicesBaseUrl + item?.poster_path,
          }}
        />
        <View row right marginT-15>
          <RemindMeButton />
          <InformationButton onPress={() => onPress(item)} />
        </View>
        <Text marginT-20>
          Yayın Tarihi : {moment(item?.release_date)?.format("DD MMMM")}
        </Text>
        <Text marginT-10 bold size="xl">
          {item?.original_title}
        </Text>
        <Text numberOfLines={4} regular color="#ADACAD" marginT-10>
          {item?.overview}
        </Text>
        <Text marginT-15 size={12}>
          {getGenreNames(item?.genre_ids)}
        </Text>
      </View>
    </View>
  );
};

const EveryoneIsWatchingItemCard = ({ item, onPress }) => {
  return (
    <View style={[styles.cardContainer, { flexDirection: "column" }]}>
      <Image
        style={styles.cardImage}
        source={{
          uri: CONFIG.TMBDImageServicesBaseUrl + item?.poster_path,
        }}
      />
      <View row right marginT-15>
        <RemindMeButton />
        <InformationButton onPress={() => onPress(item)} />
      </View>
      <Text marginT-20>
        Yayın Tarihi : {moment(item?.release_date)?.format("DD MMMM")}
      </Text>
      <Text marginT-10 bold size="xl">
        {item?.original_title}
      </Text>
      <Text numberOfLines={4} regular color="#ADACAD" marginT-10>
        {item?.overview}
      </Text>
      <Text marginT-15 size={12}>
        {getGenreNames(item?.genre_ids)}
      </Text>
    </View>
  );
};

const Top10ItemCard = ({ item, onPress }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardLeftContainer}>
        <Text color="#B4B4B6">
          {moment(item?.release_date || item?.first_air_date)?.format("MMM")}
        </Text>
        <Text bold size={30} color="white">
          {moment(item?.release_date || item?.first_air_date)?.format("DD")}
        </Text>
      </View>
      <View style={styles.cardRightContainer}>
        <Image
          style={styles.cardImage}
          source={{
            uri: CONFIG.TMBDImageServicesBaseUrl + item?.poster_path,
          }}
        />
        <View row right marginT-15>
          <RemindMeButton />
          <InformationButton onPress={() => onPress(item)} />
        </View>
        <Text marginT-20>
          Yayın Tarihi :{" "}
          {moment(item?.release_date || item?.first_air_date)?.format(
            "DD MMMM"
          )}
        </Text>
        <Text marginT-10 bold size="xl">
          {item?.original_title || item?.name}
        </Text>
        {item?.overview && (
          <Text numberOfLines={4} regular color="#ADACAD" marginT-10>
            {item?.overview}
          </Text>
        )}

        <Text marginT-15 size={12}>
          {item?.name
            ? getTvSeriesGenreName(item?.genre_ids)
            : getGenreNames(item?.genre_ids)}
        </Text>
      </View>
    </View>
  );
};

const NewAndPopularScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getUpcomingResult = useAppSelector(
    (state) => state.movies.getUpcomingResult
  );
  const getEveryoneIsWatchingResult = useAppSelector(
    (state) => state.movies.getEveryoneIsWatchingResult
  );
  const getPopular10Result = useAppSelector(
    (state) => state.movies.getPopular10Result
  );

  const getTVSeriePopular10Result = useAppSelector(
    (state) => state.series.getTVSeriePopular10Result
  );

  const tabs = [
    {
      title: "🍿 Çok Yakında",
      component: ComingSoonItemCard,
      data: getUpcomingResult,
    },
    {
      title: "🔥 Herkes Bunları İzliyor",
      component: EveryoneIsWatchingItemCard,
      data: getEveryoneIsWatchingResult,
    },
    {
      title: "🔟 Top 10 Dizi Listesi",
      component: Top10ItemCard,
      data: getTVSeriePopular10Result,
    },
    {
      title: "🔟 Top 10 Film Listesi",
      component: Top10ItemCard,
      data: getPopular10Result,
    },
  ];

  const contentPress = (item) => {
    router.push({
      pathname: "/browse/content",
      params: {
        id: `${item?.id}-${item?.title ? 1 : 2}`,
      },
    });
  };

  const requests = () => {
    dispatch(getUpcoming());
    dispatch(getEveryoneIsWatching());
    dispatch(getPopular10());
    dispatch(getTVSeriePopular10());
  };

  useEffect(() => {
    requests();
  }, []);

  return (
    <View flex backgroundColor="black">
      <Header />
      <TopTabSelector
        tabs={tabs}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <View backgroundColor="black">
        <FlatList
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text bold size={20}>
              {tabs[activeIndex]?.title}
            </Text>
          }
          contentContainerStyle={styles.contentFlatlistContainer}
          data={tabs[activeIndex]?.data}
          keyExtractor={(item, index) => "key" + index}
          renderItem={({ item, index }) => {
            const Component = tabs[activeIndex].component;
            return (
              Component && (
                <Component onPress={contentPress} key={index} item={item} />
              )
            );
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: { marginHorizontal: 10, alignItems: "center" },
  topTabItemContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  topTabScrollViewContentContainer: { paddingLeft: 20 },
  cardContainer: {
    width: "100%",
    flexDirection: "row",
    marginVertical: 20,
  },
  cardLeftContainer: { width: "13%", alignItems: "center" },
  cardRightContainer: { width: "87%" },
  cardImage: { width: "100%", height: 200, borderRadius: 20 },
  contentFlatlistContainer: { paddingBottom: 350 },
});

export default NewAndPopularScreen;
