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

  const snapPoints = isSnapVariant
    ? [
        0,
        ...props
          .snapPoints({ maxHeight: window.innerHeight })
          .sort((a, b) => b - a),
      ]
    : [];

  let touchStartPosition = 0;
  let lastTouchPosition = 0;

  onMount(() => {
    document.body.classList.add("sb-overflow-hidden");
  });

  onCleanup(() => {
    document.body.classList.remove("sb-overflow-hidden");
  });

  const [isClosing, setIsClosing] = createSignal(false);
  const [isSnapping, setIsSnapping] = createSignal(false);
  const [bottomsheetTranslateValue, setBottomsheetTranslateValue] =
    createSignal(
      isSnapVariant
        ? props.defaultSnapPoint({ maxHeight: window.innerHeight })
        : 0
    );

  const onTouchStart: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (
    event
  ) => {
    isSnapVariant && setIsSnapping(false);

    touchStartPosition = lastTouchPosition = event.touches[0].screenY;
  };

  const onTouchMove: JSX.EventHandlerUnion<HTMLDivElement, TouchEvent> = (
    event
  ) => {
    let dragDistance = 0;
    switch (props.variant) {
      case "snap":
        dragDistance = event.touches[0].clientY - lastTouchPosition;

        setBottomsheetTranslateValue((previousVal) =>
          Math.min(Math.max(previousVal + dragDistance, 0), window.innerHeight)
        );

        lastTouchPosition = event.touches[0].clientY;

        break;
      case "default":
      default:
        lastTouchPosition = event.touches[0].screenY;
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
        const currentPoint = window.innerHeight - lastTouchPosition;

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
        setBottomsheetTranslateValue(window.innerHeight - closest);

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
            "sb-snap-variant": isSnapVariant,
            "sb-is-snapping": isSnapping(),
          }}
          style={{
            transform: `translateY(${bottomsheetTranslateValue()}px)`,
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
