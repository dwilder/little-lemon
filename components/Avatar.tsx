import { useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, Alert, Pressable } from "react-native";
import { ThemeColors } from "../constants/Colors";
import AuthContext from "../contexts/AuthContext";
import { type ParamListBase, type RouteProp } from "@react-navigation/native";

export type AvatarProps = {
  size?: 'default' | 'small';
  avatarOverrideUri?: string;
  forceNullAvatar?: boolean;
  avatarInitialsOverride?: string;
  route?: RouteProp<ParamListBase, string>;
  navigation?: any;
}

const defaultDiameter = 80;
const smallDiameter = 40;

export default function Avatar({ size = 'default', avatarOverrideUri, forceNullAvatar = false, avatarInitialsOverride, route, navigation }: AvatarProps) {
  const { avatarInitials, avatarUri } = useContext(AuthContext);
  return (
    <Pressable onPress={() => {
      if (route && route?.name !== 'Profile') {
        navigation?.navigate('Profile');
      }
    }}>
      {!forceNullAvatar && avatarUri || avatarOverrideUri ? (
        <Image source={{ uri: avatarOverrideUri || avatarUri }} style={[
          size === 'default' ? styles.default : undefined,
          size === 'small' ? styles.small : undefined
        ]} />
      ) : (
        <View style={[
          size === 'default' ? styles.default : undefined,
          size === 'small' ? styles.small : undefined,
          styles.placeholderContainer
        ]}>
          <Text style={[
            size === 'default' ? styles.defaultText : undefined,
            size === 'small' ? styles.smallText : undefined,
            styles.text
          ]}>{avatarInitialsOverride || avatarInitials}</Text>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  default: {
    height: defaultDiameter,
    width: defaultDiameter,
    borderRadius: defaultDiameter / 2
  },
  small: {
    height: smallDiameter,
    width: smallDiameter,
    borderRadius: smallDiameter / 2
  },
  placeholderContainer: {
    backgroundColor: ThemeColors.secondary1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    textTransform: 'uppercase',
    color: '#FFFFFF'
  },
  defaultText: {
    fontSize: 36
  },
  smallText: {
    fontSize: 18
  }
});