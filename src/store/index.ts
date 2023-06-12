import { storageDataMap } from "@src/storage";

const store = proxy({
  ...storageDataMap,
});

export default store;
