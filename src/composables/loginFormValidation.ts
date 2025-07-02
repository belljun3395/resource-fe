import { useForm, useField } from "vee-validate";
import * as yup from "yup";
import { useI18n } from "vue-i18n";

export const useLoginFormValidation = () => {
  const { t } = useI18n();

  const schema = yup.object({
    email: yup
      .string()
      .email(t("message.login.error-email-invalid"))
      .required(t("message.login.error-email-required")),
    name: yup
      .string()
      .min(2, t("message.login.error-name-min"))
      .required(t("message.login.error-name-required"))
      .matches(/^[a-zA-Z가-힣0-9 ]*$/, t("message.login.error-name-special")),
  });

  const { handleSubmit, errors, resetForm } = useForm({
    validationSchema: schema,
  });
  const { value: email } = useField<string>("email");
  const { value: name } = useField<string>("name");

  return {
    email,
    name,
    errors,
    handleSubmit,
    resetForm,
  };
};
