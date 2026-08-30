import { LEARNER_ROLES, ROLE_INFO, type LearnerRole } from "./roles";

interface RoleSelectProps {
  onSelect: (role: LearnerRole) => void;
}

/** First screen of the Learner Module — picks the role that drives the
 * roadmap's stage ordering (see roles.ts). */
export function RoleSelect({ onSelect }: RoleSelectProps) {
  return (
    <div className="lm-role-select">
      <h2 className="lm-role-select-title">Choose Your Learning Path</h2>
      <p className="lm-role-select-subtitle">Your path determines how the roadmap is ordered — you can change it anytime.</p>
      <div className="lm-role-cards">
        {LEARNER_ROLES.map((role) => (
          <button type="button" className="lm-role-card" key={role} onClick={() => onSelect(role)}>
            <h3 className="lm-role-card-title">{ROLE_INFO[role].label}</h3>
            <p className="lm-role-card-blurb">{ROLE_INFO[role].blurb}</p>
            <span className="lm-role-card-cta" aria-hidden="true">
              Start →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
