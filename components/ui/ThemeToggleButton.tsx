import { MoonStar } from "@/lib/icons/MoonStar";
import { Sun } from "@/lib/icons/Sun";
import { useColorScheme } from "@/lib/useColorScheme";
import { Button } from "./button";

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? "light" : "dark";
    setColorScheme(newTheme);
  }

  return (
    <Button
      onPress={toggleColorScheme}
      className="me-2"
      size={"icon"}
      variant={"outline"}
    >
      {isDarkColorScheme ? (
        <MoonStar className="text-foreground" size={23} strokeWidth={1.25} />
      ) : (
        <Sun className="text-foreground" size={24} strokeWidth={1.25} />
      )}
    </Button>
  );
}
