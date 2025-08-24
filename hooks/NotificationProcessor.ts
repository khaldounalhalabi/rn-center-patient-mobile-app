import { useContext } from "react";
import { NotificationHandler, NotificationsHandlersContext } from "@/components/providers/NotificationProvider";
import { NotificationPayload } from "@/models/NotificationPayload";

const useNotificationProcessor = (
    handleFunction: (payload: NotificationPayload) => void,
    isPermanent: boolean,
    key?: string,
) => {
    const setHandlers = useContext(NotificationsHandlersContext);

    const process = () => {
        if (!key) {
            key = handleFunction.toString().replace(/\s+/g, "");
        }

        const filterHandlers = (handlers: NotificationHandler[]) => {
            if (
                handlers.filter(
                    (handler) => handler.key == key && handler.is_active,
                ).length > 0
            ) {
                return handlers;
            }

            const filteredHandlers = handlers
                .map((item) =>
                    item.is_active && !item.is_permanent
                        ? { ...item, is_active: false }
                        : item,
                )
                .filter((item) => item.is_permanent || item.is_active);

            return [
                ...filteredHandlers,
                {
                    fn: handleFunction,
                    is_active: true,
                    key: key,
                    is_permanent: isPermanent,
                },
            ];
        };

        if (setHandlers) {
            setHandlers((prev) => filterHandlers(prev));
        }
    };

    return { process };
};

export default useNotificationProcessor;
