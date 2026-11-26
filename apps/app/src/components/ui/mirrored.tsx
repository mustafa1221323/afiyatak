import { I18nManager, Platform, View } from 'react-native'
import { useTranslation } from '@lyftr/shared'
import type { LucideIcon, LucideProps } from './icons'

// Icons that point along the reading direction are flipped in right-to-left layouts. Native
// follows the direction the app launched with; web follows the current language.
export function mirrored(Glyph: LucideIcon): LucideIcon {
  const Mirrored = ({ style, ...props }: LucideProps) => {
    const { i18n } = useTranslation()
    const rtl = Platform.OS === 'web' ? i18n.dir(i18n.language) === 'rtl' : I18nManager.isRTL
    if (!rtl) return <Glyph {...props} style={style} />
    // Flipped on a wrapper: lucide copies its props onto every <path>, so a transform on the
    // glyph would be applied a second time to each path and push it out of view.
    return (
      <View style={[style as object, { transform: [{ scaleX: -1 }] }]}>
        <Glyph {...props} />
      </View>
    )
  }
  return Mirrored as unknown as LucideIcon
}
