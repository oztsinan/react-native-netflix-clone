import { ThemeManager } from "react-native-ui-lib";

const ComponentManagerWrapper = ({ children }) => {
  ThemeManager.setComponentForcedTheme("Text", (props, context) => {
    const sizeControl = () => {
      const sizeList = {
        xs: 12,
        s: 14,
        m: 16,
        l: 18,
        xl: 20,
        xxl: 24,
      };

      if (props.size) {
        if (sizeList[props.size]) {
          return sizeList[props.size];
        } else {
          return props.size;
        }
      } else {
        return sizeList.m;
      }
    };

    const fontFamily = () => {
      if (props.bold) {
        return "Bold";
      } else if (props.light) {
        return "Light";
      } else if (props.regular) {
        return "Regular";
      } else {
        return "Medium";
      }
    };

    return {
      style: [
        {
          fontFamily: fontFamily(),
          fontSize: sizeControl(),
          fontWeight: props.weight ?? 300,
        },
        props.style,
      ],
      color: props.color ? props.color : "white",
    };
  });

  return children;
};

export default ComponentManagerWrapper;
