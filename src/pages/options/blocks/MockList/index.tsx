import OptionsLayout from "../../layout";
import Container from "../../layout/Container";
import MockTable from "./MockTable";

const MockList = () => {
  return (
    <OptionsLayout title="Mock接口">
      <Container
        title="接口列表"
        descList={["网络通配符", "*匹配零个或者多个字符。"]}
      >
        <MockTable></MockTable>
      </Container>
    </OptionsLayout>
  );
};

export default MockList;
