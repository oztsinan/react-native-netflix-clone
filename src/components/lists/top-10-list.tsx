import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native-ui-lib";
import CONFIG from "../../config/tmbd";
import { Serie } from "../../types/serie";
import { Movie } from "../../types/movie";

type Top10ListProps = {
  title: string;
  onPress: (item: { item: Movie | Serie }) => void;
  data: Movie[] | Serie[];
};

const Card = ({ item, index, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <Image
        style={styles.cardImage}
        source={{
          uri: CONFIG.TMBDImageServicesBaseUrl + item?.poster_path,
        }}
      />
      <View style={styles.cardNumberContainer}>
        <Image
          style={styles.cardNumberImage}
          source={{
            uri: `https://www.netflix.com/tudum/top10/images/big_numbers/${
              index + 1
            }.png`,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const Top10List = ({ title, data, onPress }: Top10ListProps) => {
  return (
    <View width={"100%"}>
      <Text marginL-15 marginT-35 marginB-10 size={19} color="white">
        {title}
      </Text>
      <View width={"100%"} height={180}>
        <FlatList
          horizontal
          data={data}
          contentContainerStyle={styles.flatlistContentContainer}
          keyExtractor={(item, index) => "key" + index}
          renderItem={({ item, index }) => (
            <Card item={item} onPress={onPress} index={index} />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardImage: {
    height: "100%",
    width: 110,
    borderRadius: 5,
    marginRight: 10,
    marginLeft: 30,
  },
  cardNumberContainer: {
    position: "absolute",
    width: 110,
    height: "100%",
    justifyContent: "flex-end",
    marginLeft: -20,
  },
  cardNumberImage: {
    width: "100%",
    height: 140,
    marginBottom: -20,
  },
  flatlistContentContainer: { paddingLeft: 15 },
});

export default Top10List;
