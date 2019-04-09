import { useRef, useState } from "react";

interface Args<T> {
  onClick(event: React.MouseEvent<T>): void;
  isLoading: boolean;
}

interface Props<T> {
  onClick(event: React.MouseEvent<T>): Promise<void>;
  /**
   * The delay from when the async actions starts and when the
   * children are notified of this. Used to prevent a "flicker"
   * when an action can take a short amount of time.
   */
  loadingDelay?: number;
  children(args: Args<T>): React.ReactElement;
}

/**
 * Prevents clicks while an async action initiated by
 * a previous click is pending. Used commonly with buttons.
 */
export default function Unspammable<T>(props: Props<T>) {
  const isLoading = useRef(false);
  const [showLoading, setShowLoading] = useState(false);

  const onClick = (event: React.MouseEvent<T>) => {
    if (isLoading.current) return;

    isLoading.current = true;

    const showLoadingTimeout = setTimeout(() => {
      setShowLoading(true);
    }, props.loadingDelay);

    const finishLoading = () => {
      isLoading.current = false;
      setShowLoading(false);
      clearTimeout(showLoadingTimeout);
    };

    props.onClick(event).then(finishLoading, err => {
      finishLoading();
      throw err;
    });
  };

  return props.children({
    onClick,
    isLoading: showLoading,
  });
}
