import { Platform, Switch, View } from 'react-native'
import { useTranslation } from '@lyftr/shared'
import * as Haptics from 'expo-haptics'
import { useTheme } from '../../theme/useTheme'

// react-native-web draws an on thumb in activeThumbColor, not thumbColor, and defaults it to
// Material teal (#009688), so on web the thumb went green against the brand track.
const WEB_ON_THUMB = (Platform.OS === 'web' ? { activeThumbColor: '#ffffff' } : null) as object

interface Props {
  value: boolean
  onValueChange: (next: boolean) => void
  disabled?: boolean
  accessibilityLabel?: string
}

// The app's boolean control — a themed platform Switch (brand-tinted track) with a
// selection tick on flip, so every on/off setting reads and feels the same. Booleans use
// this instead of a two-segment control (iOS/Hevy/Strong convention).
export function Toggle({ value, onValueChange, disabled = false, accessibilityLabel }: Props) {
  const { colors, accent } = useTheme()
  const { i18n } = useTranslation()
  const control = (
    <Switch
      value={value}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      onValueChange={(v) => {
        Haptics.selectionAsync().catch(() => {})
        onValueChange(v)
      }}
      trackColor={{ false: colors.border, true: accent }}
      thumbColor="#ffffff"
      {...WEB_ON_THUMB}
      ios_backgroundColor={colors.border}
    />
  )
  if (Platform.OS !== 'web') return control
  // react-native-web places the thumb with left/margin-left, which comes apart from the track
  // under dir="rtl". Lay it out left-to-right, then mirror the whole control.
  const rtl = i18n.dir(i18n.language) === 'rtl'
  return <View style={[{ direction: 'ltr' }, rtl && { transform: [{ scaleX: -1 }] }]}>{control}</View>
}
