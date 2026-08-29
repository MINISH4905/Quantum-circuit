interface AgreementBannerProps {
  agreement: boolean | null;
  loading: boolean;
}

export function AgreementBanner({ agreement, loading }: AgreementBannerProps) {
  if (loading) {
    return <div className="agreement-banner is-loading">Running simulations on all backends...</div>;
  }

  if (agreement === null) return null;

  return (
    <div className={`agreement-banner ${agreement ? "is-agree" : "is-disagree"}`}>
      {agreement
        ? "All backends agree — statevectors match within tolerance"
        : "Backends disagree — statevectors differ (check qubit ordering)"}
    </div>
  );
}
