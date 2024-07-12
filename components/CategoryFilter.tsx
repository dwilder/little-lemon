import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { BrandText } from "./BrandText";
import { useCallback } from "react";
import { ThemeColors } from "../constants/Colors";

type CategoryType = {
  category: string;
  isSelected: boolean;
}

type ToggleCategoryType = (category: string) => void;

type CategoryButtonProps = {
  category: string;
  isSelected: boolean;
  toggleCategory: ToggleCategoryType
}

const CategoryButton = ({ category, isSelected, toggleCategory }: CategoryButtonProps) => {
  return (
    <Pressable
      style={[
        styles.buttonContainer,
        isSelected ? styles.buttonSelected : styles.buttonDeselected
      ]}
      onPress={() => toggleCategory(category)}
    
    >
      <BrandText
        type='highlightText'
        style={styles.buttonText}
        colorName={isSelected ? 'secondary3' : 'secondary4'}
      >{category}</BrandText>
    </Pressable>
  )
}

type CategoryFilterProps = {
  categories: string[];
  activeCategories: string[];
  toggleCategory: ToggleCategoryType
}

export default function CategoryFilter({ categories, activeCategories, toggleCategory }: CategoryFilterProps) {
  const renderItem = useCallback(({ index, item }: { index: number, item: string}) => {
    return <CategoryButton category={item} isSelected={activeCategories.includes(item)} toggleCategory={toggleCategory} />
  }, [toggleCategory, activeCategories]);

  return (
    <View style={styles.container}>
      <BrandText type='sectionTitle' style={styles.title}>Order for Delivery</BrandText>
      <FlatList
        horizontal={true}
        data={categories}
        renderItem={renderItem}
      />
      <View style={styles.separator} />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40
  },
  separator: {
    paddingTop: 30,
    marginHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: ThemeColors.secondary3
  },
  title: {
    marginLeft: 20,
    marginBottom: 20
  },
  buttonContainer: {
    padding: 10,
    borderRadius: 16,
    marginLeft: 20
  },
  buttonSelected: {
    backgroundColor: ThemeColors.primary1
  },
  buttonDeselected: {
    backgroundColor: ThemeColors.secondary3
  },
  buttonText: {
    textTransform: 'capitalize'
  }
})