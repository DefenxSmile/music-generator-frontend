import { ProviderButton } from "@/components/auth/provider-button";
import { YandexMark } from "@/components/auth/yandex-mark";

/** Official mark and label. Colors and wording stay as the provider publishes them. */
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
