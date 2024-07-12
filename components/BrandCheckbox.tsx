import Checkbox from "expo-checkbox";
import { View, StyleSheet } from "react-native";
import { BrandText } from "./BrandText";
import { ThemeColors } from "../constants/Colors";

export type BrandCheckboxProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void
}

export default function BrandCheckbox({ label, value, onValueChange }: BrandCheckboxProps) {
  return (
    <View style={styles.checkboxField}>
      <Checkbox value={value} onValueChange={onValueChange} color={ThemeColors.primary1} />
      <BrandText type='highlightText' style={styles.checkboxLabel} colorName='primary1'>{label}</BrandText>
    </View>
  );
}


const styles = StyleSheet.create({
  checkboxField: {
    flexDirection: 'row',
    marginBottom: 20
  },
  checkboxLabel: {
    marginLeft: 10
  }
});