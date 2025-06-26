import React from "react";
import "./AnimatedIcon.css";

const AnimatedIcon = ({
  type = "emoji",
  name,
  emoji,
  size = "md",
  animation = "bounce",
  className = "",
  ...props
}) => {
  // Mapping des icônes avec leurs animations
  const iconMap = {
    // Icônes culinaires
    recipe: { emoji: "🍽️", animation: "float" },
    cooking: { emoji: "🍳", animation: "shake" },
    chef: { emoji: "👨‍🍳", animation: "bounce" },
    favorite: { emoji: "❤️", animation: "pulse" },
    star: { emoji: "⭐", animation: "twinkle" },

    // Icônes d'interface
    home: { emoji: "🏠", animation: "sway" },
    search: { emoji: "🔍", animation: "zoom" },
    user: { emoji: "👤", animation: "bounce" },
    settings: { emoji: "⚙️", animation: "rotate" },
    notification: { emoji: "🔔", animation: "ring" },

    // Icônes alimentaires
    bread: { emoji: "🍞", animation: "float" },
    cake: { emoji: "🎂", animation: "bounce" },
    pizza: { emoji: "🍕", animation: "spin" },
    burger: { emoji: "🍔", animation: "shake" },
    salad: { emoji: "🥗", animation: "sway" },
    soup: { emoji: "🍲", animation: "steam" },

    // Icônes de réaction
    fire: { emoji: "🔥", animation: "flicker" },
    sparkle: { emoji: "✨", animation: "twinkle" },
    party: { emoji: "🎉", animation: "confetti" },
    thumbs_up: { emoji: "👍", animation: "bounce" },

    // Icônes utilitaires
    clock: { emoji: "⏰", animation: "tick" },
    check: { emoji: "✅", animation: "check" },
    warning: { emoji: "⚠️", animation: "warning" },
    info: { emoji: "💡", animation: "glow" },
  };

  // Récupérer l'icône et l'animation
  const iconData = name ? iconMap[name] : { emoji, animation };
  const finalEmoji = iconData?.emoji || emoji || "❓";
  const finalAnimation = iconData?.animation || animation;

  const iconClass = [
    "animated-icon",
    `animated-icon--${size}`,
    `animated-icon--${finalAnimation}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (type === "emoji") {
    return (
      <span
        className={iconClass}
        role="img"
        aria-label={name || "icon"}
        {...props}
      >
        {finalEmoji}
      </span>
    );
  }

  // Pour d'autres types d'icônes (SVG, etc.) dans le futur
  return (
    <div className={iconClass} {...props}>
      {finalEmoji}
    </div>
  );
};

export default AnimatedIcon;
