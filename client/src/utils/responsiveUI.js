import { useMediaQuery } from 'react-responsive'


const SCREENWIDTH = {
  DESKTOP: {
    MIN: 992
  },
  TABLET: {
    MIN: 768,
    MAX: 991
  },
  MOBILE: {
    MAX: 767
  },

}


export const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: SCREENWIDTH.DESKTOP.MIN })
  return isDesktop ? children : null
}

export const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: SCREENWIDTH.TABLET.MIN, maxWidth: SCREENWIDTH.TABLET.MAX })
  return isTablet ? children : null
}
export const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: SCREENWIDTH.MOBILE.MAX })
  return isMobile ? children : null
}
export const Default = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: SCREENWIDTH.NOTMOBILE.MIN })
  return isNotMobile ? children : null
}