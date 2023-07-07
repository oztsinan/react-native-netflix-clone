import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ orientation: "portrait_up" }} />
      <Stack.Screen name="person" options={{ orientation: "portrait_up" }} />
      <Stack.Screen
        name="watch"
        options={{
          presentation: "fullScreenModal",
          orientation: "landscape_left",
        }}
      />
    </Stack>
  );
};

export default StackLayout;
