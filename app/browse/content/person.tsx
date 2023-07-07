import { useRouter, useSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text, View } from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { useAppDispatch, useAppSelector } from "../../../src/hooks/redux";
import { getCredits } from "../../../src/redux/person";
import DefaultCard from "../../../src/components/cards/default-card";
import CONFIG from "../../../src/config/tmbd";

type PersonDetailParams = {
  id: string;
  name: string;
};

const Header = ({ title }) => {
  const router = useRouter();

  const backPress = () => {
    router.back();
  };

  const closePress = () => {
    router.back();
    router.back();
    router.back();
  };

  return (
    <View
      row
      width={"100%"}
      center
      height={50}
      backgroundColor="#121212"
      paddingH-10
    >
      <View width={"10%"}>
        <TouchableOpacity onPress={backPress} style={styles.headerButton}>
          <Ionicons name="chevron-back" color={"white"} size={25} />
        </TouchableOpacity>
      </View>
      <View width={"80%"} center>
        <Text color="#B3B3B3">{title}</Text>
      </View>
      <View width={"10%"}>
        <TouchableOpacity onPress={closePress} style={styles.headerButton}>
          <Ionicons name="close" color={"white"} size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PersonDetail = () => {
  const { id, name } = useSearchParams<PersonDetailParams>();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const getCreditsResult = useAppSelector(
    (state) => state.person.getCreditsResult
  );

  const getPersonCredits = async () => {
    await dispatch(getCredits(id));
  };

  const itemPress = (item) => {
    router.back();
    router.replace({
      pathname: "/browse/content",
      params: {
        id: `${item?.id}-${item?.title ? 1 : 2}`,
      },
    });
  };

  useEffect(() => {
    getPersonCredits();
  }, []);

  return (
    <View flex backgroundColor="black">
      <Header title={name} />

      <ScrollView contentContainerStyle={styles.mainScrollViewContentContainer}>
        {getCreditsResult?.map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            <DefaultCard
              onPress={(item) => itemPress(item)}
              item={item}
              uri={CONFIG.TMBDImageServicesBaseUrl + item?.poster_path}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    width: 35,
    height: 35,
    backgroundColor: "#212121",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  mainScrollViewContentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 5,
  },
  cardWrapper: { width: "33%", paddingHorizontal: 5, paddingBottom: 10 },
});

export default PersonDetail;
