import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Animated from "react-native-reanimated";
import { Text, View } from "react-native-ui-lib";
import CONFIG from "../../config/tmbd";
import { Movie } from "../../types/movie";
import { Serie } from "../../types/serie";

type DefaultRowListProps = {
  title: string;
  rowIndex?: number;
  onPress?: (item: Movie | Serie) => void;
  data: Movie[] | Serie[];
};

const Card = ({
  item,
  onPress,
  rowIndex,
}: {
  item: any;
  onPress: (item) => void;
  rowIndex?: number;
}) => {
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => onPress(item)}
    >
      <View center width={"100%"} height={"100%"} absV>
        <Text regular center>
          {item?.name ?? item?.title}{" "}
        </Text>
      </View>
      <Animated.Image
        sharedTransitionTag={`${item.id}-${rowIndex}`}
        style={styles.cardImage}
        source={{
          uri: CONFIG.TMBDImageServicesBaseUrl + item?.poster_path,
        }}
      />
    </TouchableOpacity>
  );
};

const DefaultRowList = ({
  title,
  data,
  rowIndex,
  onPress,
}: DefaultRowListProps) => {
  return (
    <View width={"100%"}>
      <Text marginL-15 marginT-35 marginB-10 size={19} color="white">
        {title}
      </Text>
      <View width={"100%"} height={180}>
        <FlatList
          horizontal
          data={data}
          contentContainerStyle={{ paddingLeft: 15 }}
          keyExtractor={(item, index) => "key" + index}
          renderItem={({ item }) => (
            <Card
              rowIndex={rowIndex}
              item={item}
              onPress={(item) => onPress(item)}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: { width: 110, height: "100%", marginRight: 10 },
  cardImage: {
    height: "100%",
    width: "100%",
    borderRadius: 5,
  },
});

export default DefaultRowList;
