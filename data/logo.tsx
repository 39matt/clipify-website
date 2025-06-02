import { Image, HTMLChakraProps } from '@chakra-ui/react'

export const Logo: React.FC<HTMLChakraProps<'img'>> = (props) => {
  return (
    <Image
      src='/static/images/clipify.jpg'
      alt="Clipify Logo"
      {...props}
    />
  )
}