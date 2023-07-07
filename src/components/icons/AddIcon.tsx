import { Path, Svg } from "react-native-svg";

const AddIcon = () => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9 9L9 0H11L11 9L20 9V11L11 11L11 20H9L9 11L0 11V9L9 9Z"
        fill="white"
        strokeWidth={1}
        stroke={"white"}
      />
    </Svg>
  );
};

export default AddIcon;
