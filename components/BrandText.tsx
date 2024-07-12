import { ThemeColors } from '../constants/Colors';
import { Text, type TextProps, StyleSheet } from 'react-native';

export type BrandTextProps = TextProps & {
  type?: 'paragraph' | 'displayTitle' | 'subtitle' | 'leadText' | 'sectionTitle' | 'sectionCategory' | 'cardTitle' | 'highlightText';
  colorName?: 'primary1' | 'primary2' | 'secondary1' | 'secondary2' | 'secondary3' | 'secondary4';
  color?: string;
};

export function BrandText({
  style,
  type = 'paragraph',
  colorName = 'secondary4',
  color = '',
  ...rest
}: BrandTextProps) {
  color = color || ThemeColors[colorName] || ThemeColors.secondary4;

  return (
    <Text
      style={[
        { color },
        type === 'paragraph' ? styles.paragraph : undefined,
        type === 'displayTitle' ? styles.displayTitle : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'leadText' ? styles.leadText : undefined,
        type === 'sectionTitle' ? styles.sectionTitle : undefined,
        type === 'sectionCategory' ? styles.sectionCategory : undefined,
        type === 'cardTitle' ? styles.cardTitle : undefined,
        type === 'highlightText' ? styles.highlightText : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: 'KarlaRegular',
    fontWeight: '300',
    fontSize: 16,
    lineHeight: 24
  },
  displayTitle: {
    fontFamily: 'MerkaziText',
    fontWeight: '400',
    fontSize: 64
  },
  subtitle: {
    fontFamily: 'MerkaziText',
    fontWeight: '300',
    fontSize: 40
  },
  leadText: {
    fontFamily: 'KarlaRegular',
    fontWeight: '400',
    fontSize: 18
  },
  sectionTitle: {
    fontFamily: 'KarlaRegular',
    fontWeight: '800',
    fontSize: 20,
    textTransform: 'uppercase'
  },
  sectionCategory: {
    fontFamily: 'KarlaRegular',
    fontWeight: '800',
    fontSize: 16,
  },
  cardTitle: {
    fontFamily: 'KarlaRegular',
    fontWeight: '700',
    fontSize: 18,
  },
  highlightText: {
    fontFamily: 'KarlaRegular',
    fontWeight: '400',
    fontSize: 16,
  }
});
