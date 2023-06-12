import { MockTreeItem } from "./generateMockTree";

const mockTreeMap = (
  mockTree: MockTreeItem[],
  mapFn: (item: MockTreeItem) => MockTreeItem
): MockTreeItem[] => {
  return mockTree.map((item) => {
    if (item.children) {
      return mapFn({
        ...item,
        children: mockTreeMap(item.children, mapFn),
      });
    }
    return mapFn(item);
  });
};

export default mockTreeMap;
