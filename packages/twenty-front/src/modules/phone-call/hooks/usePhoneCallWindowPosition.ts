import { PHONE_CALL_WINDOW_POSITION_STORAGE_KEY } from '@/phone-call/constants/PhoneCallWindowPositionStorageKey';
import {
  clampPhoneCallWindowPosition,
  type PhoneCallWindowPosition,
} from '@/phone-call/utils/clampPhoneCallWindowPosition';
import {
  type PointerEvent as ReactPointerEvent,
  type RefObject,
  useState,
} from 'react';
import { isDefined } from 'twenty-shared/utils';

const readStoredPosition = (): PhoneCallWindowPosition | null => {
  try {
    const storedPosition = JSON.parse(
      localStorage.getItem(PHONE_CALL_WINDOW_POSITION_STORAGE_KEY) ?? 'null',
    );

    return typeof storedPosition?.x === 'number' &&
      typeof storedPosition?.y === 'number'
      ? storedPosition
      : null;
  } catch {
    return null;
  }
};

export const usePhoneCallWindowPosition = (
  windowRef: RefObject<HTMLElement | null>,
) => {
  const [position, setPosition] = useState(readStoredPosition);

  const handleDragStart = (event: ReactPointerEvent<HTMLElement>) => {
    const windowElement = windowRef.current;

    if (
      !isDefined(windowElement) ||
      event.button !== 0 ||
      (event.target as HTMLElement).closest('button')
    ) {
      return;
    }

    const windowRect = windowElement.getBoundingClientRect();
    const offset = {
      x: event.clientX - windowRect.left,
      y: event.clientY - windowRect.top,
    };
    const handleElement = event.currentTarget;
    let latestPosition: PhoneCallWindowPosition = {
      x: windowRect.left,
      y: windowRect.top,
    };

    handleElement.setPointerCapture(event.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      latestPosition = clampPhoneCallWindowPosition({
        position: {
          x: moveEvent.clientX - offset.x,
          y: moveEvent.clientY - offset.y,
        },
        windowSize: { width: windowRect.width, height: windowRect.height },
        viewportSize: { width: window.innerWidth, height: window.innerHeight },
      });
      setPosition(latestPosition);
    };

    const handlePointerUp = () => {
      handleElement.removeEventListener('pointermove', handlePointerMove);
      handleElement.removeEventListener('pointerup', handlePointerUp);
      localStorage.setItem(
        PHONE_CALL_WINDOW_POSITION_STORAGE_KEY,
        JSON.stringify(latestPosition),
      );
    };

    handleElement.addEventListener('pointermove', handlePointerMove);
    handleElement.addEventListener('pointerup', handlePointerUp);
  };

  const resetPosition = () => {
    localStorage.removeItem(PHONE_CALL_WINDOW_POSITION_STORAGE_KEY);
    setPosition(null);
  };

  return { position, handleDragStart, resetPosition };
};
