import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "react-native-ui-lib";

const DefaultCard = ({ item, onPress, uri }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
      <View center width={"100%"} height={"100%"} absV>
        <Text regular center>
          {item?.name ?? item?.title}{" "}
        </Text>
      </View>
      <Image
        style={styles.image}
        source={{
          uri,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", height: 190 },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});

export default DefaultCard;
