import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import {
  Dimensions,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Text, View } from "react-native-ui-lib";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import ytdl from "react-native-ytdl";
import { Image } from "expo-image";
import { Video } from "expo-av";
import moment from "moment";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Progress from "react-native-progress";
import Animated from "react-native-reanimated";

import DownloadIcon from "../../../src/components/icons/DownloadIcon";
import LikeIcon from "../../../src/components/icons/LikeIcon";
import ShareIcon from "../../../src/components/icons/ShareIcon";
import AddIcon from "../../../src/components/icons/AddIcon";
import DefaultCard from "../../../src/components/cards/default-card";
import CONFIG from "../../../src/config/tmbd";
import { useAppDispatch, useAppSelector } from "../../../src/hooks/redux";
import {
  getContentAggregateCredits,
  getContentDetail,
  getContentRecommendations,
  getContentVideos,
} from "../../../src/redux/content";

const { width, height } = Dimensions.get("window");

type ContentScreenParams = {
  id: string;
  image: string;
  rowIndex: string;
};

interface CrewSheetRef extends BottomSheet {
  close: () => void;
}

type CrewSheetProps = {
  credits: any;
  name: string;
  genres?: any;
  closePress?: () => void;
};

const LoadingSpinner = ({ onPress }: { onPress?: () => void }) => {
  const size = 60;

  return (
    <TouchableOpacity onPress={onPress} style={{ width: size, height: size }}>
      <View width={"100%"} height={"100%"} absV center>
        <View
          width={"95%"}
          height={"95%"}
          center
          style={styles.loadingSpinnerButton}
          backgroundColor="rgba(0,0,0,0.2)"
        >
          <FontAwesome name="play" size={20} color="white" />
        </View>
      </View>
      <Progress.CircleSnail thickness={2} size={size} color={["red"]} />
    </TouchableOpacity>
  );
};

const TopImageVideo = ({ imagePath, videoKey, videoRef }) => {
  const router = useRouter();
  const [streamLink, setStreamLink] = useState(null);
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
    const youtubeLink = "https://www.youtube.com/watch?v=" + videoKey; // YouTube videosunun URL'si
    const streamLink_ = await getStreamLink(youtubeLink);
    setStreamLink(streamLink_);
  };

  useEffect(() => {
    if (videoKey) {
      getStream();
    }
  }, [videoKey]);

  return (
    <View width={"100%"} height={220} backgroundColor="red">
      <View width={"100%"} height={"100%"} backgroundColor="black">
        <Image
          style={styles.topImageVideoCompImage}
          source={{
            uri: CONFIG.TMBDImageServicesBaseUrl + imagePath,
          }}
        />

        {videoKey && !isVideoLoad && (
          <View absV width={"100%"} height={"100%"} center>
            <LoadingSpinner />
          </View>
        )}

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: isVideoLoad ? 1 : 0 }}
          style={styles.topImageVideoCompVideoContainer}
        >
          <Video
            ref={videoRef}
            style={styles.topImageVideoCompVideo}
            source={{
              uri: streamLink,
            }}
            shouldPlay={true}
            useNativeControls={true}
            onReadyForDisplay={() => setIsVideoLoad(true)}
          />
        </MotiView>
      </View>

      <View absR padding-10>
        <CloseButton onPress={() => router.back()} />
      </View>
    </View>
  );
};

const CloseButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.closeButton}>
      <Ionicons name="close" color={"white"} size={22} />
    </TouchableOpacity>
  );
};

const Title = ({ title }) => {
  return (
    <Text bold size={20}>
      {title}
    </Text>
  );
};

const Information = ({
  vote,
  date,
  numberOfSeasons,
}: {
  vote: number;
  date: string;
  numberOfSeasons: number;
}) => {
  return (
    <View row marginV-7>
      {vote ? (
        <Text marginR-10 color={"#45D368"} size={15}>
          {`%${(vote * 10)?.toFixed(0)} eşleşme`}
        </Text>
      ) : null}

      <Text marginR-10 size={15}>
        {moment(date).format("YYYY")}
      </Text>
      {numberOfSeasons == 2 && <Text size={15}>{numberOfSeasons} Sezon</Text>}
    </View>
  );
};

const Description = ({ description }) => {
  return (
    description && (
      <Text size={14} marginT-10>
        {description}
      </Text>
    )
  );
};

const PlayButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.playButton}>
      <FontAwesome name="play" size={20} color="black" />
      <Text marginL-7 size={15} color="black">
        Oynat
      </Text>
    </TouchableOpacity>
  );
};

const DownloadButton = () => {
  return (
    <TouchableOpacity style={styles.downloadButton}>
      <DownloadIcon />
      <Text marginL-7 size={15}>
        İndir
      </Text>
    </TouchableOpacity>
  );
};

const Cast = ({ data, onPress }) => {
  const router = useRouter();

  const personDetailPress = (item) => {
    const { id, name } = item;
    router.push({
      pathname: "/browse/content/person",
      params: {
        id,
        name,
      },
    });
  };

  return (
    <View marginV-15 centerV row style={styles.castContainer}>
      <Text size={14} color={"#999999"}>
        Oyuncu Kadrosu :{" "}
      </Text>
      {data?.slice(0, 5)?.map((item, index) => (
        <View key={index} row>
          <Text
            size={14}
            color={"#999999"}
            onPress={() => personDetailPress(item)}
          >
            {item?.name}
          </Text>
          {index !== data?.length - 1 && (
            <Text size={14} color={"#999999"}>
              ,{" "}
            </Text>
          )}
        </View>
      ))}

      <Text size={14} color={"#999999"} onPress={onPress}>
        ... daha fazla bilgi
      </Text>
    </View>
  );
};

