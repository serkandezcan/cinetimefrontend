"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "./input.module.scss";

const Input = forwardRef(function Input(
  { label, name, error, helperText, type = "text", className = "", ...rest },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={name} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          ref={ref}
          id={name}
          name={name}
          type={resolvedType}
          className={`${styles.input} ${isPassword ? styles.hasIcon : ""} ${
            error ? styles.inputError : ""
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${name}-error`} className={styles.errorText} role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className={styles.helperText}>{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;