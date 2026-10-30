import { ExperimentType } from "@/types";
import ProjectileMotion from "./simulations/projectile-motion";

type ExperimentViewerProps = {
  experimentType: ExperimentType;
};

export default function ExperimentViewer({
  experimentType,
}: ExperimentViewerProps) {
  return (
    <div>
      <p>Selected experience: {experimentType}</p>

      <ProjectileMotion />
    </div>
  );
}