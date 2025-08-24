import { useEffect } from "react";
import useNotificationProcessor from "@/hooks/NotificationProcessor";
import { NotificationPayload } from "@/models/NotificationPayload";

interface HandlerHookProps {
    handle: (payload: NotificationPayload) => void;
    key?: string;
    isPermanent?: boolean;
}

export const useNotificationHandler = ({
    handle,
    key,
    isPermanent = false,
}: HandlerHookProps) => {
    const { process } = useNotificationProcessor(handle, isPermanent, key);
    useEffect(() => {
        process();
    }, [handle, key, isPermanent]);
};
