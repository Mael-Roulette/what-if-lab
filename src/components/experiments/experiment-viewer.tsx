import { ExperienceType } from "@/types";
import ProjectileMotion from "./simulations/projectile-motion";

type ExperimentViewerProps = {
  experienceType: ExperienceType;
};

export default function ExperimentViewer({
  experienceType,
}: ExperimentViewerProps) {
  return (
    <div>
      <p>Selected experience: {experienceType}</p>

      <ProjectileMotion />
    </div>
  );
}