"use client";

import NumberFlow from "@number-flow/react";

interface AnimatedPriceProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedPrice({
  value,
  prefix = "$",
  suffix,
  className,
}: AnimatedPriceProps) {
  return (
    <span className={className}>
      {prefix}
      <NumberFlow
        value={value}
        transformTiming={{
          duration: 500,
          easing: "ease-out",
        }}
        willChange
        style={{ fontVariantNumeric: "tabular-nums" }}
      />
      {suffix}
    </span>
  );
}
