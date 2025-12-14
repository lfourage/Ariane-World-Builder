import Image from "next/image";
import { hero } from "@styles";

export function HeroSection() {
  const styles = hero();

  return (
    <div className="space-y-4">
      <div className={styles.logo()}>
        <Image
          src="/BobinIcon.svg"
          alt="Logo of Ariane : a green sewing spool"
          width={80}
          height={80}
          className="w-20 h-20"
        />
      </div>
      <h1 className={styles.title()}>Ariane World Builder</h1>
      <p className={styles.subtitle()}>
        Create, visualize, and organize your story events in an interactive flowchart.
      </p>
    </div>
  );
}
