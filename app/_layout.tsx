import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../src/redux";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

const StackLayout = () => {
  const screenOptions = { headerShown: false };

  return (
    <Provider store={store}>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="browse" />
      </Stack>
    </Provider>
  );
};

export default StackLayout;
