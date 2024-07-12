import { useCallback, useEffect, useState } from "react";
import { View, Text, Alert, Image, FlatList, StyleSheet } from "react-native";
import { BrandText } from "../components/BrandText";
import { ThemeColors } from "../constants/Colors";
import { createTable, filterByQueryAndCategories, getMenuItems, saveMenuItems } from "../utils/database";
import CategoryFilter from "../components/CategoryFilter";
import { useUpdateEffect } from '../utils';
import Hero from "../components/Hero";

const API_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

export type MenuItemType = {
  id?: number;
  title: string;
  description: string;
  price: string;
  imageFileName: string
}

const MenuItem = ({ title, description, price, imageFileName }: MenuItemType ) => {
  return (
    <View style={styles.menuItem}>
      <View style={styles.menuItemContent}>
        <BrandText type='sectionCategory' style={styles.menuItemTitle}>{title}</BrandText>
        <BrandText color='#666666' numberOfLines={2}  style={styles.menuItemDescription}>{description}</BrandText>
        <BrandText type='highlightText'>{`$${price}`}</BrandText>
      </View>
      <View style={styles.menuItemImageContainer}>
        <Image source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${imageFileName}?raw=true` }} style={styles.menuItemImage} />
      </View>
    </View>
  )
}

const ItemSeparator = () => <View style={styles.separator} />

const categories = ['starters', 'mains', 'desserts', 'drinks'];

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {    
    const index = activeCategories.findIndex((cat) => cat === category);
    if (activeCategories.includes(category)) {
      setActiveCategories(activeCategories.filter((cat) => cat !== category));
      return;
    }
    setActiveCategories([ ...activeCategories, category ]);
  }

  const fetchData = async() => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      const menuItems = json.menu?.map(({ name, description, image, price, category }) => ({
        title: name,
        description,
        imageFileName: image,
        price,
        category
      })) || [];
      return menuItems;
    } catch (err) {
      Alert.alert(`Unable to download menu items: ${err.message}`);
      return [];
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await createTable();
        let menuItems = await getMenuItems();
        if (!menuItems.length) {
          menuItems = await fetchData();
          saveMenuItems(menuItems);
        }
        setData(menuItems);
      } catch (e) {
        Alert.alert(e.message);
      }
    })();
  }, []);

  const updateMenuItems = async (q, categories) => {
    try {
      const menuItems = await filterByQueryAndCategories(q, categories);
      setData(menuItems);
    } catch(err) {
      console.log(err.message)
    }
  }

  useUpdateEffect(() => {
    updateMenuItems(query, activeCategories);
  }, [activeCategories, query]);

  const renderItem = useCallback(({ item }: { item: MenuItemType }) => <MenuItem title={item.title} description={item.description} price={item.price} imageFileName={item.imageFileName} />, []);

  return (
    <View style={styles.container}>
      <Hero setQuery={setQuery} />
      <CategoryFilter categories={categories} activeCategories={activeCategories} toggleCategory={toggleCategory} />
      <FlatList
        keyExtractor={(_, index) => index.toString()}
        data={data}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF'
  },
  menuItem: {
    flexDirection: 'row',
    padding: 20,
    alignContent: 'stretch'
  },
  menuItemContent: {
    flex: 1,
    paddingRight: 20
  },
  menuItemTitle: {
    marginBottom: 10
  },
  menuItemDescription: {
    marginBottom: 10
  },
  menuItemImageContainer: {
    justifyContent: 'flex-end'
  },
  menuItemImage: {
    width: 80,
    height: 80
  },
  separator: {
    borderTopWidth: 1,
    borderColor: '#CCCCCC',
    marginHorizontal: 20
  }
})