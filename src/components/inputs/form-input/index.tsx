"use client";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { HTMLInputTypeAttribute } from "react";

interface FormInputProps {
  label: string;
  id: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  error?: any;
}

const FormInput = ({
  label = "",
  id = "",
  type = "text",
  placeholder = "",
  error,
  ...props
}: FormInputProps) => {
  return (
    <>
      <Field>
        <FieldLabel htmlFor={id}>{label}</FieldLabel>
        <motion.div
          animate={error && { x: [-4, 4, -4, 4, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Input id={id} type={type} placeholder={placeholder} {...props} />
        </motion.div>
        {error && (
          <FieldDescription className="text-red-600">
            {error.message}
          </FieldDescription>
        )}
      </Field>
    </>
  );
};

export default FormInput;
