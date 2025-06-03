import { Image, HTMLChakraProps } from '@chakra-ui/react'

export const Logo: React.FC<HTMLChakraProps<'img'>> = (props) => {
  return (
    <Image
      src='/static/images/clipify.png'
      alt="Clipify Logo"
      {...props}
    />
  )
}