"use client";
import { ApiResponse } from "@/http/Response";
import { useTranslation } from "@/localization";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "react-native";
import LoadingSpinner from "../LoadingSpinner";
import { toast } from "../toast/toast";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

const Form = ({
  children,
  handleSubmit,
  onSuccess,
  defaultValues = {},
  buttonText = undefined,
  showToastMessage = true,
  disabled = false,
  submitButtonClasses = "justify-center",
  onCancel = undefined,
}: {
  className?: string;
  children: React.ReactNode;
  handleSubmit: (data: any) => Promise<ApiResponse<any>>;
  defaultValues?: object | undefined | null;
  onSuccess?: (res: ApiResponse<any>) => void;
  buttonText?: string;
  showToastMessage?: boolean;
  disabled?: boolean;
  defaultButton?: boolean;
  otherSubmitButton?: (isSubmitting: boolean) => React.ReactNode;
  submitButtonClasses?: string;
  onCancel?: () => void;
}) => {
  const { t } = useTranslation();

  if (!buttonText) {
    buttonText = t("components.submit");
  }
  // @ts-ignore
  const methods = useForm({ defaultValues: defaultValues });

  const onSubmit = async (data: any) => {
    const res = await handleSubmit(data);
    if (!res) {
      return;
    }

    if (!res?.hasValidationErrors() && res.code == 200) {
      if (onSuccess) {
        await onSuccess(res);
      }
      if (showToastMessage) {
        toast.success(t("components.success"));
      }
    } else if (res?.hasValidationErrors()) {
      res.fillValidationErrors(methods);
      toast.error(t("components.error"));
    }
    return res;
  };

  return (
    <FormProvider {...methods}>
      <View className="w-full flex flex-col items-start gap-3">{children}</View>
      <View
        className={`flex ${submitButtonClasses} my-5 items-center ${onCancel ? "justify-between" : "justify-end"}`}
      >
        {onCancel && (
          <Button
            variant={"destructive"}
            onPress={() => {
              methods.clearErrors();
              onCancel();
            }}
          >
            <Text>{t("components.cancel")}</Text>
          </Button>
        )}
        <Button
          disabled={methods.formState.isSubmitting || disabled}
          onPress={methods.handleSubmit(onSubmit, (errors, event) => {
            console.log(errors);
          })}
          className="flex flex-row justify-center gap-3 items-center w-full"
        >
          <Text>{buttonText}</Text>
          {methods.formState.isSubmitting && <LoadingSpinner size={16} />}
        </Button>
      </View>
    </FormProvider>
  );
};

export default Form;
