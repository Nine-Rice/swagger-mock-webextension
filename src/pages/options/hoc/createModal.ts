import NiceModal from "@ebay/nice-modal-react";
import { uniqueId } from "lodash";

const createModal = <P extends object, R>(Comp: React.ComponentType<P>) => {
  const customModal = NiceModal.create(Comp);
  const modalId: string = uniqueId("CUSTOM_MODAL_");

  NiceModal.register(modalId, customModal);

  return Object.assign(customModal, {
    show(props?: P) {
      return NiceModal.show<R, P>(modalId, props);
    },
    hide() {
      return NiceModal.hide(modalId);
    },
    remove() {
      return NiceModal.remove(modalId);
    },
  });
};

export default createModal;
