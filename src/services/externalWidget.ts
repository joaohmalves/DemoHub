type CleanupFunction = () => void;

interface LoadedScript {
  promise: Promise<void>;
  element: HTMLScriptElement;
}

const loadedScripts = new Map<string, LoadedScript>();

/**
 * Loads an external script once and reuses it on subsequent mounts.
 *
 * The script is intentionally kept in the document.
 * The widget itself is responsible for managing the DOM it creates.
 */
export function loadWidgetScript(
  src: string,
  onLoad: () => void
): CleanupFunction {
  let cancelled = false;

  let loaded = loadedScripts.get(src);

  if (!loaded) {
    const script = document.createElement('script');

    script.src = src;
    script.async = true;

    const promise = new Promise<void>((resolve, reject) => {
      script.onload = () => {
        resolve();
      };

      script.onerror = (error) => {
        console.error(
          '[externalWidget] Failed to load external widget:',
          src,
          error
        );

        loadedScripts.delete(src);
        reject(error);
      };
    });

    document.body.appendChild(script);

    loaded = {
      promise,
      element: script,
    };

    loadedScripts.set(src, loaded);
  }

  loaded.promise
    .then(() => {
      if (cancelled) return;

      onLoad();
    })
    .catch((error) => {
      if (cancelled) return;

      console.error(
        '[externalWidget] Widget initialization failed:',
        error
      );
    });

  /**
   * Only cancel the callback.
   *
   * We intentionally do not remove the script or
   * any DOM created by the external widget.
   */
  return () => {
    cancelled = true;
  };
}