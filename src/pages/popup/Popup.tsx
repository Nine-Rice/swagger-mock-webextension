// import logo from "@assets/img/logo.svg";

import MockTable from "../options/blocks/MockList/MockTable";
import "uno.css";

const Popup = () => {
  return (
    <div className="App pr-16px">
      {/* <img src={logo} className="App-logo" alt="logo" /> */}
      <a
        href="#"
        onClick={() => {
          browser.runtime.openOptionsPage();
        }}
      >
        设置
      </a>
      <MockTable scene="popup"></MockTable>
    </div>
  );
};

export default Popup;