const ActionButtons = () => {
  const Item = ({ title, icon }) => {
    return (
      <TouchableOpacity style={styles.actionButtonsItemContainer}>
        {icon}
        <Text size={12} color="#999999" regular>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View row marginV-10>
      <Item title={"Listem"} icon={<AddIcon />} />
      <Item title={"Puan Ver"} icon={<LikeIcon />} />
      <Item title={"Paylaş"} icon={<ShareIcon />} />
    </View>
  );
};

const Tabs = ({ recommendationsData, trailersData, trailerOnPress }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const TabItem = ({ active, title, onPress, index }) => {
    return (
      <TouchableOpacity
        style={styles.footerTabsTabItemContainer}
        onPress={() => onPress(index)}
      >
        <MotiView
          from={{ opacity: activeIndex == index ? 1 : 0 }}
          animate={{
            opacity: active == index ? 1 : 0,
          }}
          style={styles.footerTabsTabItemTopLine}
        />
        <Text size={15}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const TrailerCard = ({ trailerOnPress, index, item }) => {
    return (
      <View marginB-20 key={index} width={"100%"} paddingH-5>
        <TouchableOpacity
          onPress={() => {
            trailerOnPress(item);
          }}
          style={styles.footerTabsTrailerCardImageContainer}
        >
          <Image
            style={styles.footerTabsTrailerCardImage}
            source={{
              uri: `https://i3.ytimg.com/vi/${item?.key}/maxresdefault.jpg`,
            }}
          />
          <View absV width={"100%"} height={"100%"} center>
            <View
              backgroundColor="white"
              style={styles.footerTabsTrailerCardPlayButton}
            >
              <AntDesign name="play" size={45} color="black" />
            </View>
          </View>
        </TouchableOpacity>
        <Text numberOfLines={1} size={15} regular>
          {item?.name}
        </Text>
      </View>
    );
  };

  return (
    <View marginT-10 width={"100%"}>
      <View marginL-10 marginB-20 row>
        {recommendationsData?.length > 0 && (
          <TabItem
            index={0}
            title="Benzerleri"
            active={activeIndex}
            onPress={setActiveIndex}
          />
        )}
        {trailersData?.length > 0 && (
          <TabItem
            index={1}
            title="Fragmanlar"
            active={activeIndex}
            onPress={setActiveIndex}
          />
        )}
      </View>

      {activeIndex == 0 && (
        <ScrollView
          contentContainerStyle={
            styles.footerTabsRecommendationsScrollViewContentContainer
          }
        >
          {recommendationsData?.map((item, index) => (
            <View
              key={index}
              style={styles.footerTabsRecommendationsCardWrapper}
            >
              <DefaultCard
                onPress={(item) => console.log(item)}
                item={item}
                uri={CONFIG.TMBDImageServicesBaseUrl + item?.poster_path}
              />
            </View>
          ))}
        </ScrollView>
      )}

      {activeIndex == 1 && (
        <ScrollView
          contentContainerStyle={
            styles.footerTabsTrailersScrollViewContentContainer
          }
        >
          {trailersData?.map((item, index) => (
            <TrailerCard
              item={item}
              index={index}
              key={index}
              trailerOnPress={trailerOnPress}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const CrewSheet = forwardRef<CrewSheetRef, CrewSheetProps>((props, ref) => {
  const snapPoints = useMemo(() => ["100%"], []);
  const router = useRouter();

  const { name, credits, genres } = props;

  const personDetailPress = (item) => {
    const { id, name } = item;
    router.push({
      pathname: "/browse/content/person",
      params: {
        id,
        name,
      },
    });
  };

  return (
    <BottomSheet
      enablePanDownToClose
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      handleIndicatorStyle={styles.crewSheetHandleIndicator}
      backgroundStyle={styles.crewSheetBackground}
    >
      <View flex>
        <View row spread width={"100%"} centerV>
          <View width={"10%"}></View>
          <View width={"80%"} center>
            <Text numberOfLines={1} bold size={22}>
              {name}
            </Text>
          </View>
          <View width={"10%"}>
            <TouchableOpacity
              onPress={props.closePress}
              style={styles.crewSheetTopClosePressButton}
            >
              <Ionicons name="close" color={"#E6E6E6"} size={22} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.crewSheetScrollViewContentContainer}
        >
          <Text marginV-20 numberOfLines={1} bold size={18}>
            Oyuncu Kadrosu
          </Text>
          {credits?.cast?.map((item, index) => (
            <Text
              key={index}
              marginB-20
              size={15}
              onPress={() => personDetailPress(item)}
            >
               {item?.name}{" "}
            </Text>
          ))}

          <Text marginV-20 numberOfLines={1} bold size={18}>
            Yönetmen
          </Text>
          {credits?.crew
            ?.filter((item) => item?.department == "Directing")
            ?.map((item, index) => (
              <Text
                key={index}
                marginB-20
                size={15}
                onPress={() => personDetailPress(item)}
              >
                 {item?.name}{" "}
              </Text>
            ))}

          <Text marginV-20 numberOfLines={1} bold size={18}>
            Yaratıcı
          </Text>
          {credits?.crew
            ?.filter((item) => item?.department == "Writing")
            ?.map((item, index) => (
              <Text
                key={index}
                marginB-20
                size={15}
                onPress={() => personDetailPress(item)}
              >
                 {item?.name}{" "}
              </Text>
            ))}

          <Text marginV-20 numberOfLines={1} bold size={18}>
            Bu program
          </Text>
          {genres?.map((item, index) => (
            <Text marginB-20 size={15} key={index}>
               {item?.name}{" "}
            </Text>
          ))}
        </ScrollView>
      </View>
    </BottomSheet>
  );
});

const ContentScreen = () => {
  const { id: routeId, rowIndex } = useLocalSearchParams<ContentScreenParams>();
  const [id, type]: [string, number] = routeId.split("-") as [string, number];

  const router = useRouter();

  const dispatch = useAppDispatch();

  const sheetRef = useRef<BottomSheet>(null);
  const videoRef = useRef<Video>();

  const getContentDetailResult = useAppSelector(
    (state) => state.content.getContentDetailResult
  );

  const getContentVideosResult = useAppSelector(
    (state) => state.content.getContentVideosResult
  );

  const getContentAggregateCreditsResult = useAppSelector(
    (state) => state.content.getContentAggregateCreditsResult
  );

  const getContentRecommendationsResult = useAppSelector(
    (state) => state.content.getContentRecommendationsResult
  );

  const request = () => {
    const item = {
      id: parseInt(id),
      type: type,
    };

    dispatch(getContentDetail(item));
    dispatch(getContentVideos(item));
    dispatch(getContentAggregateCredits(item));
    dispatch(getContentRecommendations(item));
  };

  const trailerOnPress = async (item: { key: string; name: string }) => {
    if (videoRef.current) {
      await videoRef.current.pauseAsync();
    }

    await router.push({
      pathname: "/browse/content/watch",
      params: {
        key: item?.key,
        name: item?.name,
      },
    });
  };

  const readMoreCrewPress = () => {
    sheetRef.current?.snapToIndex(0);
  };

  const pressPlayButton = async () => {
    if (
      Array.isArray(getContentVideosResult) &&
      getContentVideosResult?.length > 0
    ) {
      if (videoRef.current) {
        await videoRef.current.pauseAsync();
      }

      await router.push({
        pathname: "/browse/content/watch",
        params: {
          key: getContentVideosResult[0]?.key,
          name: getContentVideosResult[0]?.name,
        },
      });
    }
  };

  useEffect(() => {
    request();
  }, []);

  return (
    <View flex backgroundColor="black">
      <View style={styles.topImageContainer}>
        <Animated.Image
          sharedTransitionTag={`${id}-${rowIndex}`}
          style={styles.topImage}
          source={{
            uri:
              CONFIG.TMBDImageServicesBaseUrl +
              getContentDetailResult?.poster_path,
          }}
        />

        <BlurView
          tint="dark"
          intensity={100}
          style={styles.backgroundBlurView}
        />
      </View>

      <MotiView from={{ opacity: 0 }} delay={500} animate={{ opacity: 1 }}>
        <TopImageVideo
          imagePath={getContentDetailResult?.backdrop_path}
          videoKey={
            Array.isArray(getContentVideosResult) &&
            getContentVideosResult[0]?.key
          }
          videoRef={videoRef}
        />
        <ScrollView
          contentContainerStyle={styles.mainScrollViewContentContainer}
        >
          <Title
            title={getContentDetailResult?.title ?? getContentDetailResult.name}
          />

          <Information
            vote={getContentDetailResult?.vote_average}
            numberOfSeasons={getContentDetailResult?.number_of_seasons}
            date={
              getContentDetailResult?.first_air_date ??
              getContentDetailResult?.release_date
            }
          />

          <PlayButton onPress={pressPlayButton} />
          <DownloadButton />

          <Description description={getContentDetailResult?.overview} />

          <Cast
            data={getContentAggregateCreditsResult?.cast}
            onPress={readMoreCrewPress}
          />

          <ActionButtons />
          <Tabs
            recommendationsData={getContentRecommendationsResult}
            trailersData={getContentVideosResult}
            trailerOnPress={trailerOnPress}
          />
        </ScrollView>
      </MotiView>

      <CrewSheet
        ref={sheetRef}
        name={getContentDetailResult?.title ?? getContentDetailResult.name}
        credits={getContentAggregateCreditsResult}
        genres={getContentDetailResult?.genres}
        closePress={() => sheetRef.current?.close()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topImageContainer: { position: "absolute", width, height },
  topImage: { width: "100%", height: "100%", borderRadius: 5 },
  backgroundBlurView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(44,36,35,0.8)",
  },
  mainScrollViewContentContainer: { padding: 10, paddingBottom: 300 },
  loadingSpinnerButton: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  topImageVideoCompImage: { width: "100%", height: "100%" },
  topImageVideoCompVideoContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  topImageVideoCompVideo: { width: "100%", height: "100%" },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#232B34",
    borderRadius: 100,
  },
  playButton: {
    width: "100%",
    height: 35,
    backgroundColor: "white",
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  downloadButton: {
    width: "100%",
    height: 35,
    backgroundColor: "rgba(115, 115, 115,0.4)",
    borderRadius: 5,
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  castContainer: { flexWrap: "wrap" },
  actionButtonsItemContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
    height: 50,
  },
  footerTabsTabItemContainer: { marginRight: 10 },
  footerTabsTabItemTopLine: {
    backgroundColor: "#E50A12",
    height: 5,
    marginBottom: 10,
  },
  footerTabsRecommendationsScrollViewContentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  footerTabsRecommendationsCardWrapper: {
    width: "33%",
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  footerTabsTrailersScrollViewContentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  footerTabsTrailerCardImageContainer: {
    width: "100%",
    height: 210,
    paddingBottom: 10,
  },
  footerTabsTrailerCardImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  footerTabsTrailerCardPlayButton: { borderRadius: 100, padding: 2 },
  crewSheetHandleIndicator: { display: "none" },
  crewSheetBackground: { backgroundColor: "#2B2B2B" },
  crewSheetTopClosePressButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#555555",
    borderRadius: 100,
  },
  crewSheetScrollViewContentContainer: { alignItems: "center" },
});

export default ContentScreen;
