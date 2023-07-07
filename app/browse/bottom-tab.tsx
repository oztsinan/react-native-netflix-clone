import { BlurView } from "expo-blur";
import { Text, View } from "react-native-ui-lib";
import { Link, usePathname } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HomeIcon from "../../src/components/icons/HomeIcon";
import NewAndPopularIcon from "../../src/components/icons/NewAndPopularIcon";
import DownloadsIcon from "../../src/components/icons/DownloadsIcon";

type ItemProps = {
  title: string;
  icon: ReactNode;
  href: string;
};

const Item = (props: ItemProps) => {
  const pathName = usePathname();

  return (
    <Link
      style={{
        opacity: pathName == props.href ? 1 : 0.5,
      }}
      href={props.href}
    >
      <View center>
        {props.icon}
        <Text center size={10} marginT-5>
          {props.title}
        </Text>
      </View>
    </Link>
  );
};

const BottomTab = () => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <BlurView
        tint="dark"
        intensity={100}
        style={[styles.blurView, { paddingBottom: bottom + 10 }]}
      >
        <Item title="Ana Sayfa" icon={<HomeIcon />} href="/browse/home" />
        <Item
          title="Yeni ve Popüler"
          icon={<NewAndPopularIcon />}
          href="/browse/newAndPopular"
        />
        <Item
          title="İndirilenler"
          icon={<DownloadsIcon />}
          href="/browse/downloads"
        />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "absolute", width: "100%", bottom: 0, zIndex: 99 },
  blurView: {
    width: "100%",
    flexDirection: "row",
    paddingTop: 20,
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
});

export default BottomTab;
