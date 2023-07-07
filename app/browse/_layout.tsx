import { Stack } from "expo-router";
import BottomTab from "./bottom-tab";

const StackLayout = () => {
  const screenOptions = { headerShown: false };

  return (
    <>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="home" />
        <Stack.Screen name="newAndPopular" />
        <Stack.Screen name="downloads" />
        <Stack.Screen name="content" options={{ presentation: "modal" }} />
      </Stack>
      <BottomTab />
    </>
  );
};

export default StackLayout;
