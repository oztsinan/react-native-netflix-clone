import { Redirect } from "expo-router";
import FontWrapper from "../src/wrappers/font-wrapper";
import ComponentManagerWrapper from "../src/wrappers/component-manager-wrapper";

const Index = () => {
  return (
    <FontWrapper>
      <ComponentManagerWrapper>
        <Redirect href={"/browse"} />
      </ComponentManagerWrapper>
    </FontWrapper>
  );
};

export default Index;
