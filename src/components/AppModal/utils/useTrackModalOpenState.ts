import { useEffect, useRef } from 'react';
import { store } from 'src/store/store';
import { setCloseModal, setOpenModal } from 'src/store/ui';
import { useAppDispatch } from 'src/utils/useAppStore';

export const useTrackModalOpenState = (isVisible: boolean) => {
  const dispatch = useAppDispatch();
  const isVisibleRef = useRef(false);
  const modalIdRef = useRef<number>();

  useEffect(() => {
    if (isVisible) {
      if (!isVisibleRef.current) {
        modalIdRef.current = store.getState().ui.modalIdCounter + 1;
        dispatch(setOpenModal(modalIdRef.current));
      }
    } else {
      if (isVisibleRef.current && typeof modalIdRef.current === 'number') {
        dispatch(setCloseModal(modalIdRef.current));
      }
    }

    isVisibleRef.current = isVisible;
  }, [dispatch, isVisible]);

  return modalIdRef;
};
