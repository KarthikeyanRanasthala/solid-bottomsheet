import { Portal } from "solid-js/web";
import { Component, createSignal, JSX, onCleanup, onMount } from "solid-js";

const DEFAULT_THRESHOLD = 50;

export interface SolidBottomsheetProps {
  children: JSX.Element;
  onClose: () => void;
}

export const SolidBottomsheet: Component<SolidBottomsheetProps> = (props) => {
  let touchStartPosition = 0;
  let lastTouchPosition = 0;

  onMount(() => {
    document.body.classList.add("sb-overflow-hidden");
  });

  onCleanup(() => {
    document.body.classList.remove("sb-overflow-hidden");
  });

  const [isClosing, setIsClosing] = createSignal(false);
  const [bottomsheetTranslatePosition, setBottomsheetTranslatePosition] =
    createSignal(0);

  const onTouchStart: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (
    event
  ) => {
    touchStartPosition = event.touches[0].screenY;
  };

  const onTouchMove: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (
    event
  ) => {
    lastTouchPosition = event.touches[0].screenY;

    const dragDistance = lastTouchPosition - touchStartPosition;
    if (dragDistance > 0) {
      setBottomsheetTranslatePosition(dragDistance);
    }
  };

  const onTouchEnd: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = () => {
    if (lastTouchPosition - touchStartPosition > DEFAULT_THRESHOLD) {
      setIsClosing(true);
    } else {
      setBottomsheetTranslatePosition(0);
    }
  };

  const onOverlayClick: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent> = (
    e
  ) => {
    if (e.target.className === "sb-overlay") {
      setIsClosing(true);
    }
  };

  return (
    <Portal>
      <div class="sb-overlay" onClick={onOverlayClick}>
        <div
          classList={{
            "sb-content": true,
            "sb-is-closing": isClosing(),
          }}
          style={{
            transform: `translateY(${bottomsheetTranslatePosition()}px)`,
          }}
          {...(isClosing() ? { onAnimationEnd: props.onClose } : {})}
        >
          <div
            class="sb-handle-container"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div class="sb-handle" />
          </div>
          {props.children}
        </div>
      </div>
    </Portal>
  );
};
