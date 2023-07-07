import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { Text } from "react-native-ui-lib";
import movieGenres from "../../constants/movie-genres.json";
import { tmdbClient } from "../../api/axiosClients";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import CONFIG from "../../config/tmbd";

const BigCard = ({ item, dominantColor }) => {
  const router = useRouter();

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const getGenreNames = (genreIds) => {
    const genreNames = genreIds?.map((genreId) => {
      if (movieGenres[genreId]) {
        return movieGenres[genreId]?.name;
      }
      return null;
    });

    return genreNames?.filter((name) => name !== null).join(" - ");
  };

  const cardPress = (item: { id: number; title: string }) => {
    router.push({
      pathname: "/browse/content",
      params: {
        id: `${item?.id}-${item?.title ? 1 : 2}`,
      },
    });
  };

  const playPress = async () => {
    const response = await tmdbClient.get(`/movie/${item?.id}/videos`);
    if (response.data.results?.length > 0) {
      await router.push({
        pathname: "/browse/content/watch",
        params: {
          key: response.data.results[0]?.key,
          name: response.data.results[0]?.name,
        },
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={() => cardPress(item)}
      activeOpacity={0.7}
      style={styles.container}
    >
      <Image
        placeholder={blurhash}
        style={styles.image}
        contentFit="cover"
        source={{
          uri: CONFIG.TMBDImageServicesBaseUrl + item?.poster_path,
        }}
      />
      <View style={styles.overlayContainer}>
        <LinearGradient
          start={[0, 1]}
          end={[0, 0]}
          colors={[dominantColor, "transparent"]}
          style={styles.overlay}
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={{ width: "75%" }} center size={15}>
          {getGenreNames(item?.genre_ids)}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.playButton} onPress={playPress}>
            <FontAwesome name="play" size={24} color="black" />
            <Text marginL-8 color="black" size={15}>
              Oynat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[{ backgroundColor: dominantColor }, styles.listButton]}
          >
            <Feather name="plus" size={25} color="white" />
            <Text marginL-8 size={15}>
              Listem
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "85%",
    height: 480,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 30,
    },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 5,
    backgroundColor: "black",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "80%",
  },
  overlay: {
    width: "100%",
    height: "100%",
    opacity: 0.9,
    borderRadius: 20,
  },
  contentContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    padding: 20,
  },
  playButton: {
    width: "47%",
    height: 40,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  listButton: {
    width: "47%",
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  buttonText: {
    marginLeft: 7,
    fontWeight: "600",
  },
  listButtonText: {
    color: "white",
  },
});

export default BigCard;
