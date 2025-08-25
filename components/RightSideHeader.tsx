import useUser from "@/hooks/UserHook";
import { LanguageToggleButton } from "./LanguageToggleButton";
import { ThemeToggle } from "./ui/ThemeToggleButton";

const RightSideHeader = () => {
  const { user } = useUser();
  return (
    <>
      <ThemeToggle />
      <LanguageToggleButton />
      {/* {user && <NotificationsButton />} */}
    </>
  );
};

export default RightSideHeader;
