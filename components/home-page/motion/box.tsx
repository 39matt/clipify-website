import { ChakraProps, chakra, shouldForwardProp } from '@chakra-ui/react'
import { HTMLMotionProps, isValidMotionProp, motion } from 'framer-motion'
import * as React from 'react'

export interface MotionBoxProps
  extends Omit<HTMLMotionProps<'div'>, 'children' | 'style'>,
    Omit<ChakraProps, 'transition' | 'color'> {
  children?: React.ReactNode
}

const ChakraMotionDiv = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop),
})

export const MotionBox: React.FC<MotionBoxProps> = (props) => {
  return <ChakraMotionDiv {...(props as any)} />
}
