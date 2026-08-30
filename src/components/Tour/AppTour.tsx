import { useEffect } from "react";
import { Joyride, STATUS, type EventData } from "react-joyride";
import { useTour } from "../../context/TourContext";
import { TOUR_STEPS } from "./tourSteps";

export const TOUR_SEEN_KEY = "qcl_tour_seen";

/** Guided tour of the circuit simulator page. Styled to match the app's dark
 * theme via its existing CSS custom properties (see App.css :root) rather
 * than hardcoded colors, so it stays in sync if the theme changes. */
export function AppTour() {
  const { run, startTour, stopTour } = useTour();

  useEffect(() => {
    if (window.localStorage.getItem(TOUR_SEEN_KEY) !== "true") {
      startTour();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEvent = (data: EventData) => {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      window.localStorage.setItem(TOUR_SEEN_KEY, "true");
      stopTour();
    }
  };

  return (
    <Joyride
      run={run}
      steps={TOUR_STEPS}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      locale={{ last: "Finish" }}
      options={{
        primaryColor: "var(--accent)",
        backgroundColor: "var(--panel)",
        textColor: "var(--text)",
        arrowColor: "var(--panel)",
        overlayColor: "rgba(0, 0, 0, 0.65)",
        showProgress: true,
        buttons: ["back", "close", "skip", "primary"],
      }}
    />
  );
}
