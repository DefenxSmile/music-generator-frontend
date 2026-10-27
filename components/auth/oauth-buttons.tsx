import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Official marks and labels. Colors and wording stay as the providers publish them. */
export function YandexIdButton({ onClick }: { onClick: () => void }) {
  return (
    <ProviderButton
      onClick={onClick}
      icon={<YandexMark />}
      className="bg-white text-black hover:bg-[#F2F2F2] focus-visible:outline-white"
    >
      Войти с Яндекс ID
    </ProviderButton>
  );
}

export function VkIdButton({ onClick }: { onClick: () => void }) {
  return (
    <ProviderButton
      onClick={onClick}
      icon={<VkMark />}
      className="bg-[#0077FF] text-white hover:opacity-80 focus-visible:outline-white active:opacity-70"
    >
      Войти с VK ID
    </ProviderButton>
  );
}

function ProviderButton({
  onClick,
  icon,
  className,
  children,
}: {
  onClick: () => void;
  icon: ReactNode;
  className: string;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex h-14 w-full items-center rounded-lg px-3.5 text-[17px] font-medium leading-none transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98]",
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute left-3.5 grid size-7 place-items-center">
        {icon}
      </span>
      <span className="w-full text-center">{children}</span>
    </button>
  );
}

function YandexMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#FC3F1D" />
      <path
        fill="#fff"
        d="M13.32 7.666h-.924c-1.694 0-2.585.858-2.585 2.123 0 1.43.725 2.101 2.204 2.934l1.224.695-3.522 5.25H7.41l3.228-4.803c-1.86-1.32-2.896-2.596-2.896-4.754 0-2.717 1.892-4.56 5.478-4.56h3.37v14.117h-2.27V7.666z"
      />
    </svg>
  );
}

/** Mark from the VK ID custom-button example. Even-odd cutout keeps the letters in the button color. */
function VkMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.54648 4.54648C3 6.09295 3 8.58197 3 13.56V14.44C3 19.418 3 21.907 4.54648 23.4535C6.09295 25 8.58197 25 13.56 25H14.44C19.418 25 21.907 25 23.4535 23.4535C25 21.907 25 19.418 25 14.44V13.56C25 8.58197 25 6.09295 23.4535 4.54648C21.907 3 19.418 3 14.44 3H13.56C8.58197 3 6.09295 3 4.54648 4.54648ZM6.79999 10.15C6.91798 15.8728 9.92951 19.31 14.8932 19.31H15.1812V16.05C16.989 16.2332 18.3371 17.5682 18.8875 19.31H21.4939C20.7869 16.7044 18.9535 15.2604 17.8141 14.71C18.9526 14.0293 20.5641 12.3893 20.9436 10.15H18.5722C18.0747 11.971 16.5945 13.6233 15.1803 13.78V10.15H12.7711V16.5C11.305 16.1337 9.39237 14.3538 9.314 10.15H6.79999Z"
      />
    </svg>
  );
}
