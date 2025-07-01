import { useForm, useField } from "vee-validate";
import * as yup from "yup";

export const useLoginFormValidation = (loginMsg: Record<string, string>) => {
  const schema = yup.object({
    email: yup
      .string()
      .email(loginMsg["error-email-invalid"])
      .required(loginMsg["error-email-required"]),
    name: yup
      .string()
      .min(2, loginMsg["error-name-min"])
      .required(loginMsg["error-name-required"])
      .matches(/^[a-zA-Z가-힣0-9 ]*$/, loginMsg["error-name-special"]),
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
