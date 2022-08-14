import { Portal } from "solid-js/web";
import { Component, createSignal, JSX, onCleanup, onMount } from "solid-js";

const DEFAULT_THRESHOLD = 50;

export interface BaseSolidBottomsheetProps {
  children: JSX.Element;
  onClose: () => void;
}

export interface DefaultVariantProps extends BaseSolidBottomsheetProps {
  variant: "default";
}

export interface SnapVariantProps extends BaseSolidBottomsheetProps {
  variant: "snap";
  defaultSnapPoint: ({ maxHeight }: { maxHeight: number }) => number;
  snapPoints: ({ maxHeight }: { maxHeight: number }) => number[];
}

export type SolidBottomsheetProps = DefaultVariantProps | SnapVariantProps;

export const SolidBottomsheet: Component<SolidBottomsheetProps> = (props) => {
  const isSnapVariant = props.variant === "snap";

  const [maxHeight, setMaxHeight] = createSignal(window.visualViewport.height);

  const snapPoints = isSnapVariant
    ? [0, ...props.snapPoints({ maxHeight: maxHeight() }).sort((a, b) => b - a)]
    : [];

  let touchStartPosition = 0;
  let lastTouchPosition = 0;

  const onViewportChange = () => {
    setMaxHeight(window.visualViewport.height);
  };

  onMount(() => {
    document.body.classList.add("sb-overflow-hidden");
    window.visualViewport.addEventListener("resize", onViewportChange);
  });

  onCleanup(() => {
    document.body.classList.remove("sb-overflow-hidden");
    window.visualViewport.removeEventListener("resize", onViewportChange);
  });

  const [isClosing, setIsClosing] = createSignal(false);
  const [isSnapping, setIsSnapping] = createSignal(false);
  const [bottomsheetTranslateValue, setBottomsheetTranslateValue] =
    createSignal(
      isSnapVariant ? props.defaultSnapPoint({ maxHeight: maxHeight() }) : 0
    );

  const onTouchStart: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (
    event
  ) => {
    isSnapVariant && setIsSnapping(false);

    touchStartPosition = lastTouchPosition = event.touches[0].clientY;
  };

  const onTouchMove: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (
    event
  ) => {
    let dragDistance = 0;
    switch (props.variant) {
      case "snap":
        dragDistance = event.touches[0].clientY - lastTouchPosition;

        setBottomsheetTranslateValue((previousVal) =>
          Math.min(Math.max(previousVal + dragDistance, 0), maxHeight())
        );

        lastTouchPosition = event.touches[0].clientY;

        break;
      case "default":
      default:
        lastTouchPosition = event.touches[0].clientY;
        dragDistance = lastTouchPosition - touchStartPosition;

        if (dragDistance > 0) {
          setBottomsheetTranslateValue(dragDistance);
        }

        break;
    }
  };

  const onTouchEnd: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = () => {
    switch (props.variant) {
      case "snap":
        const currentPoint = maxHeight() - lastTouchPosition;

        const closest = snapPoints.reduce((previousVal, currentVal) => {
          return Math.abs(currentVal - currentPoint) <
            Math.abs(previousVal - currentPoint)
            ? currentVal
            : previousVal;
        });

        if (closest === 0) {
          setIsClosing(true);
          break;
        }

        setIsSnapping(true);
        setBottomsheetTranslateValue(maxHeight() - closest);

        break;
      case "default":
      default:
        if (lastTouchPosition - touchStartPosition > DEFAULT_THRESHOLD) {
          setIsClosing(true);
        } else {
          setBottomsheetTranslateValue(0);
        }

        break;
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
            "sb-is-snapping": isSnapping(),
          }}
          style={{
            transform: `translateY(${bottomsheetTranslateValue()}px)`,
            ...(isSnapVariant ? { height: `${maxHeight()}px` } : {}),
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
