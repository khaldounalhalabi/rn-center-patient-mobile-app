import useUser from "@/hooks/UserHook";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Text } from "../ui/text";

const ProfileButton = () => {
  const { user } = useUser();
  const router = useRouter();
  if (!user) return <></>;
  return (
    <Pressable
      onPress={() => {
        router.push("/account");
      }}
    >
      <Avatar alt="User Profile Button">
        <AvatarFallback>
          <Text>
            {user?.first_name?.charAt(0)}
            {user?.last_name?.charAt(0)}
          </Text>
        </AvatarFallback>
      </Avatar>
    </Pressable>
  );
};

export default ProfileButton;
