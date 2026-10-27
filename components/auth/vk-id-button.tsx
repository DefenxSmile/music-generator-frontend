import { ProviderButton } from "@/components/auth/provider-button";
import { VkMark } from "@/components/auth/vk-mark";

/** Official mark and label. Colors and wording stay as the provider publishes them. */
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
