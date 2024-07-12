import { Image, StyleSheet } from "react-native";

export default function LogoTitle() {
  return (
    <Image source={require('../assets/logo.png')} style={styles.logo} />
  )
}

const styles = StyleSheet.create({
  logo: {
    width: 150,
    height: 40
  }
});