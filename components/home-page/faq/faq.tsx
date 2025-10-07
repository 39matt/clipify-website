import { chakra, Box, Flex, Collapse, Icon, Container, Heading, VStack } from '@chakra-ui/react'
import { SectionProps } from '#components/home-page/section';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface FaqProps extends Omit<SectionProps, 'title' | 'children'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: { q: React.ReactNode; a: React.ReactNode }[];
}

export const Faq: React.FC<FaqProps> = (props) => {
  const {
    title = 'Frequently asked questions',
    description,
    items = [],
  } = props;

  return (
    <Box bg="gray.900" py={32}>
      <Container id="faq" maxW="85%" mx="auto">
        <Heading
          as="h1"
          fontSize={['28px', '36px', '44px']}
          bgGradient="linear(to-r, white, #10b981)"
          bgClip="text"
          textAlign="center"
          fontWeight="extrabold"
          mb={12}
        >
          {title}
        </Heading>
        <VStack spacing={3} w="full">
          {items?.map(({ q, a }, i) => {
            return <FaqItem key={i} question={q} answer={a} />;
          })}
        </VStack>
      </Container>
    </Box>
  );
};

export interface FaqItemProps {
  question: React.ReactNode;
  answer: React.ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Box
      w="full"
      bg="rgba(17, 24, 39, 0.8)"
      backdropFilter="blur(20px) saturate(180%)"
      borderRadius="2xl"
      border="2px solid"
      borderColor="rgba(75, 85, 99, 0.3)"
      p={[4, 5]}
      color="white"
      boxShadow="0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
      _hover={{
        cursor: 'pointer',
        borderColor: "#10b981",
        bg: "rgba(17, 24, 39, 0.9)",
        transform: "translateY(-4px) scale(1.01)",
        boxShadow: "0 30px 60px rgba(16, 185, 129, 0.1), 0 12px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
      }}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      onClick={toggle}
      position="relative"
      overflow="hidden"
    >
      {/* Glowing border effect */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        borderRadius="2xl"
        bg="linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent, rgba(59, 130, 246, 0.1))"
        opacity="0.5"
        zIndex="-1"
      />

      {/* Top gradient line */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="1px"
        bgGradient="linear(to-r, transparent, rgba(16, 185, 129, 0.3), transparent)"
        zIndex="1"
      />

      <Flex justify="space-between" align="center" position="relative" zIndex="2">
        <chakra.dt
          fontWeight="semibold"
          fontSize={["md", "lg", "xl"]}
          pr={4}
          color="white"
          flex="1"
        >
          {question}
        </chakra.dt>
        <Box
          bg={isOpen
            ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))"
            : "rgba(55, 65, 81, 0.5)"
          }
          borderRadius="full"
          w="32px"
          h="32px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="2px solid"
          borderColor={isOpen ? "#10b981" : "rgba(75, 85, 99, 0.5)"}
          backdropFilter="blur(10px)"
          boxShadow={isOpen
            ? "0 8px 25px rgba(16, 185, 129, 0.3)"
            : "0 8px 20px rgba(0,0,0,0.3)"
          }
          transition="all 0.3s ease"
          flexShrink={0}
          _hover={{
            transform: "scale(1.05)",
            borderColor: "#10b981",
          }}
        >
          <Icon
            as={isOpen ? FiChevronUp : FiChevronDown}
            boxSize={4}
            color={isOpen ? "#10b981" : "gray.400"}
            transition="all 0.3s ease"
          />
        </Box>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box
          mt={4}
          pt={4}
          borderTop="1px solid"
          borderColor="rgba(75, 85, 99, 0.3)"
          position="relative"
          zIndex="2"
        >
          <chakra.dd
            fontSize={["sm", "md", "lg"]}
            color="gray.300"
            lineHeight="relaxed"
            fontWeight="normal"
          >
            {answer}
          </chakra.dd>
        </Box>
      </Collapse>
    </Box>
  );
};