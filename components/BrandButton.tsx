import { Pressable, type PressableProps, StyleSheet } from "react-native";
import { BrandText } from "./BrandText";
import { ThemeColors } from "../constants/Colors";

export type BrandButtonProps = PressableProps & {
  type: 'primary1' | 'primary2' | 'ghost';
}

export default function BrandButton({ style, disabled = false, onPress, type = 'primary1', children, ...rest }: BrandButtonProps) {
  return (
    <Pressable
      style={[
        styles.button,
        type === 'primary1' ? styles.primary1 : undefined,
        type === 'primary2' ? styles.primary2 : undefined,
        type === 'ghost' ? styles.ghost : undefined,
        disabled ? styles.disabled : undefined,
        style
      ]}
      disabled={disabled}
      onPress={onPress}
      {...rest}
  >
      <BrandText type='cardTitle' style={[
        type === 'primary1' ? styles.textPrimary1 : undefined,
        type === 'primary2' ? styles.textPrimary2 : undefined,
        type === 'ghost' ? styles.textGhost : undefined,
        disabled ? styles.textDisabled : undefined
      ]}>{children}</BrandText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center'
  },
  primary1: {
    backgroundColor: ThemeColors.primary1
  },
  primary2: {
    backgroundColor: ThemeColors.primary2,
    borderWidth: 2,
    borderColor: ThemeColors.secondary1
  },
  ghost: {
    borderWidth: 2,
    borderColor: '#777777'
  },
  disabled: {
    backgroundColor: ThemeColors.secondary3,
    borderColor: ThemeColors.secondary3,
  },
  textPrimary1: {
    color: ThemeColors.secondary3
  },
  textPrimary2: {
    color: ThemeColors.secondary4
  },
  textGhost: {
    color: '#777777'
  },
  textDisabled: {
    color: '#999999'
  },
});