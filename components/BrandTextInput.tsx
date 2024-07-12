import { TextInput as RNTextInput, StyleSheet, type TextInputProps } from "react-native";
import { BrandText } from "./BrandText";
import { ThemeColors } from "../constants/Colors";
import { MaskedTextInput } from "react-native-mask-text";

export type BrandTextInputProps = TextInputProps & {
  label?: string;
  errorMessage?: string;
  mask?: string;
}

export default function BrandTextInput({ label, onChangeText, mask, errorMessage, ...rest }: BrandTextInputProps) {
  return (
    <>
      <BrandText type='highlightText' style={styles.label}>{label}</BrandText>
      {mask ? (
        <MaskedTextInput
          mask={mask}
          style={styles.input}
          onChangeText={(_, rawText) => {
            onChangeText?.(rawText);
          }}
        />
      ) : (
        <RNTextInput
          style={styles.input}
          onChangeText={onChangeText}
          { ...rest }
        />
      )}
      <BrandText color='red' style={styles.errorMessage}>{errorMessage}</BrandText>
    </>
  )
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 10
  },
  input: {
    borderWidth: 2,
    borderColor: '#999999',
    borderRadius: 12,
    fontSize: 18,
    padding: 10,
    color: ThemeColors.secondary4,
    backgroundColor: '#FFFFFF'
  },
  errorMessage: {
    marginBottom: 20
  }
});