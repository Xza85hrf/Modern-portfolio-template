import { useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import githubAnimation from "@/assets/github-logo.json";
import { cn } from "@/lib/utils";
import { useSocial } from "@/lib/config-context";

interface AnimatedGithubIconProps {
  className?: string;
  size?: number;
  href?: string;
  playOnHover?: boolean;
}

export function AnimatedGithubIcon({
  className,
  size = 32,
  href,
  playOnHover = true,
}: AnimatedGithubIconProps) {
  const social = useSocial();
  // Use prop if provided, otherwise use config
  const githubHref = href ?? social.github;
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  const handleMouseEnter = () => {
    if (playOnHover && lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    if (playOnHover && lottieRef.current) {
      lottieRef.current.stop();
    }
  };

  const iconElement = (
    <div
      className={cn(
        "flex items-center justify-center transition-transform hover:scale-110",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ width: size, height: size }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={githubAnimation}
        loop={true}
        autoplay={!playOnHover}
        style={{ width: size, height: size }}
      />
    </div>
  );

  if (githubHref) {
    return (
      <a
        href={githubHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub Profile"
        className="inline-flex"
      >
        {iconElement}
      </a>
    );
  }

  return iconElement;
}
