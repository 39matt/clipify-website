import { Image, HTMLChakraProps } from '@chakra-ui/react'

export const Logo: React.FC<HTMLChakraProps<'img'>> = (props) => {
  return (
    <Image
      src='/static/images/clipify2.png'
      alt="Clipify Logo"
      {...props}
    />
  )
}