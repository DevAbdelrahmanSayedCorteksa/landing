import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Unbounded } from "next/font/google";

const unbounded = Unbounded({ subsets: ["latin"] });

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2")}>
      <LogoIcon />
      <span className={cn("text-base font-semibold text-neutral-600 dark:text-neutral-200", unbounded.className)}>
        Corteksa
      </span>
    </Link>
  );
};

export const LogoIcon = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} className={cn("relative", props.className)}>
      <Image
        src="/Corteksa.svg"
        alt="Corteksa Logo"
        width={28}
        height={28}
        className="w-7 h-7"
      />
    </div>
  );
};
