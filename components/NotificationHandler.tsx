import { ReactNode } from "react";
import { NotificationPayload } from "@/models/NotificationPayload";
import { useNotificationHandler } from "@/hooks/NotificationHandlerHook";

interface HandlerComponentProps {
    handle: (payload: NotificationPayload) => void;
    key?: string;
    isPermanent?: boolean;
    children?: ReactNode;
}

const NotificationHandler = ({
    handle,
    children,
    key,
    isPermanent = false,
}: HandlerComponentProps) => {
    useNotificationHandler({
        handle: handle,
        key: key,
        isPermanent: isPermanent,
    });

    return <>{children}</>;
};

export default NotificationHandler;
