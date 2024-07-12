import { View, StyleSheet, Image, TextInput } from "react-native";
import { ThemeColors } from "../constants/Colors";
import { BrandText } from "./BrandText";
import BrandTextInput from "./BrandTextInput";
import { useCallback, useMemo, useState } from "react";
import debounce from 'lodash.debounce';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Hero({ setQuery }) {
  const [searchBarText, setSearchBarText] = useState('');

  const lookup = useCallback((q: string) => {
    setQuery(q);
  }, []);

  const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup])

  const handleSearchChange = (text) => {
    setSearchBarText(text);
    debouncedLookup(text);
  };

  return (
    <View style={styles.container}>
      <BrandText type='displayTitle' colorName='primary2' style={styles.title}>Little Lemon</BrandText>
      <View style={styles.contentContainer}>
        <View style={styles.contentText}>
          <BrandText type='subtitle' color={'#FFFFFF'} style={styles.subtitle}>Chicago</BrandText>
          <BrandText type='leadText' color={'#FFFFFF'} style={styles.description}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</BrandText>
        </View>
        <View style={styles.imageContainer}>
          <Image source={require('../assets/hero.png')} style={styles.image} />
        </View>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name='search' size={24} color={ThemeColors.secondary4} />
        <TextInput value={searchBarText} onChangeText={handleSearchChange} style={styles.searchInput} />
      </View>
      {/* <BrandTextInput value={searchBarText} onChangeText={handleSearchChange} /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    paddingHorizontal: 20,
    backgroundColor: ThemeColors.primary1
  },
  title: {
    height: 65
  },
  contentContainer: {
    flexDirection: 'row',
    alignContent: 'stretch',
    marginBottom: 30
  },
  contentText: {
    flex: 1,
    paddingRight: 20
  },
  subtitle: {
    marginBottom: 20
  },
  description: {

  },
  imageContainer: {
    width: 140,
    justifyContent: 'flex-end'
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 16
  },
  searchBar: {
    backgroundColor: ThemeColors.secondary3,
    marginBottom: 30,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    height: 50,
    fontSize: 16
  }
})