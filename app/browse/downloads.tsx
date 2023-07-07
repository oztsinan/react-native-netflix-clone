import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "react-native-ui-lib";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      absT
    >
      <Text bold size={24}>
        İndirilenler
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

const Button = ({
  title,
  backgroundColor,
  textColor,
  width,
}: {
  title: string;
  backgroundColor: string;
  textColor: string;
  width?: string | number;
}) => {
  return (
    <TouchableOpacity
      style={[{ backgroundColor, width }, styles.buttonContainer]}
    >
      <Text color={textColor}>{title}</Text>
    </TouchableOpacity>
  );
};

const DownloadsScreen = () => {
  return (
    <View flex backgroundColor="black">
      <ScrollView contentContainerStyle={styles.mainContentContainerStyle}>
        <Text marginB-15 size="xl">
          Sizin İçin İndirilenler Özelliği
        </Text>
        <Text regular center color="#8C8C8C" marginB-20>
          Cihazınızda her zaman izleyecek bir şeyleriniz olsun diye dizi ve
          filmlerden size özel seçtiğimiz bazı içerikleri indireceğiz.
        </Text>
        <Image
          resizeMode="contain"
          style={{ width: "100%", height: 250, marginBottom: 40 }}
          source={require("../../src/assets/images/downloads-screen-image.png")}
        />
        <Button
          width={"90%"}
          title="Ayarla"
          backgroundColor={"#4B69E4"}
          textColor="white"
        />
        <Button
          title="İndirebileceklerinizi Görün"
          backgroundColor={"white"}
          textColor="black"
        />
      </ScrollView>
      <Header />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
    marginVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContentContainerStyle: {
    paddingHorizontal: 35,
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
  },
});

export default DownloadsScreen;
